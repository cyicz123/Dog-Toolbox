import { ConfigPanel } from "@/components/grade-calculator/config-panel";
import { OutputPanel } from "@/components/grade-calculator/output-panel";

export function GradeCalculatorPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 参数配置栏 */}
        <div className="w-full md:w-auto shrink-0">
          <ConfigPanel />
        </div>

        {/* 内容输出栏 */}
        <div className="flex-1">
          <OutputPanel />
        </div>
      </div>
    </div>
  );
} 