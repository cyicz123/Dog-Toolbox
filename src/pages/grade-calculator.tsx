import { ConfigPanel } from "@/components/grade-calculator/config-panel";
import { OutputPanel } from "@/components/grade-calculator/output-panel";
import { useState } from "react";

export function GradeCalculatorPage() {
  const [logs, setLogs] = useState<string[]>([]);

  return (
    <div className="flex flex-col flex-1 h-full md:max-w-8xl">
      <div className="w-full h-full flex flex-col gap-0 md:flex-row md:gap-6">
        {/* 参数配置栏 */}
        <div className="w-full md:w-[300px] shrink-0">
          <ConfigPanel onProcess={setLogs} />
        </div>

        {/* 内容输出栏 */}
        <div className="w-full md:flex-1">
          <OutputPanel logs={logs} />
        </div>
      </div>
    </div>
  );
} 