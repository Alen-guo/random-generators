"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, RefreshCw, Copy, Download, Eye, Zap, Heart, Sun } from 'lucide-react'

interface PaletteConfig {
  scheme: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'random'
  colorCount: number
  baseHue?: number
  saturation: number
  lightness: number
  format: 'hex' | 'rgb' | 'hsl' | 'css'
  includeShades: boolean
}

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  name: string
}

interface GeneratedPalette {
  name: string
  scheme: string
  colors: Color[]
  baseColor: Color
  timestamp: Date
  id: string
}

export default function PalettePage() {
  const [config, setConfig] = useState<PaletteConfig>({
    scheme: 'complementary',
    colorCount: 5,
    saturation: 70,
    lightness: 50,
    format: 'hex',
    includeShades: false
  })
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const colorSchemes = [
    { 
      key: 'monochromatic', 
      name: 'Monochromatic', 
      description: 'Variations of a single hue',
      icon: '🟦',
      example: 'Blues from light to dark'
    },
    { 
      key: 'analogous', 
      name: 'Analogous', 
      description: 'Adjacent colors on color wheel',
      icon: '🌈',
      example: 'Blue, blue-green, green'
    },
    { 
      key: 'complementary', 
      name: 'Complementary', 
      description: 'Opposite colors on wheel',
      icon: '🔴',
      example: 'Red and green, blue and orange'
    },
    { 
      key: 'triadic', 
      name: 'Triadic', 
      description: 'Three evenly spaced colors',
      icon: '🔺',
      example: 'Red, yellow, blue'
    },
    { 
      key: 'tetradic', 
      name: 'Tetradic', 
      description: 'Four colors forming rectangle',
      icon: '🟨',
      example: 'Red, orange, green, blue'
    },
    { 
      key: 'random', 
      name: 'Random', 
      description: 'Completely random colors',
      icon: '🎲',
      example: 'Any combination possible'
    }
  ]

  const colorNames = [
    'Crimson', 'Scarlet', 'Ruby', 'Cherry', 'Rose', 'Coral', 'Salmon', 'Peach',
    'Orange', 'Tangerine', 'Gold', 'Amber', 'Yellow', 'Lemon', 'Lime', 'Chartreuse',
    'Green', 'Emerald', 'Jade', 'Mint', 'Teal', 'Cyan', 'Azure', 'Sky',
    'Blue', 'Sapphire', 'Navy', 'Indigo', 'Purple', 'Violet', 'Lavender', 'Magenta',
    'Pink', 'Fuchsia', 'Burgundy', 'Maroon', 'Brown', 'Chocolate', 'Coffee', 'Beige',
    'Cream', 'Ivory', 'White', 'Silver', 'Gray', 'Charcoal', 'Black'
  ]

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h = h / 360
    s = s / 100
    l = l / 100

    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h * 12) % 12
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    }

    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255)
    }
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const getColorName = (hue: number): string => {
    const hueRanges = [
      { range: [0, 15], names: ['Crimson', 'Ruby', 'Cherry'] },
      { range: [15, 45], names: ['Orange', 'Tangerine', 'Coral'] },
      { range: [45, 75], names: ['Gold', 'Yellow', 'Amber'] },
      { range: [75, 105], names: ['Lime', 'Chartreuse', 'Green'] },
      { range: [105, 135], names: ['Emerald', 'Jade', 'Forest'] },
      { range: [135, 165], names: ['Teal', 'Cyan', 'Turquoise'] },
      { range: [165, 195], names: ['Sky', 'Azure', 'Blue'] },
      { range: [195, 225], names: ['Sapphire', 'Navy', 'Cobalt'] },
      { range: [225, 255], names: ['Indigo', 'Purple', 'Violet'] },
      { range: [255, 285], names: ['Lavender', 'Magenta', 'Fuchsia'] },
      { range: [285, 315], names: ['Pink', 'Rose', 'Blush'] },
      { range: [315, 360], names: ['Crimson', 'Burgundy', 'Wine'] }
    ]

    const normalizedHue = ((hue % 360) + 360) % 360
    const range = hueRanges.find(r => normalizedHue >= r.range[0] && normalizedHue < r.range[1])
    const names = range?.names || ['Color']
    return names[Math.floor(Math.random() * names.length)]
  }

  const generateColor = (h: number, s: number, l: number): Color => {
    const rgb = hslToRgb(h, s, l)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    const name = getColorName(h)
    
    return {
      hex,
      rgb,
      hsl: { h, s, l },
      name
    }
  }

  const generateMonochromaticPalette = (baseHue: number, count: number): Color[] => {
    const colors: Color[] = []
    const lightnessStep = 80 / count
    
    for (let i = 0; i < count; i++) {
      const lightness = 20 + (i * lightnessStep)
      const saturation = config.saturation + (Math.random() * 20 - 10) // Add slight variation
      colors.push(generateColor(baseHue, saturation, lightness))
    }
    
    return colors
  }

  const generateAnalogousPalette = (baseHue: number, count: number): Color[] => {
    const colors: Color[] = []
    const hueRange = 60 // 60 degrees on each side
    const hueStep = (hueRange * 2) / (count - 1)
    
    for (let i = 0; i < count; i++) {
      const hue = (baseHue - hueRange + (i * hueStep) + 360) % 360
      const lightness = config.lightness + (Math.random() * 30 - 15)
      const saturation = config.saturation + (Math.random() * 20 - 10)
      colors.push(generateColor(hue, saturation, Math.max(20, Math.min(80, lightness))))
    }
    
    return colors
  }

  const generateComplementaryPalette = (baseHue: number, count: number): Color[] => {
    const colors: Color[] = []
    const complementaryHue = (baseHue + 180) % 360
    
    // Add base color
    colors.push(generateColor(baseHue, config.saturation, config.lightness))
    
    // Add complementary color
    if (count > 1) {
      colors.push(generateColor(complementaryHue, config.saturation, config.lightness))
    }
    
    // Add variations
    for (let i = 2; i < count; i++) {
      const useBase = Math.random() > 0.5
      const hue = useBase ? baseHue : complementaryHue
      const lightness = 30 + (Math.random() * 40)
      const saturation = config.saturation + (Math.random() * 30 - 15)
      colors.push(generateColor(hue, Math.max(20, Math.min(100, saturation)), lightness))
    }
    
    return colors
  }

  const generateTriadicPalette = (baseHue: number, count: number): Color[] => {
    const colors: Color[] = []
    const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360]
    
    for (let i = 0; i < count; i++) {
      const hue = hues[i % 3]
      const lightness = config.lightness + (Math.random() * 30 - 15)
      const saturation = config.saturation + (Math.random() * 20 - 10)
      colors.push(generateColor(hue, Math.max(20, Math.min(100, saturation)), Math.max(20, Math.min(80, lightness))))
    }
    
    return colors
  }

  const generateTetradicPalette = (baseHue: number, count: number): Color[] => {
    const colors: Color[] = []
    const hues = [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360]
    
    for (let i = 0; i < count; i++) {
      const hue = hues[i % 4]
      const lightness = config.lightness + (Math.random() * 30 - 15)
      const saturation = config.saturation + (Math.random() * 20 - 10)
      colors.push(generateColor(hue, Math.max(20, Math.min(100, saturation)), Math.max(20, Math.min(80, lightness))))
    }
    
    return colors
  }

  const generateRandomPalette = (count: number): Color[] => {
    const colors: Color[] = []
    
    for (let i = 0; i < count; i++) {
      const hue = Math.random() * 360
      const saturation = 40 + Math.random() * 60
      const lightness = 30 + Math.random() * 50
      colors.push(generateColor(hue, saturation, lightness))
    }
    
    return colors
  }

  const generatePalette = async () => {
    setIsGenerating(true)
    
    try {
      const baseHue = config.baseHue ?? Math.random() * 360
      let colors: Color[] = []
      
      switch (config.scheme) {
        case 'monochromatic':
          colors = generateMonochromaticPalette(baseHue, config.colorCount)
          break
        case 'analogous':
          colors = generateAnalogousPalette(baseHue, config.colorCount)
          break
        case 'complementary':
          colors = generateComplementaryPalette(baseHue, config.colorCount)
          break
        case 'triadic':
          colors = generateTriadicPalette(baseHue, config.colorCount)
          break
        case 'tetradic':
          colors = generateTetradicPalette(baseHue, config.colorCount)
          break
        case 'random':
          colors = generateRandomPalette(config.colorCount)
          break
      }
      
      // Generate shades if enabled
      if (config.includeShades && colors.length > 0) {
        const originalCount = colors.length
        for (let i = 0; i < originalCount; i++) {
          const baseColor = colors[i]
          // Add lighter shade
          const lighterColor = generateColor(
            baseColor.hsl.h,
            baseColor.hsl.s,
            Math.min(90, baseColor.hsl.l + 20)
          )
          // Add darker shade
          const darkerColor = generateColor(
            baseColor.hsl.h,
            baseColor.hsl.s,
            Math.max(10, baseColor.hsl.l - 20)
          )
          colors.push(lighterColor, darkerColor)
        }
      }
      
      const palette: GeneratedPalette = {
        name: `${config.scheme.charAt(0).toUpperCase() + config.scheme.slice(1)} Palette`,
        scheme: config.scheme,
        colors,
        baseColor: colors[0],
        timestamp: new Date(),
        id: `palette_${Date.now()}`
      }
      
      setGeneratedPalettes([palette, ...generatedPalettes.slice(0, 4)]) // Keep only last 5 palettes
      
    } catch (error) {
      console.error('Error generating palette:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatColor = (color: Color): string => {
    switch (config.format) {
      case 'hex':
        return color.hex
      case 'rgb':
        return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
      case 'hsl':
        return `hsl(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%)`
      case 'css':
        return `--color-${color.name.toLowerCase()}: ${color.hex};`
      default:
        return color.hex
    }
  }

  const copyColor = (color: Color) => {
    navigator.clipboard.writeText(formatColor(color))
  }

  const copyPalette = (palette: GeneratedPalette) => {
    const colors = palette.colors.map(color => formatColor(color)).join('\n')
    navigator.clipboard.writeText(colors)
  }

  const downloadPalette = (palette: GeneratedPalette) => {
    const colors = palette.colors.map((color, index) => 
      `${index + 1}. ${color.name}\t${color.hex}\t${formatColor(color)}`
    ).join('\n')
    
    const header = `${palette.name}\nScheme: ${palette.scheme}\nGenerated: ${palette.timestamp.toLocaleString()}\n\nName\tHex\tFormatted\n`
    const blob = new Blob([header + colors], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${palette.name.replace(/[^a-zA-Z0-9]/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'vibrant' | 'pastel' | 'dark' | 'natural') => {
    switch (preset) {
      case 'vibrant':
        setConfig(prev => ({
          ...prev,
          saturation: 90,
          lightness: 50,
          colorCount: 5,
          scheme: 'triadic'
        }))
        break
      case 'pastel':
        setConfig(prev => ({
          ...prev,
          saturation: 40,
          lightness: 75,
          colorCount: 6,
          scheme: 'analogous'
        }))
        break
      case 'dark':
        setConfig(prev => ({
          ...prev,
          saturation: 60,
          lightness: 25,
          colorCount: 4,
          scheme: 'complementary'
        }))
        break
      case 'natural':
        setConfig(prev => ({
          ...prev,
          saturation: 50,
          lightness: 40,
          colorCount: 5,
          scheme: 'analogous'
        }))
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Color Palette Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Create beautiful color palettes using color theory principles. Generate harmonious color schemes for your design projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：调色板配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Palette className="h-5 w-5" />
                  Palette Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure color palette generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 配色方案 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Color Scheme</Label>
                  <div className="space-y-2">
                    {colorSchemes.map(scheme => (
                      <button
                        key={scheme.key}
                        onClick={() => setConfig(prev => ({ ...prev, scheme: scheme.key as any }))}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.scheme === scheme.key
                            ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{scheme.icon}</span>
                          <span className="font-medium">{scheme.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-1">
                          {scheme.description}
                        </div>
                        <div className="text-xs text-slate-500">
                          Example: {scheme.example}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 颜色数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Colors</Label>
                  <Input
                    type="number"
                    min={2}
                    max={12}
                    value={config.colorCount}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      colorCount: Math.max(2, Math.min(12, parseInt(e.target.value) || 5))
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* 基础色调 */}
                {config.scheme !== 'random' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Base Hue</Label>
                    <Input
                      type="number"
                      min={0}
                      max={360}
                      value={config.baseHue || 180}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        baseHue: parseInt(e.target.value) || 180
                      }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Random if empty"
                    />
                  </div>
                )}

                {/* 饱和度和亮度 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-slate-300 text-xs">Saturation</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={config.saturation}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        saturation: Math.max(0, Math.min(100, parseInt(e.target.value) || 70))
                      }))}
                      className="bg-white/10 border-white/20 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-300 text-xs">Lightness</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={config.lightness}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        lightness: Math.max(0, Math.min(100, parseInt(e.target.value) || 50))
                      }))}
                      className="bg-white/10 border-white/20 text-white text-sm"
                    />
                  </div>
                </div>

                {/* 输出格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Format</Label>
                  <select
                    value={config.format}
                    onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="hex" className="bg-slate-800">HEX (#FF5733)</option>
                    <option value="rgb" className="bg-slate-800">RGB (rgb(255, 87, 51))</option>
                    <option value="hsl" className="bg-slate-800">HSL (hsl(9, 100%, 60%))</option>
                    <option value="css" className="bg-slate-800">CSS Variables</option>
                  </select>
                </div>

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Options</Label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={config.includeShades}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeShades: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include lighter/darker shades</span>
                  </label>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('vibrant')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Vibrant
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('pastel')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Pastel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('dark')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Dark
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('natural')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Sun className="h-3 w-3 mr-1" />
                      Natural
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generatePalette}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Palette className="h-4 w-4 mr-2" />
                      Generate Palette
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的调色板 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedPalettes.length > 0 ? (
              generatedPalettes.map((palette, index) => (
                <Card key={palette.id} className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Palette className="h-5 w-5 text-indigo-400" />
                          {palette.name}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {palette.colors.length} colors • {palette.scheme} scheme
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyPalette(palette)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadPalette(palette)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* 颜色预览 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
                      {palette.colors.map((color, colorIndex) => (
                        <div
                          key={`${color.hex}-${colorIndex}`}
                          className="relative group cursor-pointer"
                          onClick={() => copyColor(color)}
                        >
                          <div
                            className="w-full h-20 rounded-lg border-2 border-white/20 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="mt-2 text-center">
                            <div className="text-white text-sm font-medium truncate">
                              {color.name}
                            </div>
                            <div className="text-slate-400 text-xs font-mono">
                              {formatColor(color)}
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="h-4 w-4 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/10">
                      <span>Generated {palette.timestamp.toLocaleString()}</span>
                      <span>Palette #{index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Palette className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to create color palettes?</p>
                  <p>Configure your settings and click "Generate Palette"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Color Palette Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Color Theory Schemes</h4>
                    <p className="text-sm">Choose from monochromatic, analogous, complementary, triadic, tetradic, or random color schemes based on color theory.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Customization Controls</h4>
                    <p className="text-sm">Adjust saturation, lightness, and base hue to fine-tune your palette. Include shades for more variety.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Export Formats</h4>
                    <p className="text-sm">Get colors in HEX, RGB, HSL, or CSS variable formats for easy integration into your projects.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Web design</li>
                      <li>Brand identity</li>
                      <li>UI/UX projects</li>
                      <li>Art direction</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Marketing materials</li>
                      <li>Interior design</li>
                      <li>Digital art</li>
                      <li>Theme creation</li>
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