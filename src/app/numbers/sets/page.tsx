"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Hash, Shuffle, RefreshCw } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

export default function SetsPage() {
  const containerRef = useTranslationProtection()
  const [count, setCount] = useState(10)
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [numbers, setNumbers] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSet = async () => {
    setIsGenerating(true)
    
    // 添加延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const set = new Set<number>()
    while (set.size < count && set.size < (max - min + 1)) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min
      set.add(num)
    }
    setNumbers(Array.from(set).sort((a, b) => a - b))
    setIsGenerating(false)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Integer Sets Generator</h1>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            Generate sets of unique random integers within specified ranges.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Hash className="h-5 w-5 text-green-400" />
                Set Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count" className="text-white">Count</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="1000"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min" className="text-white">Min Value</Label>
                  <Input
                    id="min"
                    type="number"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max" className="text-white">Max Value</Label>
                  <Input
                    id="max"
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value) || 100)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={generateSet} 
                disabled={isGenerating}
                className="w-full bg-green-600 hover:bg-green-700 text-white notranslate"
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
                    Generate Set
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {numbers.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Generated Set</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2" data-result="true">
                  {numbers.map((num, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-3 text-center text-white font-mono">
                      {num}
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