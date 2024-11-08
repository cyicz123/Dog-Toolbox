import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen, Play, FileDown } from "lucide-react";
import { open } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';

export function ConfigPanel() {
  const [folderPath, setFolderPath] = useState<string>('');

  const handleSelectFolder = async () => {
    try {
      // 打开文件夹选择对话框
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: folderPath || undefined,
      });
      
      // 如果用户选择了文件夹
      if (selected && !Array.isArray(selected)) {
        setFolderPath(selected);
      }
    } catch (err) {
      console.error('选择文件夹时出错:', err);
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
              value={folderPath}
              title={folderPath} // 添加 title 属性以便在路径过长时显示完整路径
            />
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handleSelectFolder}
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 签到率阈值 */}
        <div className="space-y-2">
          <Label>签到率阈值 (%)</Label>
          <Input 
            type="number" 
            min={0} 
            max={100} 
            defaultValue={50} 
            placeholder="例如：80" 
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-auto space-y-2">
        <Button 
          className="w-full" 
          size="lg"
          disabled={!folderPath} // 如果没有选择文件夹则禁用按钮
        >
          <Play className="mr-2 h-4 w-4" />
          开始处理
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          size="lg"
          disabled={!folderPath} // 如果没有选择文件夹则禁用按钮
        >
          <FileDown className="mr-2 h-4 w-4" />
          导出结果
        </Button>
      </div>
    </div>
  );
} 