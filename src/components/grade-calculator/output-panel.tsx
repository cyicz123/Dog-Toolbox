export function OutputPanel() {
  return (
    <div className="w-full h-full space-y-4">
      {/* 标题部分 */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold">平时成绩计算</h1>
        <p className="text-muted-foreground mt-2">
          处理结果将在这里显示
        </p>
      </div>

      {/* 输出内容区 */}
      <div className="w-full h-[400px] border rounded-lg bg-card p-4 overflow-auto">
        <p className="text-muted-foreground text-center">
          暂无内容
        </p>
      </div>
    </div>
  );
} 