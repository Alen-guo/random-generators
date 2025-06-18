"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到监控服务
    console.error('Global error:', error)
    
    // 如果有错误追踪服务，在这里发送错误信息
    // trackError(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white/10 border-red-500/20">
            <CardContent className="p-8 text-center">
              {/* 错误图标 */}
              <div className="mb-6">
                <AlertTriangle className="h-20 w-20 text-red-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">
                  Something went wrong!
                </h1>
                <p className="text-red-200">
                  We're sorry, but an unexpected error occurred. Our team has been notified.
                </p>
              </div>

              {/* 错误详情 (仅开发环境显示) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4 text-red-400" />
                    <span className="text-red-300 font-medium">Error Details:</span>
                  </div>
                  <pre className="text-sm text-red-200 overflow-auto">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-red-300 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={reset}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
                <Link href="/">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>

              {/* 帮助信息 */}
              <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="text-white font-medium mb-2">What can I do?</h3>
                <ul className="text-slate-300 text-sm space-y-1 text-left">
                  <li>• Try refreshing the page</li>
                  <li>• Clear your browser cache</li>
                  <li>• Check your internet connection</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
} 