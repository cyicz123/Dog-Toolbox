import { ToolCard } from "@/components/tool-card";
import { Type } from "lucide-react";

const tools = [
  {
    title: "书法字体识别",
    description: "识别图片中的书法字体",
    icon: Type,
    to: "/calligraphy",
  },
];

export function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold">工具箱</h1>
        <p className="text-muted-foreground">
          选择下面的工具开始使用
        </p>
      </div>
      <div className="flex justify-center">
        {tools.map((tool) => (
          <ToolCard key={tool.to} {...tool} />
        ))}
      </div>
    </div>
  );
} 