"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, Shuffle, Copy, RefreshCw } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

export default function HexPage() {
  const containerRef = useTranslationProtection()
  const [count, setCount] = useState(10)
  const [colors, setColors] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateColors = async () => {
    setIsGenerating(true)
    
    // 添加延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newColors = Array.from({length: count}, () => {
      const hex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      return `#${hex.toUpperCase()}`
    })
    setColors(newColors)
    setIsGenerating(false)
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Hex Color Generator</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Generate random hexadecimal color codes for your design projects.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-400" />
                Color Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="count" className="text-white">Number of Colors</Label>
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
                onClick={generateColors} 
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white notranslate"
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
                    Generate Colors
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {colors.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Generated Hex Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-result="true">
                  {colors.map((color, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-4 text-center">
                      <div 
                        className="w-full h-20 rounded-lg mb-2 border-2 border-white/30"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="text-white font-mono text-sm">{color}</div>
                      <Button
                        onClick={() => copyColor(color)}
                        size="sm"
                        className="mt-2 bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
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