"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Palette, Shuffle, Copy } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'
import { Navigation } from '@/components/common/Navigation'

interface RGBColor {
  r: number
  g: number
  b: number
  rgb: string
  hex: string
}

export default function RGBPage() {
  const [count, setCount] = useState(10)
  const [colors, setColors] = useState<RGBColor[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const containerRef = useTranslationProtection()

  const generateColors = async () => {
    setIsGenerating(true)
    try {
      const newColors = Array.from({length: count}, () => {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        return {
          r, g, b,
          rgb: `rgb(${r}, ${g}, ${b})`,
          hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
        }
      })
      setColors(newColors)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyColor = (color: RGBColor) => {
    navigator.clipboard.writeText(color.rgb)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-900 via-green-900 to-teal-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">RGB Color Generator</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Generate random RGB color values for web development and design.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-400" />
                RGB Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="count" className="text-white">Number of Colors</label>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white notranslate"
                translate="no"
                data-interactive="true"
              >
                {isGenerating ? (
                  <>
                    <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate RGB Colors
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {colors.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Generated RGB Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {colors.map((color, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-4">
                      <div 
                        className="w-full h-20 rounded-lg mb-3 border-2 border-white/30"
                        style={{ backgroundColor: color.rgb }}
                      ></div>
                      <div className="space-y-1 text-sm">
                        <div className="text-white font-mono">R: {color.r}</div>
                        <div className="text-white font-mono">G: {color.g}</div>
                        <div className="text-white font-mono">B: {color.b}</div>
                        <div className="text-white font-mono">{color.rgb}</div>
                        <div className="text-white font-mono">{color.hex}</div>
                      </div>
                      <Button
                        onClick={() => copyColor(color)}
                        size="sm"
                        className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy RGB
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