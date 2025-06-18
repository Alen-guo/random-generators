"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, RefreshCw } from 'lucide-react'

export function NumberGenerator() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [result, setResult] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNumber = async () => {
    setIsGenerating(true)
    
    // 添加延迟效果，让用户感觉到随机生成过程
    setTimeout(() => {
      const minNum = parseInt(min) || 1
      const maxNum = parseInt(max) || 100
      
      if (minNum > maxNum) {
        alert('Min value cannot be greater than max value')
        setIsGenerating(false)
        return
      }
      
      const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
      setResult(randomNum)
      setIsGenerating(false)
    }, 300)
  }

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString())
    }
  }

  return (
    <div className="space-y-4">
      {/* 输入区域 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 text-sm">Min:</Label>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="bg-white/10 border-white/20 text-white"
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300 text-sm">Max:</Label>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="bg-white/10 border-white/20 text-white"
            placeholder="100"
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <Button 
        onClick={generateNumber}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate'
        )}
      </Button>

      {/* 结果显示 */}
      {result !== null && (
        <div className="space-y-2">
          <Label className="text-slate-300 text-sm">Result:</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-md p-3 text-center">
              <span className="text-2xl font-bold text-white">{result}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyResult}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 说明文字 */}
      <div className="text-center text-xs text-slate-400 mt-4">
        Powered by <span className="text-purple-300">RANDOM HUB</span>
      </div>
    </div>
  )
} 