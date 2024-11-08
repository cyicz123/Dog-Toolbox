import { ToolCard } from "@/components/tool-card";
import { FileSpreadsheet } from "lucide-react";

const tools = [
  {
    title: "平时成绩计算",
    description: "只适用广东肇庆航空学院的平时成绩计算",
    icon: FileSpreadsheet,
    to: "/grade-calculator",
  },
];

export function HomePage() {
  return (
    <div className="w-full space-y-6 md:space-y-8">
      <div className="space-y-2 text-center md:mb-8">
        <h1 className="text-3xl font-bold">工具箱</h1>
        <p className="text-muted-foreground">
          选择下面的工具开始使用
        </p>
      </div>
      <div className="flex justify-center mt-4 md:mt-0">
        {tools.map((tool) => (
          <ToolCard key={tool.to} {...tool} />
        ))}
      </div>
    </div>
  );
} 