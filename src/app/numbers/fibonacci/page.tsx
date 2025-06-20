"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Hash, Shuffle, RefreshCw } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

export default function FibonacciPage() {
  const containerRef = useTranslationProtection()
  const [count, setCount] = useState(15)
  const [fibonacci, setFibonacci] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateFibonacci = async () => {
    setIsGenerating(true)
    
    // 添加延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const result: number[] = []
    
    if (count >= 1) result.push(0)
    if (count >= 2) result.push(1)
    
    for (let i = 2; i < count; i++) {
      result.push(result[i-1] + result[i-2])
    }
    
    setFibonacci(result)
    setIsGenerating(false)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Fibonacci Sequence Generator</h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto">
            Generate the famous Fibonacci sequence where each number is the sum of the two preceding ones.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Hash className="h-5 w-5 text-amber-400" />
                Fibonacci Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="count" className="text-white">Number of Terms</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button 
                onClick={generateFibonacci} 
                disabled={isGenerating}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white notranslate"
                translate="no"
                data-interactive="true"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate Fibonacci Sequence
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {fibonacci.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Fibonacci Sequence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" data-result="true">
                  {fibonacci.map((num, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-3 text-center text-white font-mono">
                      <div className="text-xs text-amber-300">F({index})</div>
                      <div className="font-bold">{num}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 