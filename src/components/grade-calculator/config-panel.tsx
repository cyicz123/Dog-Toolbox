import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen, Play, FileDown } from "lucide-react";

export function ConfigPanel() {
  return (
    <div className="w-full md:w-[300px] p-4 border rounded-lg bg-card space-y-6">
      <div className="space-y-4">
        {/* 文件夹选择 */}
        <div className="space-y-2">
          <Label>文件夹位置</Label>
          <div className="flex gap-2">
            <Input readOnly placeholder="选择文件夹..." />
            <Button variant="secondary" size="icon">
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 签到率阈值 */}
        <div className="space-y-2">
          <Label>签到率阈值 (%)</Label>
          <Input type="number" min={0} max={100} defaultValue={50} placeholder="例如：80" />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <Button className="w-full" size="lg">
          <Play className="mr-2 h-4 w-4" />
          开始处理
        </Button>
        <Button variant="outline" className="w-full" size="lg">
          <FileDown className="mr-2 h-4 w-4" />
          导出结果
        </Button>
      </div>
    </div>
  );
} 