import * as XLSX from 'xlsx';
import { readDir, readFile } from '@tauri-apps/plugin-fs';
import { basename } from "@tauri-apps/api/path";
import JSZip from 'jszip';

interface AttendanceStatus {
    time: string;
    status: string;
}

interface StudentRecord {
    attendanceRecords: AttendanceStatus[];
    attendanceRate: number;
}

interface StudentMap {
    [studentName: string]: StudentRecord;
}

interface ProcessResult {
    logs: string[];
    result: Uint8Array | null;
}

interface WeekTimeMap {
    week: number;
    times: Date[];
}

export class RosterGenerator {
    private logs: string[] = [];
    private weekTimeMapping: WeekTimeMap[] = [];
    
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

    private parseStudentData(worksheet: XLSX.WorkSheet): StudentMap {
        // 从第10行开始读取学生数据
        const rawData = XLSX.utils.sheet_to_json(worksheet, { 
            range: 9,  // 从第10行开始
            header: 'A',  // 使用A,B,C...作为临时表头
        });
        const maxCol = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']).e.c : 100;

        const studentMap: StudentMap = {};

        // 处理每个学生的数据
        rawData.forEach((row: any) => {
            const name = row['A']; // 第一列是姓名
            if (!name) return;

            const studentRecord: StudentRecord = {
                attendanceRecords: [],
                attendanceRate: 0
            };

            // 获取最后一列的列标识（从表格数据中获取）
            let currentColIndex = 6;  // G列的索引是6（A=0, B=1, ..., G=6）
            
            // 从第7列开始是签到数据（前6列是基本信息）
            // 每三列一组：时间、状态、位置
            while (currentColIndex < maxCol) {
                const col = XLSX.utils.encode_col(currentColIndex);
                const time = row[col];
                const status = row[String.fromCharCode(col.charCodeAt(0) + 1)]; // 下一列是状态
                
                if (status) {
                    studentRecord.attendanceRecords.push({
                        time: time || '',
                        status
                    });
                } else {
                    break;
                }
                
                // 跳过三列（时间、状态、位置）到下一组
                currentColIndex += 3;
            }

            studentMap[name] = studentRecord;
        });

        return studentMap;
    }

    private calculateAttendanceStats(studentMap: StudentMap): void {
        for (const [_, studentRecord] of Object.entries(studentMap)) {
            const attendanceList = studentRecord.attendanceRecords.map(record => 
                record.status && record.status !== '未参与' ? 1 : 0
            );

            const attendedCount: number = attendanceList.reduce((sum: number, curr: number): number => sum + curr, 0);
            studentRecord.attendanceRate = attendedCount / attendanceList.length;
        }
    }

