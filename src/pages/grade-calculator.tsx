import { ConfigPanel } from "@/components/grade-calculator/config-panel";
import { OutputPanel } from "@/components/grade-calculator/output-panel";

export function GradeCalculatorPage() {
  return (
    <div className="flex flex-col flex-1 h-full md:max-w-8xl">
      <div className="w-full h-full flex flex-col gap-0 md:flex-row md:gap-6">
        {/* 参数配置栏 */}
        <div className="w-full md:w-[300px] shrink-0">
          <ConfigPanel />
        </div>

        {/* 内容输出栏 */}
        <div className="w-full md: flex-1">
          <OutputPanel />
        </div>
      </div>
    </div>
  );
} 