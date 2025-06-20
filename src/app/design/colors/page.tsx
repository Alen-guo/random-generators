"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, RefreshCw, Copy, Download, Eye, Grid3X3 } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  name: string
}

export default function ColorGeneratorPage() {
  const containerRef = useTranslationProtection()
  const [colors, setColors] = useState<Color[]>([])
  const [colorCount, setColorCount] = useState(6)
  const [colorType, setColorType] = useState<'random' | 'pastel' | 'bright' | 'dark' | 'monochrome'>('random')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateColors = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newColors: Color[] = []
    
    for (let i = 0; i < colorCount; i++) {
      let r, g, b
      
      switch (colorType) {
        case 'pastel':
          r = Math.floor(Math.random() * 127 + 127)
          g = Math.floor(Math.random() * 127 + 127)
          b = Math.floor(Math.random() * 127 + 127)
          break
        case 'bright':
          r = Math.floor(Math.random() * 255)
          g = Math.floor(Math.random() * 255)
          b = Math.floor(Math.random() * 255)
          // Ensure at least one channel is high
          const maxChannel = Math.max(r, g, b)
          if (maxChannel < 200) {
            const channel = Math.floor(Math.random() * 3)
            if (channel === 0) r = Math.floor(Math.random() * 55 + 200)
            else if (channel === 1) g = Math.floor(Math.random() * 55 + 200)
            else b = Math.floor(Math.random() * 55 + 200)
          }
          break
        case 'dark':
          r = Math.floor(Math.random() * 127)
          g = Math.floor(Math.random() * 127)
          b = Math.floor(Math.random() * 127)
          break
        case 'monochrome':
          const gray = Math.floor(Math.random() * 255)
          r = g = b = gray
          break
        default: // random
          r = Math.floor(Math.random() * 255)
          g = Math.floor(Math.random() * 255)
          b = Math.floor(Math.random() * 255)
      }
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      const hsl = rgbToHsl(r, g, b)
      
      newColors.push({
        hex,
        rgb: { r, g, b },
        hsl,
        name: generateColorName(r, g, b)
      })
    }
    
    setColors(newColors)
    setIsGenerating(false)
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const generateColorName = (r: number, g: number, b: number) => {
    const colorNames = [
      'Crimson', 'Azure', 'Emerald', 'Golden', 'Violet', 'Coral', 'Turquoise', 'Amber',
      'Magenta', 'Sapphire', 'Ruby', 'Jade', 'Pearl', 'Onyx', 'Silver', 'Bronze',
      'Indigo', 'Scarlet', 'Mint', 'Rose', 'Sky', 'Forest', 'Ocean', 'Sunset'
    ]
    
    const name = colorNames[Math.floor(Math.random() * colorNames.length)]
    const variation = Math.floor(Math.random() * 99) + 1
    return `${name} ${variation}`
  }

  const copyColor = (color: Color, format: 'hex' | 'rgb' | 'hsl') => {
    let text = ''
    switch (format) {
      case 'hex':
        text = color.hex
        break
      case 'rgb':
        text = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
        break
      case 'hsl':
        text = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
        break
    }
    navigator.clipboard.writeText(text)
  }

  const downloadPalette = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 800
    canvas.height = 200
    
    const colorWidth = canvas.width / colors.length
    
    colors.forEach((color, index) => {
      ctx.fillStyle = color.hex
      ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height)
    })
    
    const link = document.createElement('a')
    link.download = 'color-palette.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Color Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate beautiful random color palettes for your designs. Get colors in HEX, RGB, and HSL formats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：设置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Color Options</CardTitle>
                <CardDescription className="text-slate-300">
                  Customize your color generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Colors</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={colorCount}
                    onChange={(e) => setColorCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 6)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 20 colors</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Color Type</Label>
                  <select
                    value={colorType}
                    onChange={(e) => setColorType(e.target.value as typeof colorType)}
                    className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 focus:outline-none"
                  >
                    <option value="random" className="bg-slate-800">Random Colors</option>
                    <option value="pastel" className="bg-slate-800">Pastel Colors</option>
                    <option value="bright" className="bg-slate-800">Bright Colors</option>
                    <option value="dark" className="bg-slate-800">Dark Colors</option>
                    <option value="monochrome" className="bg-slate-800">Monochrome</option>
                  </select>
                </div>

                <Button 
                  onClick={generateColors}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Palette className="h-5 w-5 mr-2" />
                      Generate Colors
                    </>
                  )}
                </Button>

                {colors.length > 0 && (
                  <Button 
                    onClick={downloadPalette}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Palette
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Color Formats</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-medium text-white">HEX</h4>
                  <p className="text-xs">Web standard format (#FF5733)</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-white">RGB</h4>
                  <p className="text-xs">Red, Green, Blue values (255, 87, 51)</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-white">HSL</h4>
                  <p className="text-xs">Hue, Saturation, Lightness (9°, 100%, 60%)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：颜色显示 */}
          <div className="lg:col-span-3 space-y-6">
            {colors.length > 0 && (
              <>
                {/* 调色板预览 */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Color Palette</CardTitle>
                    <CardDescription className="text-slate-300">
                      Your generated color palette
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {colors.map((color, index) => (
                        <div key={index} className="space-y-3">
                          <div 
                            className="aspect-square rounded-lg shadow-lg border-2 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => copyColor(color, 'hex')}
                          />
                          <div className="text-center">
                            <div className="font-medium text-white text-sm">{color.name}</div>
                            <div className="font-mono text-xs text-slate-400">{color.hex}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 详细颜色信息 */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Eye className="h-5 w-5" />
                      Color Details
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Click any value to copy it
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {colors.map((color, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-4 mb-4">
                            <div 
                              className="w-12 h-12 rounded-lg border-2 border-white/20"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <div className="font-medium text-white">{color.name}</div>
                              <div className="text-sm text-slate-400">Color #{index + 1}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div 
                              className="p-3 bg-black/20 rounded border cursor-pointer hover:bg-black/30 transition-colors"
                              onClick={() => copyColor(color, 'hex')}
                            >
                              <div className="text-xs text-slate-400 mb-1">HEX</div>
                              <div className="font-mono text-white">{color.hex}</div>
                            </div>
                            
                            <div 
                              className="p-3 bg-black/20 rounded border cursor-pointer hover:bg-black/30 transition-colors"
                              onClick={() => copyColor(color, 'rgb')}
                            >
                              <div className="text-xs text-slate-400 mb-1">RGB</div>
                              <div className="font-mono text-white text-sm">
                                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                              </div>
                            </div>
                            
                            <div 
                              className="p-3 bg-black/20 rounded border cursor-pointer hover:bg-black/30 transition-colors"
                              onClick={() => copyColor(color, 'hsl')}
                            >
                              <div className="text-xs text-slate-400 mb-1">HSL</div>
                              <div className="font-mono text-white text-sm">
                                {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Grid3X3 className="h-5 w-5" />
                  How to Use Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Generate beautiful color palettes for your design projects. Each color is provided in multiple 
                  formats for maximum compatibility with different design tools and platforms.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Design Applications:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Website design and branding</li>
                      <li>Logo and graphic design</li>
                      <li>UI/UX interface design</li>
                      <li>Print design projects</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Quick Actions:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Click color squares to copy HEX</li>
                      <li>Click format values to copy specific format</li>
                      <li>Download palette as PNG image</li>
                      <li>Generate new palettes instantly</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 