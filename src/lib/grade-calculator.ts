import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { readDir, readFile } from '@tauri-apps/plugin-fs';

interface StudentRecord {
  attendanceCount: number;
  attendanceRate: number;
  homeworkCompleted: boolean;
  finalScore: number;
}

interface ProcessResult {
  logs: string[];
  result: Uint8Array | null;
}

export class GradeCalculator {
  private logs: string[] = [];
  
  private writeLog(message: string) {
    this.logs.push(message);
    return message;
  }

  private writeWarningLog(message: string) {
    this.logs.push(`⚠️ ${message}`);
  }

  private writeSuccessLog(message: string) {
    this.logs.push(`✅ ${message}`);
  }

  private writeErrorLog(message: string) {
    this.logs.push(`❌ 错误: ${message}`);
  }

  private writeInfoLog(message: string) {
    this.logs.push(`ℹ️ ${message}`);
  }

  private async readExcelFile(filePath: string): Promise<XLSX.WorkBook> {
    const buffer = await readFile(filePath);
    return XLSX.read(buffer);
  }

  private async processAttendanceFiles(folderPath: string): Promise<[{ [key: string]: StudentRecord }, number]> {
    const studentDict: { [key: string]: StudentRecord } = {};
    const files = await readDir(folderPath);
    
    // 筛选签到文件
    const attendanceFiles = files.filter(f => 
      (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
      f.name?.includes('签到统计详情') &&
      !f.name?.startsWith('~$')
    );

    const totalAttendance = attendanceFiles.length;
    this.writeInfoLog(`${folderPath}签到文件处理情况:`);
    this.writeLog(`找到签到文件数量: ${totalAttendance}`);

    for (const file of attendanceFiles) {
      if (!file.name) continue;
      
      const workbook = await this.readExcelFile(`${folderPath}/${file.name}`);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1});

      const headers = data[5]
      const values = data.slice(6);
      const formattedData = values.map(row => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      });
      
      const studentCount = formattedData.length;
      this.writeInfoLog(`文件 ${file.name} 中的学生数: ${studentCount}`);

