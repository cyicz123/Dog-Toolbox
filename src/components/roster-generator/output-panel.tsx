interface OutputPanelProps {
  logs: string[];
}

export function OutputPanel({ logs }: OutputPanelProps) {
  // 处理日志文本，添加高亮样式
  const processLog = (log: string) => {
    // 处理警告信息
    if (log.startsWith('⚠️') || log.startsWith('警告')) {
      return <div key={log} className="text-yellow-500 font-medium">{log}</div>;
    }
    // 处理错误信息
    if (log.startsWith('❌') || log.includes('错误')) {
      return <div key={log} className="text-red-500">{log}</div>;
    }
    // 处理成功信息
    if (log.startsWith('✅') || log.includes('成功')) {
      return <div key={log} className="text-green-500">{log}</div>;
    }
    // 处理信息
    if (log.startsWith('ℹ️')) {
      return <div key={log} className="text-blue-500">{log}</div>;
    }
    
    // 默认样式
    return <div key={log} className="whitespace-pre-wrap">{log}</div>;
  };

  return (
    <div className="w-full h-full space-y-4">
      {/* 标题部分 */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold">点名册生成</h1>
        <p className="text-muted-foreground mt-2">
          处理结果将在这里显示
        </p>
      </div>

      {/* 输出内容区 */}
      <div className="w-full h-[400px] border rounded-lg bg-card p-4 overflow-auto font-mono text-sm">
        {logs.length > 0 ? (
          <div className="space-y-1">
            {logs.map((log, index) => processLog(log))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            暂无内容
          </p>
        )}
      </div>
    </div>
  );
} 