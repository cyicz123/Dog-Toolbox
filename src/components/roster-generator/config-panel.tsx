import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen, Play, FileDown } from "lucide-react";
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { RosterGenerator } from "@/lib/attendance";

interface ConfigPanelProps {
  onProcess: (logs: string[]) => void;
}

export function ConfigPanel({ onProcess }: ConfigPanelProps) {
  const [attendancePath, setAttendancePath] = useState<string>('');
  const [rosterPath, setRosterPath] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const handleSelectAttendanceFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected && !Array.isArray(selected)) {
        setAttendancePath(selected);
        setResult(null);
        onProcess([]);
      }
    } catch (err) {
      console.error('选择签到文件夹时出错:', err);
    }
  };

  const handleSelectRosterFile = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected && !Array.isArray(selected)) {
        setRosterPath(selected);
        setResult(null);
        onProcess([]);
      }
    } catch (err) {
      console.error('选择点名册文件夹时出错:', err);
    }
  };

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const generator = new RosterGenerator();
      const result = await generator.process(attendancePath, rosterPath);
      onProcess(result.logs);
      if (result.result) {
        setResult(result.result);
      }
    } catch (err) {
      console.error('处理过程出错:', err);
      onProcess([`处理过程出错: ${err}`]);
    }
    setProcessing(false);
  };

  const handleExport = async () => {
    if (!result) return;

    try {
      const savePath = await save({
        defaultPath: `点名册_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`,
        filters: [{
          name: 'Zip File',
          extensions: ['zip']
        }]
      });

      if (savePath) {
        await writeFile(savePath, result);
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
        {/* 签到文件夹选择 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label>签到文件夹</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>选择包含学习通签到记录的文件夹</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              placeholder="选择文件夹..."
              value={attendancePath || ''}
              title={attendancePath}
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={handleSelectAttendanceFolder}
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 点名册文件夹选择 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label>点名册文件夹</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>选择包含教务处点名册的文件夹</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              placeholder="选择文件夹..."
              value={rosterPath || ''}
              title={rosterPath}
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={handleSelectRosterFile}
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-auto space-y-2">
        <Button
          className="w-full"
          size="lg"
          disabled={!attendancePath || !rosterPath || processing}
          onClick={handleProcess}
        >
          <Play className="mr-2 h-4 w-4" />
          {processing ? "处理中..." : "开始处理"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          disabled={!result}
          onClick={handleExport}
        >
          <FileDown className="mr-2 h-4 w-4" />
          导出结果
        </Button>
      </div>
    </div>
  );
} 