      for (const row of formattedData) {
        const studentName = row['姓名'];
        const status = row['签到状态'];

        if (!studentDict[studentName]) {
          studentDict[studentName] = {
            attendanceCount: 0,
            attendanceRate: 0,
            homeworkCompleted: true,
            finalScore: 0
          };
        }

        if (status !== "未参与") {
          studentDict[studentName].attendanceCount++;
        }
      }
    }

    // 计算签到率
    for (const student in studentDict) {
      studentDict[student].attendanceRate = 
        studentDict[student].attendanceCount / totalAttendance;
    }

    return [studentDict, totalAttendance];
  }

  private async processHomework(folderPath: string, studentDict: { [key: string]: StudentRecord }) {
    const files = await readDir(folderPath);
    const homeworkFiles = files.filter(f => 
      (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
      f.name?.includes('课程平时作业') &&
      !f.name?.startsWith('~$')
    );

    this.writeInfoLog(`${folderPath}作业完成情况处理:`);
    
    if (homeworkFiles.length > 0 && homeworkFiles[0].name) {
      const workbook = await this.readExcelFile(`${folderPath}/${homeworkFiles[0].name}`);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

      const headers = data[1]
      const values = data.slice(3);
      const formattedData = values.map(row => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      });
      
      const studentCount = formattedData.length;
      this.writeInfoLog(`作业文件 ${homeworkFiles[0].name} 中的学生数: ${studentCount}`);

      let uncompleted = 0;
      for (const row of formattedData) {
        if (!row['学生姓名']) continue;
        const studentName = row['学生姓名'];
        const status = row['状态'];

        if (studentDict[studentName] && status === "未交") {
          studentDict[studentName].homeworkCompleted = false;
          uncompleted++;
        }
      }

      this.writeInfoLog(`未完成作业的学生数: ${uncompleted}`);
      this.writeInfoLog(`作业完成率: ${((studentCount-uncompleted)/studentCount*100).toFixed(2)}%`);
    }
  }

  private calculateFinalScore(studentDict: { [key: string]: StudentRecord }, threshold: number) {
    for (const student in studentDict) {
      const record = studentDict[student];
      if (record.homeworkCompleted) {
        record.finalScore = record.attendanceRate >= threshold ? 100 : 90;
      } else {
        record.finalScore = record.attendanceRate >= threshold ? 80 : 0;
      }
    }
  }

  private async updateScoresInSystem(
    folderPath: string, 
    studentDict: { [key: string]: StudentRecord }
  ): Promise<Uint8Array | null> {
    const files = await readDir(folderPath);
    const systemFiles = files.filter(f => 
      (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
      f.name?.includes('教务系统名单') &&
      !f.name?.startsWith('~$')
    );

    if (systemFiles.length > 0 && systemFiles[0].name) {
      const workbook = await this.readExcelFile(`${folderPath}/${systemFiles[0].name}`);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

      const headers = data[1]
      const values = data.slice(2);
      const formattedData = values.map(row => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      });

      this.writeInfoLog(`教务系统名单处理:`);
      this.writeInfoLog(`教务系统名单中的学生数: ${formattedData.length}`);

      let foundCount = 0;
      let notFoundCount = 0;
      const notFoundStudents: string[] = [];

      // 更新成绩
      const updatedData = formattedData.map(row => {
        const studentName = row['姓名'];
        if (studentDict[studentName]) {
          foundCount++;
          return { ...row, '平时成绩': studentDict[studentName].finalScore };
        } else {
          notFoundCount++;
          notFoundStudents.push(studentName);
          return row;
        }
      });

      this.writeInfoLog(`成绩更新统计:`);
      this.writeSuccessLog(`成功更新成绩的学生数: ${foundCount}`);
      this.writeWarningLog(`未找到的学生数: ${notFoundCount}`);
      if (notFoundStudents.length > 0) {
        this.writeWarningLog('以下学生未找到签到记录：');
        notFoundStudents.forEach(name => {
          this.writeWarningLog(`  > ${name}`);
        });
      }

      // 创建新的工作簿并写入数据
      const newWorkbook = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

      // 将工作簿转换为二进制数据
      const wbout = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' });
      return new Uint8Array(wbout);
    }
    return null;
  }

  async process(folderPath: string, threshold: number): Promise<ProcessResult> {
    this.logs = [];
    this.writeLog(`开始处理时间: ${new Date().toLocaleString()}`);
    this.writeLog(`签到率阈值设置为: ${(threshold * 100).toFixed(1)}%`);

    try {
      // 获取并筛选文件
      const files = await readDir(folderPath);
      const attendanceFiles = files.filter(f => 
        (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
        f.name?.includes('签到统计详情') &&
        !f.name?.startsWith('~$')
      );

      const homeworkFiles = files.filter(f => 
        (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
        f.name?.includes('课程平时作业') &&
        !f.name?.startsWith('~$')
      );

      const systemFiles = files.filter(f => 
        (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
        f.name?.includes('教务系统名单') &&
        !f.name?.startsWith('~$')
      );

      this.writeInfoLog(`找到签到文件数量: ${attendanceFiles.length}`);
      this.writeInfoLog(`找到作业文件数量: ${homeworkFiles.length}`);
      this.writeInfoLog(`找到教务系统名单数量: ${systemFiles.length}`);

      // 处理签到数据
      if (attendanceFiles.length === 0) {
        this.writeWarningLog('未找到签到文件，请检查文件夹');
        return { logs: this.logs, result: null };
      }

      // 处理签到文件
      const [studentDict, _] = await this.processAttendanceFiles(folderPath);

      // 处理作业情况
      await this.processHomework(folderPath, studentDict);

      // 计算最终成绩
      this.calculateFinalScore(studentDict, threshold);

      // 更新教务系统名单
      const result = await this.updateScoresInSystem(folderPath, studentDict);

      this.writeLog(`\n处理结束时间: ${new Date().toLocaleString()}`);
      
      return {
        logs: this.logs,
        result: result
      };

    } catch (err) {
      this.writeErrorLog(`处理过程出错: ${err}`);
      return {
        logs: this.logs,
        result: null
      };
    }
  }

  async generateZip(results: Map<string, Uint8Array>): Promise<Uint8Array> {
    const zip = new JSZip();
    
    for (const [className, data] of results.entries()) {
      zip.file(`${className}成绩.xlsx`, data);
    }
    
    return await zip.generateAsync({ type: "uint8array" });
  }
} 