    // 新增：从点名册中获取周数
    private getWeeksFromRoster(worksheet: XLSX.WorkSheet): number[] {
        const headerRow = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            range: 4 // 第5行
        })[0] as string[];
        
        const weeks: number[] = [];
        headerRow.forEach((header) => {
            const weekNum = parseInt(header);
            if (!isNaN(weekNum)) {
                weeks.push(weekNum);
            }
        });
        
        return weeks.sort((a, b) => a - b); // 确保周数按顺序排列
    }

    // 新增：解析时间字符串为Date对象,只保留日期部分
    private parseDateTime(dateStr: string): Date | null {
        if (!dateStr) return null;
        try {
            const date = new Date(dateStr);
            // 设置时间为当天的0点0分0秒
            date.setHours(0, 0, 0, 0);
            return date;
        } catch {
            return null;
        }
    }

    // 新增：建立周数与签到时间的映射关系
    private buildWeekTimeMapping(weeks: number[], studentMap: StudentMap): void {
        this.weekTimeMapping = weeks.map(week => ({
            week,
            times: []
        }));

        // 获取所有学生的签到时间
        const allRecords: string[] = [];
        for (const student of Object.values(studentMap)) {
            allRecords.push(...student.attendanceRecords.map(record => record.time));
        }

        // 直接在map过程中去除重复的时间戳，然后转换为Date对象
        const uniqueRecords = [...new Set(
            allRecords
                .map(record => this.parseDateTime(record))
                .filter((date): date is Date => date !== null)  // 使用类型谓词确保类型安全
                .map(date => date.getTime())
        )]
        .map(timestamp => new Date(timestamp))
        .sort((a, b) => a.getTime() - b.getTime());  // 直接在这里添加排序
        // console.log("uniqueRecords", uniqueRecords);

        let currentWeekIndex = 0;
        let lastTime: Date | null = null;

        // 遍历所有签到记录
        for (const record of uniqueRecords) {
            const currentTime = record;
            if (!currentTime) continue;

            // 如果是第一条记录
            if (!lastTime) {
                this.weekTimeMapping[currentWeekIndex].times.push(currentTime);
                lastTime = currentTime;
                continue;
            }

            // 计算与上一次签到的时间差（天数）
            const diffDays = Math.floor(
                (currentTime.getTime() - lastTime.getTime()) / (1000 * 60 * 60 * 24)
            );

            // 如果时间差小于7天，添加到当前周
            if (diffDays < 7) {
                this.weekTimeMapping[currentWeekIndex].times.push(currentTime);
            } else {
                // 移动到下一周
                currentWeekIndex++;
                if (currentWeekIndex < this.weekTimeMapping.length) {
                    this.weekTimeMapping[currentWeekIndex].times.push(currentTime);
                }
                lastTime = currentTime;
            }
        }

        // 输出映射信息到日志
        // this.writeLog("\n周数与签到时间映射关系：");
        // this.weekTimeMapping.forEach(({ week, times }) => {
        //     if (times.length > 0) {
        //         this.writeLog(`第${week}周: ${times.map(t => t.toLocaleString()).join(', ')}`);
        //     }
        // });
    }

    // 修改：更新获取周数的方法
    private getWeekNumber(dateStr: string): number | null {
        if (!dateStr) return null;
        
        const date = this.parseDateTime(dateStr);
        if (!date) return null;

        // 在映射表中查找对应的周数
        for (const { week, times } of this.weekTimeMapping) {
            for (const mappedTime of times) {
                // 如果时间差在24小时内，认为是同一次课的签到
                const diffHours = Math.abs(date.getTime() - mappedTime.getTime()) / (1000 * 60 * 60);
                if (diffHours <= 24) {
                    return week;
                }
            }
        }

        return null;
    }

    // 修改：更新点名册处理方法
    private async updateRoster(
        rosterPath: string, 
        studentMap: StudentMap
    ): Promise<Uint8Array> {
        const workbook = await this.readExcelFile(rosterPath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // 获取周数并建立映射关系
        const weeks = this.getWeeksFromRoster(worksheet);
        this.buildWeekTimeMapping(weeks, studentMap);

        // 读取表头（第5行）获取周数列的位置
        const headerRow = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            range: 4 // 第5行
        })[0] as string[];
        
        // 获取周数列的索引
        const weekColumns = new Map<number, number>();
        headerRow.forEach((header, index) => {
            const weekNum = parseInt(header);
            if (!isNaN(weekNum)) {
                weekColumns.set(weekNum, index);
            }
        });

        // 读取学生数据（从第6行开始）
        const data = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            range: 5 // 从第6行开始
        }) as any[][];

        // 记录未找到的学生
        const notFoundStudents: string[] = [];

        // 更新考勤数据
        data.forEach(row => {
            const studentName = row[2]; // 假设姓名在第3列
            if (studentMap[studentName]) {
                const weeklyAttendance = this.calculateWeeklyAttendance(studentMap[studentName]);
                
                // 填入每周考勤次数
                weekColumns.forEach((colIndex, weekNum) => {
                    row[colIndex] = weeklyAttendance.get(weekNum) || 0;
                });
            } else if (studentName) { // 只记录有姓名的行
                notFoundStudents.push(studentName);
            }
        });

        this.writeInfoLog(`教务处点名册学生数据: ${data.length} 行`);
        // 输出未找到的学生名单
        if (notFoundStudents.length > 0) {
            this.writeWarningLog(`以下学生未找到签到记录：`);
            notFoundStudents.forEach(name => {
                this.writeWarningLog(`  > ${name} `);
            });
            this.writeWarningLog(`共 ${notFoundStudents.length} 名学生未找到签到记录\n`);
        }

        // 创建新的工作簿
        const newWorkbook = XLSX.utils.book_new();
        const newWorksheet = XLSX.utils.aoa_to_sheet([
            ...(XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, defval: '' }) as any[][]).slice(0, 5), // 保留前5行原始数据
            ...data
        ]);

        // 复制原始工作表的样式和合并单元格信息
        if (worksheet['!merges']) newWorksheet['!merges'] = worksheet['!merges'];
        if (worksheet['!cols']) newWorksheet['!cols'] = worksheet['!cols'];
        if (worksheet['!rows']) newWorksheet['!rows'] = worksheet['!rows'];

        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");
        
        // 转换为二进制数据
        return new Uint8Array(XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' }));
    }

    // 新增：统计每周考勤次数
    private calculateWeeklyAttendance(studentRecord: StudentRecord): Map<number, number> {
        const weeklyCount = new Map<number, number>();
        
        for (const record of studentRecord.attendanceRecords) {
            const week = this.getWeekNumber(record.time);
            if (week !== null) {
                const isPresent = record.status !== '未参与';
                weeklyCount.set(week, (weeklyCount.get(week) || 0) + (isPresent ? 1 : 0));
            }
        }
        
        return weeklyCount;
    }

    async process(attendancePath: string, rosterPath: string): Promise<ProcessResult> {
        this.logs = [];
        this.writeLog(`开始处理时间: ${new Date().toLocaleString()}`);

        try {
            const results = new Map<string, Uint8Array>();
            
            // 获取并筛选文件
            const attendanceFiles = (await readDir(attendancePath))
                .filter(f => 
                    (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
                    !f.name?.startsWith('~$')
                );

            const rosterFiles = (await readDir(rosterPath))
                .filter(f => 
                    (f.name?.endsWith('.xlsx') || f.name?.endsWith('.xls')) && 
                    !f.name?.startsWith('~$')
                );

            this.writeInfoLog(`找到签到文件数量: ${attendanceFiles.length}`);
            this.writeInfoLog(`找到点名册文件数量: ${rosterFiles.length}`);

            // 处理每个班级的文件
            for (const attendanceFile of attendanceFiles) {
                if (!attendanceFile.name) continue;
                
                const className = await basename(attendanceFile.name, '.xlsx');
                this.writeLog(`\n`);
                this.writeInfoLog(`处理班级: ${className}`);

                // 查找对应的点名册文件
                const rosterFile = rosterFiles.find(f => 
                    f.name?.includes(className)
                );

                if (!rosterFile?.name) {
                    this.writeWarningLog(`未找到${className}的点名册文件，跳过处理`);
                    continue;
                }

                // 处理签到数据
                const workbook = await this.readExcelFile(`${attendancePath}/${attendanceFile.name}`);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // 获取考勤数据
                const studentMap = this.parseStudentData(worksheet);
                this.calculateAttendanceStats(studentMap);

                // 更新点名册
                const updatedRoster = await this.updateRoster(
                    `${rosterPath}/${rosterFile.name}`,
                    studentMap
                );
                
                results.set(className, updatedRoster);
                this.writeSuccessLog(`成功更新点名册: ${rosterFile.name}`);
            }

            // 生成压缩包
            const zip = new JSZip();
            for (const [className, data] of results.entries()) {
                zip.file(`${className}.xlsx`, data);
            }
            
            const zipData = await zip.generateAsync({ type: "uint8array" });

            this.writeLog(`\n处理结束时间: ${new Date().toLocaleString()}`);
            
            return {
                logs: this.logs,
                result: zipData
            };

        } catch (err) {
            this.writeErrorLog(`处理过程出错: ${err}`);
            return {
                logs: this.logs,
                result: null
            };
        }
    }
}