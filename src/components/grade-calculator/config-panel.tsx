import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen, Play, FileDown } from "lucide-react";
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';
import { GradeCalculator } from "@/lib/grade-calculator";
import { basename } from "@tauri-apps/api/path";

interface ConfigPanelProps {
  onProcess: (logs: string[]) => void;
}

export function ConfigPanel({ onProcess }: ConfigPanelProps) {
  const [folderPaths, setFolderPaths] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<number>(50);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<Map<string, Uint8Array>>(new Map());

  const handleSelectFolders = async () => {
    try {
      // 打开文件夹选择对话框
      const selected = await open({
        directory: true,
        multiple: true,
      });

      if (selected && Array.isArray(selected)) {
        setFolderPaths(selected);
        setResults(new Map());
        onProcess([]);
      }
    } catch (err) {
      console.error('选择文件夹时出错:', err);
    }
  };

  const handleProcess = async () => {
    // 清空之前的结果
    setResults(new Map());
    onProcess([]);

    setProcessing(true);

    try {
      const calculator = new GradeCalculator();
      const newResults = new Map<string, Uint8Array>();
      const allLogs: string[] = [];

      // 处理每个文件夹
      for (const folderPath of folderPaths) {
        allLogs.push(`\n========== 开始处理文件夹: ${folderPath} ==========\n`);
        const result = await calculator.process(folderPath, threshold / 100);
        allLogs.push(...result.logs);

        if (result.result) {
          newResults.set(await basename(folderPath), result.result);
        }
      }

      setResults(newResults);
      onProcess(allLogs);
    } catch (err) {
      console.error('处理过程出错:', err);
      onProcess([`处理过程出错: ${err}`]);
    }
    setProcessing(false);
  };

  const handleExport = async () => {
    if (results.size === 0) return;

    try {
      // 选择保存位置
      const savePath = await save({
        defaultPath: `平时成绩_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`,
        filters: [{
          name: 'ZIP Archive',
          extensions: ['zip']
        }]
      });

      if (savePath) {
        const calculator = new GradeCalculator();
        const zipData = await calculator.generateZip(results);
        await writeFile(savePath, zipData);
        onProcess([`\n成功导出到: ${savePath}`]);
      }
    } catch (err) {
      console.error('导出结果时出错:', err);
      onProcess([`导出结果时出错: ${err}`]);
    }
  };

  return (
    <div className="w-full h-full p-4 border rounded-lg bg-card flex flex-col gap-4">
      <div className="space-y-4">
        {/* 文件夹选择 */}
        <div className="space-y-2">
          <Label>文件夹位置</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              placeholder="选择文件夹..."
              value={folderPaths.length ? `已选择 ${folderPaths.length} 个文件夹` : ''}
              title={folderPaths.join('\n')}
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={handleSelectFolders}
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
          {folderPaths.length > 0 && (
            <div className="text-sm text-muted-foreground max-h-[100px] overflow-auto">
              {folderPaths.map((path, index) => (
                <div key={index} className="truncate" title={path}>
                  {index + 1}. {path}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 签到率阈值 */}
        <div className="space-y-2">
          <Label>签到率阈值 (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            placeholder="例如：80"
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-auto space-y-2">
        <Button
          className="w-full"
          size="lg"
          disabled={folderPaths.length === 0 || processing}
          onClick={handleProcess}
        >
          <Play className="mr-2 h-4 w-4" />
          {processing ? "处理中..." : "开始处理"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          disabled={folderPaths.length === 0 || results.size === 0}
          onClick={handleExport}
        >
          <FileDown className="mr-2 h-4 w-4" />
          导出结果
        </Button>
      </div>
    </div>
  );
} 