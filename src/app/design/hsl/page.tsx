"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, Shuffle, Copy, RefreshCw } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface HSLColor {
  h: number
  s: number
  l: number
  hsl: string
  hex: string
}

export default function HSLPage() {
  const containerRef = useTranslationProtection()
  const [count, setCount] = useState(10)
  const [colors, setColors] = useState<HSLColor[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const hslToHex = (h: number, s: number, l: number) => {
    const sNorm = s / 100
    const lNorm = l / 100
    
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = lNorm - c / 2
    
    let r = 0, g = 0, b = 0
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x
    }
    
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
  }

  const generateColors = async () => {
    setIsGenerating(true)
    
    // 添加延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newColors = Array.from({length: count}, () => {
      const h = Math.floor(Math.random() * 360)
      const s = Math.floor(Math.random() * 101)
      const l = Math.floor(Math.random() * 101)
      return {
        h, s, l,
        hsl: `hsl(${h}, ${s}%, ${l}%)`,
        hex: hslToHex(h, s, l)
      }
    })
    setColors(newColors)
    setIsGenerating(false)
  }

  const copyColor = (color: HSLColor) => {
    navigator.clipboard.writeText(color.hsl)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">HSL Color Generator</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Generate random HSL (Hue, Saturation, Lightness) color values for modern web design.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-400" />
                HSL Configuration
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white notranslate"
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
                    Generate HSL Colors
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {colors.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Generated HSL Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-result="true">
                  {colors.map((color, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-4">
                      <div 
                        className="w-full h-20 rounded-lg mb-3 border-2 border-white/30"
                        style={{ backgroundColor: color.hsl }}
                      ></div>
                      <div className="space-y-1 text-sm">
                        <div className="text-white font-mono">H: {color.h}°</div>
                        <div className="text-white font-mono">S: {color.s}%</div>
                        <div className="text-white font-mono">L: {color.l}%</div>
                        <div className="text-white font-mono">{color.hsl}</div>
                        <div className="text-white font-mono">{color.hex}</div>
                      </div>
                      <Button
                        onClick={() => copyColor(color)}
                        size="sm"
                        className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy HSL
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