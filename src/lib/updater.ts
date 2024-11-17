import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { toast } from '@/components/ui/use-toast'

export async function checkForUpdates() {
  try {
    const update = await check()
    
    if (update) {
      // 发现新版本时显示提示
      toast({
        title: "发现新版本",
        description: `正在下载 v${update.version}...`,
        duration: 3000,
      })

      // 下载并安装更新
      await update.downloadAndInstall((progress) => {
        switch (progress.event) {
          case 'Started':
            toast({
              title: "开始下载", 
              description: `总大小: ${Math.round((progress.data?.contentLength || 0) / 1024 / 1024)}MB`,
            })
            break
          case 'Finished':
            toast({
              title: "下载完成",
              description: "即将重启应用以完成更新",
            })
            break
        }
      })

      // 重启应用
      await relaunch()
    } else {
      toast({
        title: "检查更新",
        description: "当前已是最新版本",
      })
    }
  } catch (error) {
    console.error('检查更新失败:', error)
    toast({
      title: "检查更新失败",
      description: error instanceof Error ? error.message : "未知错误",
      variant: "destructive",
    })
  }
} 