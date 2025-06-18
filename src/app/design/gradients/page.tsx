"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palette, RefreshCw, Copy, Download, Layers, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface GradientConfig {
  type: 'linear' | 'radial' | 'conic'
  colorCount: number
  direction: string
  randomness: number
  harmony: 'random' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic'
  saturation: number
  lightness: number
  count: number
  includeStops: boolean
}

interface GeneratedGradient {
  id: string
  css: string
  colors: string[]
  type: 'linear' | 'radial' | 'conic'
  direction: string
  stops: number[]
  name: string
}

export default function GradientsPage() {
  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    colorCount: 3,
    direction: '45deg',
    randomness: 50,
    harmony: 'random',
    saturation: 70,
    lightness: 60,
    count: 6,
    includeStops: true
  })
  const [generatedGradients, setGeneratedGradients] = useState<GeneratedGradient[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const directions = [
    { value: '0deg', label: 'Top to Bottom' },
    { value: '45deg', label: 'Diagonal ↗' },
    { value: '90deg', label: 'Left to Right' },
    { value: '135deg', label: 'Diagonal ↘' },
    { value: '180deg', label: 'Bottom to Top' },
    { value: '225deg', label: 'Diagonal ↙' },
    { value: '270deg', label: 'Right to Left' },
    { value: '315deg', label: 'Diagonal ↖' },
    { value: 'random', label: 'Random Angle' }
  ]

  const generateRandomColor = (saturation: number, lightness: number): string => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const generateHarmoniousColors = (baseHue: number, count: number, harmony: string, saturation: number, lightness: number): string[] => {
    const colors: string[] = []
    
    switch (harmony) {
      case 'monochromatic':
        for (let i = 0; i < count; i++) {
          const l = lightness + (i - count/2) * 15
          colors.push(`hsl(${baseHue}, ${saturation}%, ${Math.max(10, Math.min(90, l))}%)`)
        }
        break
        
      case 'analogous':
        for (let i = 0; i < count; i++) {
          const h = (baseHue + i * 30) % 360
          colors.push(`hsl(${h}, ${saturation}%, ${lightness}%)`)
        }
        break
        
      case 'complementary':
        colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`)
        colors.push(`hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`)
        for (let i = 2; i < count; i++) {
          const h = (baseHue + i * 60) % 360
          colors.push(`hsl(${h}, ${saturation}%, ${lightness}%)`)
        }
        break
        
      case 'triadic':
        for (let i = 0; i < count; i++) {
          const h = (baseHue + i * 120) % 360
          colors.push(`hsl(${h}, ${saturation}%, ${lightness}%)`)
        }
        break
        
      default: // random
        for (let i = 0; i < count; i++) {
          colors.push(generateRandomColor(saturation, lightness))
        }
    }
    
    return colors
  }

  const generateGradientStops = (colorCount: number, randomness: number): number[] => {
    if (colorCount === 1) return [0]
    if (colorCount === 2) return [0, 100]
    
    const stops: number[] = [0]
    
    for (let i = 1; i < colorCount - 1; i++) {
      const baseStop = (i / (colorCount - 1)) * 100
      const variation = (randomness / 100) * 20 // 最大20%的随机变化
      const randomOffset = (Math.random() - 0.5) * variation
      stops.push(Math.max(5, Math.min(95, baseStop + randomOffset)))
    }
    
    stops.push(100)
    return stops.sort((a, b) => a - b)
  }

  const generateGradientName = (colors: string[], type: string): string => {
    const colorNames = [
      'Fire', 'Ocean', 'Sunset', 'Aurora', 'Galaxy', 'Forest', 'Desert', 'Ice',
      'Magma', 'Cosmic', 'Emerald', 'Ruby', 'Sapphire', 'Golden', 'Silver', 'Bronze',
      'Tropical', 'Arctic', 'Volcanic', 'Mystic', 'Electric', 'Neon', 'Pastel', 'Vibrant'
    ]
    
    const typeNames = {
      linear: ['Flow', 'Stream', 'Wave', 'Cascade'],
      radial: ['Burst', 'Bloom', 'Sphere', 'Aura'],
      conic: ['Spiral', 'Twist', 'Vortex', 'Spin']
    }
    
    const baseName = colorNames[Math.floor(Math.random() * colorNames.length)]
    const typeName = typeNames[type as keyof typeof typeNames][Math.floor(Math.random() * typeNames[type as keyof typeof typeNames].length)]
    
    return `${baseName} ${typeName}`
  }

  const generateGradientCSS = (
    type: 'linear' | 'radial' | 'conic',
    colors: string[],
    direction: string,
    stops: number[]
  ): string => {
    const colorStops = colors.map((color, index) => 
      config.includeStops ? `${color} ${stops[index]}%` : color
    ).join(', ')
    
    let actualDirection = direction
    if (direction === 'random') {
      actualDirection = `${Math.floor(Math.random() * 360)}deg`
    }
    
    switch (type) {
      case 'linear':
        return `linear-gradient(${actualDirection}, ${colorStops})`
      case 'radial':
        const shape = Math.random() > 0.5 ? 'circle' : 'ellipse'
        const position = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'][Math.floor(Math.random() * 9)]
        return `radial-gradient(${shape} at ${position}, ${colorStops})`
      case 'conic':
        return `conic-gradient(from ${actualDirection} at center, ${colorStops})`
      default:
        return `linear-gradient(${actualDirection}, ${colorStops})`
    }
  }

  const generateGradients = async () => {
    setIsGenerating(true)
    
    try {
      const gradients: GeneratedGradient[] = []
      
      for (let i = 0; i < config.count; i++) {
        const baseHue = Math.floor(Math.random() * 360)
        const colors = generateHarmoniousColors(
          baseHue,
          config.colorCount,
          config.harmony,
          config.saturation + (Math.random() - 0.5) * (config.randomness / 5),
          config.lightness + (Math.random() - 0.5) * (config.randomness / 5)
        )
        
        const stops = generateGradientStops(config.colorCount, config.randomness)
        const css = generateGradientCSS(config.type, colors, config.direction, stops)
        const name = generateGradientName(colors, config.type)
        
        gradients.push({
          id: `gradient_${Date.now()}_${i}`,
          css,
          colors,
          type: config.type,
          direction: config.direction === 'random' ? `${Math.floor(Math.random() * 360)}deg` : config.direction,
          stops,
          name
        })
        
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      
      setGeneratedGradients(gradients)
      
    } catch (error) {
      console.error('Error generating gradients:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyGradients = () => {
    const content = generatedGradients.map(gradient => 
      `/* ${gradient.name} */\nbackground: ${gradient.css};`
    ).join('\n\n')
    navigator.clipboard.writeText(content)
  }

  const copyGradient = (gradient: GeneratedGradient) => {
    navigator.clipboard.writeText(`background: ${gradient.css};`)
  }

  const downloadGradients = () => {
    const content = `/* Random CSS Gradients */
/* Generated: ${new Date().toLocaleString()} */
/* Type: ${config.type} */
/* Colors: ${config.colorCount} */
/* Harmony: ${config.harmony} */
/* Count: ${generatedGradients.length} */

${generatedGradients.map((gradient, index) => `
/* ${gradient.name} */
.gradient-${index + 1} {
  background: ${gradient.css};
}

/* Alternative usage */
.gradient-${index + 1}-bg {
  background-image: ${gradient.css};
}
`).join('\n')}

/* Usage Examples */
/*
.hero-section {
  background: ${generatedGradients[0]?.css || 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'};
}

.card-background {
  background-image: ${generatedGradients[1]?.css || 'radial-gradient(circle, #667eea, #764ba2)'};
}
*/`

    const blob = new Blob([content], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-gradients-${Date.now()}.css`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'vibrant' | 'pastel' | 'dark' | 'monochrome' | 'rainbow') => {
    switch (preset) {
      case 'vibrant':
        setConfig(prev => ({
          ...prev,
          type: 'linear',
          colorCount: 3,
          harmony: 'triadic',
          saturation: 90,
          lightness: 60,
          randomness: 30,
          count: 8
        }))
        break
      case 'pastel':
        setConfig(prev => ({
          ...prev,
          type: 'radial',
          colorCount: 2,
          harmony: 'analogous',
          saturation: 40,
          lightness: 80,
          randomness: 20,
          count: 6
        }))
        break
      case 'dark':
        setConfig(prev => ({
          ...prev,
          type: 'linear',
          colorCount: 3,
          harmony: 'complementary',
          saturation: 70,
          lightness: 30,
          randomness: 40,
          count: 6
        }))
        break
      case 'monochrome':
        setConfig(prev => ({
          ...prev,
          type: 'linear',
          colorCount: 4,
          harmony: 'monochromatic',
          saturation: 60,
          lightness: 50,
          randomness: 60,
          count: 4
        }))
        break
      case 'rainbow':
        setConfig(prev => ({
          ...prev,
          type: 'conic',
          colorCount: 6,
          harmony: 'random',
          saturation: 80,
          lightness: 60,
          randomness: 70,
          count: 3
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
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">CSS Gradient Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate beautiful CSS gradients with color harmony theory. Perfect for web design, backgrounds, and modern UI elements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Palette className="h-5 w-5" />
                  Gradient Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure gradient generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 渐变类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Gradient Type</Label>
                  <Select value={config.type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">📏 Linear</SelectItem>
                      <SelectItem value="radial">⭕ Radial</SelectItem>
                      <SelectItem value="conic">🌀 Conic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 颜色数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Color Count</Label>
                  <Input
                    type="number"
                    value={config.colorCount}
                    onChange={(e) => setConfig(prev => ({ ...prev, colorCount: Math.max(2, Math.min(8, parseInt(e.target.value) || 3)) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="2"
                    max="8"
                  />
                </div>

                {/* 方向（仅线性渐变） */}
                {config.type === 'linear' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Direction</Label>
                    <Select value={config.direction} onValueChange={(value) => setConfig(prev => ({ ...prev, direction: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {directions.map(dir => (
                          <SelectItem key={dir.value} value={dir.value}>{dir.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 颜色和谐 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Color Harmony</Label>
                  <Select value={config.harmony} onValueChange={(value: any) => setConfig(prev => ({ ...prev, harmony: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">🎲 Random</SelectItem>
                      <SelectItem value="monochromatic">🎨 Monochromatic</SelectItem>
                      <SelectItem value="analogous">🌈 Analogous</SelectItem>
                      <SelectItem value="complementary">⚖️ Complementary</SelectItem>
                      <SelectItem value="triadic">🔺 Triadic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 饱和度 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Saturation ({config.saturation}%)</Label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={config.saturation}
                    onChange={(e) => setConfig(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* 亮度 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Lightness ({config.lightness}%)</Label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={config.lightness}
                    onChange={(e) => setConfig(prev => ({ ...prev, lightness: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* 随机度 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Randomness ({config.randomness}%)</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.randomness}
                    onChange={(e) => setConfig(prev => ({ ...prev, randomness: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400">Higher values create more variation</p>
                </div>

                {/* 数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Count</Label>
                  <Input
                    type="number"
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ ...prev, count: Math.max(1, Math.min(12, parseInt(e.target.value) || 6)) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="1"
                    max="12"
                  />
                </div>

                {/* 选项 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeStops"
                      checked={config.includeStops}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeStops: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="includeStops" className="text-slate-300">Include Color Stops</Label>
                  </div>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('vibrant')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      ✨ Vibrant
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('pastel')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌸 Pastel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('dark')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌙 Dark
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('monochrome')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      ⚫ Mono
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('rainbow')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs col-span-2"
                    >
                      🌈 Rainbow
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateGradients}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Gradients
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的渐变 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedGradients.length > 0 ? (
              <>
                {/* 操作按钮 */}
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {generatedGradients.length} gradients generated
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={copyGradients}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy All
                        </Button>
                        <Button
                          onClick={downloadGradients}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download CSS
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 渐变网格 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {generatedGradients.map((gradient, index) => (
                    <motion.div
                      key={gradient.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/10 border-white/20 overflow-hidden">
                        <div 
                          className="h-32 relative cursor-pointer group"
                          style={{ background: gradient.css }}
                          onClick={() => copyGradient(gradient)}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Copy className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-white font-medium">{gradient.name}</h3>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyGradient(gradient)}
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-xs text-slate-400">CSS Property:</div>
                              <div className="bg-slate-800 rounded p-2 text-xs font-mono text-slate-300 break-all">
                                background: {gradient.css};
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-slate-400">Colors:</div>
                              <div className="flex gap-1">
                                {gradient.colors.map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-4 h-4 rounded border border-white/20"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Layers className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to create beautiful gradients?</p>
                  <p>Configure your preferences and click "Generate Gradients"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">CSS Gradient Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Gradient Types</h4>
                    <p className="text-sm">Linear gradients flow in straight lines, radial gradients emanate from a center point, and conic gradients rotate around a center.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Color Harmony</h4>
                    <p className="text-sm">Use color theory principles to create visually pleasing combinations: monochromatic (same hue), analogous (adjacent hues), or complementary (opposite hues).</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">CSS Usage</h4>
                    <p className="text-sm">Copy the generated CSS and apply it to background or background-image properties. Perfect for buttons, cards, headers, and hero sections.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Applications:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Website backgrounds</li>
                      <li>Button designs</li>
                      <li>Card overlays</li>
                      <li>Hero sections</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Loading animations</li>
                      <li>Progress bars</li>
                      <li>Brand elements</li>
                      <li>Modern UI designs</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-200 text-sm">
                    <strong>Tip:</strong> Click on any gradient preview to copy its CSS code directly to your clipboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}