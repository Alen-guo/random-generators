"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Palette, RefreshCw, Copy, Eye, Shuffle, Download } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  className?: string
}

interface ColorValue {
  hex: string
  rgb: string
  hsl: string
  hsv: string
  cmyk: string
  name?: string
}

export function ColorGenerator({ className = '' }: Props) {
  const [colors, setColors] = useState<ColorValue[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [count, setCount] = useState(12)
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl' | 'hsv' | 'cmyk'>('hex')
  const [generatePalette, setGeneratePalette] = useState(false)
  const [paletteType, setPaletteType] = useState<'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'random'>('random')

  const generateColors = async () => {
    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      let generatedColors: ColorValue[] = []
      
      if (generatePalette && paletteType !== 'random') {
        // Generate color palette based on type
        const baseHue = Math.floor(Math.random() * 360)
        generatedColors = generateColorPalette(baseHue, paletteType, count)
      } else {
        // Generate random colors
        generatedColors = Array.from({ length: count }, () => {
          const hue = Math.floor(Math.random() * 360)
          const saturation = Math.floor(Math.random() * 100)
          const lightness = Math.floor(Math.random() * 100)
          return hslToAllFormats(hue, saturation, lightness)
        })
      }
      
      setColors(generatedColors)
    } catch (error) {
      console.error('Error generating colors:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateColorPalette = (baseHue: number, type: string, count: number): ColorValue[] => {
    const colors: ColorValue[] = []
    
    switch (type) {
      case 'monochromatic':
        for (let i = 0; i < count; i++) {
          const lightness = 10 + (i * 80) / (count - 1)
          colors.push(hslToAllFormats(baseHue, 70, lightness))
        }
        break
        
      case 'analogous':
        for (let i = 0; i < count; i++) {
          const hue = (baseHue + (i * 30)) % 360
          colors.push(hslToAllFormats(hue, 70, 50))
        }
        break
        
      case 'complementary':
        colors.push(hslToAllFormats(baseHue, 70, 50))
        colors.push(hslToAllFormats((baseHue + 180) % 360, 70, 50))
        // Fill remaining with variations
        for (let i = 2; i < count; i++) {
          const hue = i % 2 === 0 ? baseHue : (baseHue + 180) % 360
          const lightness = 30 + (i * 40) / count
          colors.push(hslToAllFormats(hue, 70, lightness))
        }
        break
        
      case 'triadic':
        for (let i = 0; i < count; i++) {
          const hue = (baseHue + (i * 120)) % 360
          colors.push(hslToAllFormats(hue, 70, 50))
        }
        break
        
      case 'tetradic':
        for (let i = 0; i < count; i++) {
          const hue = (baseHue + (i * 90)) % 360
          colors.push(hslToAllFormats(hue, 70, 50))
        }
        break
        
      default:
        // Random colors
        for (let i = 0; i < count; i++) {
          const hue = Math.floor(Math.random() * 360)
          const saturation = Math.floor(Math.random() * 100)
          const lightness = Math.floor(Math.random() * 100)
          colors.push(hslToAllFormats(hue, saturation, lightness))
        }
    }
    
    return colors
  }

  const hslToAllFormats = (h: number, s: number, l: number): ColorValue => {
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l / 100 - c / 2
    
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
    
    // Create hex
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    
    // Create RGB
    const rgb = `rgb(${r}, ${g}, ${b})`
    
    // Create HSL
    const hsl = `hsl(${h}, ${s}%, ${l}%)`
    
    // Create HSV
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    const v = Math.round((max / 255) * 100)
    const sHsv = max === 0 ? 0 : Math.round((delta / max) * 100)
    const hsv = `hsv(${h}, ${sHsv}%, ${v}%)`
    
    // Create CMYK (simplified)
    const k = Math.round((1 - max / 255) * 100)
    const c_cmyk = max === 0 ? 0 : Math.round(((max - r) / max) * 100)
    const m_cmyk = max === 0 ? 0 : Math.round(((max - g) / max) * 100)
    const y_cmyk = max === 0 ? 0 : Math.round(((max - b) / max) * 100)
    const cmyk = `cmyk(${c_cmyk}%, ${m_cmyk}%, ${y_cmyk}%, ${k}%)`
    
    return { hex, rgb, hsl, hsv, cmyk }
  }

  const copyColor = (color: ColorValue, format: keyof ColorValue) => {
    navigator.clipboard.writeText(color[format] as string)
  }

  const copyAllColors = (format: keyof ColorValue) => {
    const colorList = colors.map(color => color[format]).join('\n')
    navigator.clipboard.writeText(colorList)
  }

  const downloadPalette = () => {
    const css = colors.map((color, index) => 
      `--color-${index + 1}: ${color.hex};`
    ).join('\n')
    
    const blob = new Blob([`:root {\n${css}\n}`], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'color-palette.css'
    link.click()
    URL.revokeObjectURL(url)
  }

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16)
    const g = parseInt(hex.substr(3, 2), 16)
    const b = parseInt(hex.substr(5, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* 配置面板 */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="h-5 w-5" />
            Color Settings
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure your color generation preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧：基本设置 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Number of Colors</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Primary Format</Label>
                <Select
                  value={colorFormat}
                  onValueChange={(value: 'hex' | 'rgb' | 'hsl' | 'hsv' | 'cmyk') => setColorFormat(value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex">HEX (#FF0000)</SelectItem>
                    <SelectItem value="rgb">RGB (rgb(255, 0, 0))</SelectItem>
                    <SelectItem value="hsl">HSL (hsl(0, 100%, 50%))</SelectItem>
                    <SelectItem value="hsv">HSV (hsv(0, 100%, 100%))</SelectItem>
                    <SelectItem value="cmyk">CMYK (cmyk(0%, 100%, 100%, 0%))</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 右侧：调色板设置 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={generatePalette}
                  onCheckedChange={setGeneratePalette}
                />
                <Label className="text-white">Generate Color Palette</Label>
              </div>

              {generatePalette && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Palette Type</Label>
                  <Select
                    value={paletteType}
                    onValueChange={(value: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'random') => setPaletteType(value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random Colors</SelectItem>
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="complementary">Complementary</SelectItem>
                      <SelectItem value="triadic">Triadic</SelectItem>
                      <SelectItem value="tetradic">Tetradic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* 生成按钮 */}
          <Button 
            onClick={generateColors}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 font-semibold"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Palette className="h-4 w-4 mr-2" />
                Generate Colors
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 结果展示 */}
      {colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5" />
                  Generated Colors
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyAllColors(colorFormat)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadPalette}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSS
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 颜色网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {colors.map((color, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div
                      className="aspect-square rounded-lg border-2 border-white/20 cursor-pointer hover:border-white/40 transition-all relative overflow-hidden"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyColor(color, colorFormat)}
                    >
                      <div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: getContrastColor(color.hex) }}
                      >
                        <Copy className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-mono text-white text-center">
                        {color[colorFormat]}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 详细信息 */}
              <div className="border-t border-white/10 pt-4">
                <Label className="text-slate-300 mb-3 block">Detailed Color Values</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div
                        className="w-8 h-8 rounded border border-white/20 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
                        <div className="text-white">{color.hex}</div>
                        <div className="text-slate-300">{color.rgb}</div>
                        <div className="text-slate-300">{color.hsl}</div>
                        <div className="text-slate-300">{color.hsv}</div>
                        <div className="text-slate-300">{color.cmyk}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyColor(color, 'hex')}
                        className="text-slate-300 hover:text-white hover:bg-white/10 flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}