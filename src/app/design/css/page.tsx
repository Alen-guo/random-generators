"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, RefreshCw, Copy, Download, Sparkles, Code, Eye } from 'lucide-react'

interface CSSConfig {
  properties: string[]
  count: number
  format: 'css' | 'json' | 'scss'
  includeVendorPrefixes: boolean
  minify: boolean
}

interface GeneratedCSS {
  selector: string
  properties: { [key: string]: string }
  cssText: string
  preview?: string
  timestamp: Date
  id: string
}

export default function CSSPage() {
  const [config, setConfig] = useState<CSSConfig>({
    properties: ['background', 'border', 'box-shadow', 'text-shadow'],
    count: 5,
    format: 'css',
    includeVendorPrefixes: false,
    minify: false
  })
  const [generatedCSS, setGeneratedCSS] = useState<GeneratedCSS[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const availableProperties = [
    { 
      key: 'background', 
      name: 'Background', 
      description: 'Colors, gradients, patterns',
      examples: ['linear-gradient', 'radial-gradient', 'solid colors']
    },
    { 
      key: 'border', 
      name: 'Border', 
      description: 'Width, style, color, radius',
      examples: ['solid', 'dashed', 'dotted', 'rounded corners']
    },
    { 
      key: 'box-shadow', 
      name: 'Box Shadow', 
      description: 'Drop shadows and insets',
      examples: ['drop shadow', 'inset shadow', 'multiple shadows']
    },
    { 
      key: 'text-shadow', 
      name: 'Text Shadow', 
      description: 'Text shadow effects',
      examples: ['glow effect', 'outline', 'multiple shadows']
    },
    { 
      key: 'transform', 
      name: 'Transform', 
      description: 'Rotate, scale, translate',
      examples: ['rotate', 'scale', 'skew', 'translate']
    },
    { 
      key: 'animation', 
      name: 'Animation', 
      description: 'CSS animations',
      examples: ['keyframes', 'transitions', 'timing functions']
    },
    { 
      key: 'filter', 
      name: 'Filter', 
      description: 'Visual filters',
      examples: ['blur', 'brightness', 'contrast', 'hue-rotate']
    },
    { 
      key: 'typography', 
      name: 'Typography', 
      description: 'Font properties',
      examples: ['font-family', 'font-size', 'line-height', 'letter-spacing']
    }
  ]

  const generateRandomColor = (): string => {
    const formats = ['hex', 'rgb', 'hsl']
    const format = formats[Math.floor(Math.random() * formats.length)]
    
    switch (format) {
      case 'hex':
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
      case 'rgb':
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
      case 'hsl':
        return `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 100)}%, ${Math.floor(Math.random() * 100)}%)`
      default:
        return '#000000'
    }
  }

  const generateBackground = (): string => {
    const types = ['solid', 'linear-gradient', 'radial-gradient', 'conic-gradient']
    const type = types[Math.floor(Math.random() * types.length)]
    
    switch (type) {
      case 'solid':
        return generateRandomColor()
      
      case 'linear-gradient':
        const angle = Math.floor(Math.random() * 360)
        const color1 = generateRandomColor()
        const color2 = generateRandomColor()
        const color3 = Math.random() > 0.5 ? `, ${generateRandomColor()}` : ''
        return `linear-gradient(${angle}deg, ${color1}, ${color2}${color3})`
      
      case 'radial-gradient':
        const shape = Math.random() > 0.5 ? 'circle' : 'ellipse'
        const rColor1 = generateRandomColor()
        const rColor2 = generateRandomColor()
        return `radial-gradient(${shape}, ${rColor1}, ${rColor2})`
      
      case 'conic-gradient':
        const cAngle = Math.floor(Math.random() * 360)
        const cColor1 = generateRandomColor()
        const cColor2 = generateRandomColor()
        return `conic-gradient(from ${cAngle}deg, ${cColor1}, ${cColor2})`
      
      default:
        return generateRandomColor()
    }
  }

  const generateBorder = (): { [key: string]: string } => {
    const widths = ['1px', '2px', '3px', '4px', '5px']
    const styles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge']
    const radius = ['0', '4px', '8px', '12px', '16px', '50%']
    
    return {
      'border-width': widths[Math.floor(Math.random() * widths.length)],
      'border-style': styles[Math.floor(Math.random() * styles.length)],
      'border-color': generateRandomColor(),
      'border-radius': radius[Math.floor(Math.random() * radius.length)]
    }
  }

  const generateBoxShadow = (): string => {
    const count = Math.floor(Math.random() * 3) + 1
    const shadows = []
    
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 20) - 10
      const y = Math.floor(Math.random() * 20) - 10
      const blur = Math.floor(Math.random() * 20)
      const spread = Math.floor(Math.random() * 10)
      const color = generateRandomColor()
      const inset = Math.random() > 0.8 ? 'inset ' : ''
      
      shadows.push(`${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`)
    }
    
    return shadows.join(', ')
  }

  const generateTextShadow = (): string => {
    const count = Math.floor(Math.random() * 2) + 1
    const shadows = []
    
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 10) - 5
      const y = Math.floor(Math.random() * 10) - 5
      const blur = Math.floor(Math.random() * 10)
      const color = generateRandomColor()
      
      shadows.push(`${x}px ${y}px ${blur}px ${color}`)
    }
    
    return shadows.join(', ')
  }

  const generateTransform = (): string => {
    const transforms = []
    const functions = ['rotate', 'scale', 'translate', 'skew']
    const count = Math.floor(Math.random() * 3) + 1
    
    for (let i = 0; i < count; i++) {
      const func = functions[Math.floor(Math.random() * functions.length)]
      
      switch (func) {
        case 'rotate':
          transforms.push(`rotate(${Math.floor(Math.random() * 360)}deg)`)
          break
        case 'scale':
          const scale = (Math.random() * 2 + 0.5).toFixed(2)
          transforms.push(`scale(${scale})`)
          break
        case 'translate':
          const x = Math.floor(Math.random() * 100) - 50
          const y = Math.floor(Math.random() * 100) - 50
          transforms.push(`translate(${x}px, ${y}px)`)
          break
        case 'skew':
          const skewX = Math.floor(Math.random() * 30) - 15
          const skewY = Math.floor(Math.random() * 30) - 15
          transforms.push(`skew(${skewX}deg, ${skewY}deg)`)
          break
      }
    }
    
    return transforms.join(' ')
  }

  const generateAnimation = (): { [key: string]: string } => {
    const durations = ['0.5s', '1s', '1.5s', '2s', '3s']
    const timingFunctions = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(0.4, 0, 0.2, 1)']
    const iterations = ['1', '2', '3', 'infinite']
    const directions = ['normal', 'reverse', 'alternate', 'alternate-reverse']
    
    return {
      'animation-duration': durations[Math.floor(Math.random() * durations.length)],
      'animation-timing-function': timingFunctions[Math.floor(Math.random() * timingFunctions.length)],
      'animation-iteration-count': iterations[Math.floor(Math.random() * iterations.length)],
      'animation-direction': directions[Math.floor(Math.random() * directions.length)]
    }
  }

  const generateFilter = (): string => {
    const filters = []
    const filterFunctions = [
      () => `blur(${Math.floor(Math.random() * 10)}px)`,
      () => `brightness(${(Math.random() * 2).toFixed(2)})`,
      () => `contrast(${(Math.random() * 2).toFixed(2)})`,
      () => `hue-rotate(${Math.floor(Math.random() * 360)}deg)`,
      () => `saturate(${(Math.random() * 2).toFixed(2)})`,
      () => `sepia(${Math.random().toFixed(2)})`
    ]
    
    const count = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < count; i++) {
      const filterFunc = filterFunctions[Math.floor(Math.random() * filterFunctions.length)]
      filters.push(filterFunc())
    }
    
    return filters.join(' ')
  }

  const generateTypography = (): { [key: string]: string } => {
    const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px']
    const lineHeights = ['1.2', '1.4', '1.5', '1.6', '1.8']
    const letterSpacings = ['normal', '0.5px', '1px', '2px', '-0.5px']
    const fontWeights = ['300', '400', '500', '600', '700', '800']
    
    return {
      'font-size': fontSizes[Math.floor(Math.random() * fontSizes.length)],
      'line-height': lineHeights[Math.floor(Math.random() * lineHeights.length)],
      'letter-spacing': letterSpacings[Math.floor(Math.random() * letterSpacings.length)],
      'font-weight': fontWeights[Math.floor(Math.random() * fontWeights.length)],
      'color': generateRandomColor()
    }
  }

  const generatePropertyValue = (property: string): { [key: string]: string } => {
    switch (property) {
      case 'background':
        return { 'background': generateBackground() }
      case 'border':
        return generateBorder()
      case 'box-shadow':
        return { 'box-shadow': generateBoxShadow() }
      case 'text-shadow':
        return { 'text-shadow': generateTextShadow() }
      case 'transform':
        return { 'transform': generateTransform() }
      case 'animation':
        return generateAnimation()
      case 'filter':
        return { 'filter': generateFilter() }
      case 'typography':
        return generateTypography()
      default:
        return {}
    }
  }

  const generateCSS = async () => {
    setIsGenerating(true)
    
    try {
      const cssItems: GeneratedCSS[] = []
      
      for (let i = 0; i < config.count; i++) {
        const selector = `.element-${i + 1}`
        const properties: { [key: string]: string } = {}
        
        // Generate properties based on selected types
        config.properties.forEach(property => {
          const propValues = generatePropertyValue(property)
          Object.assign(properties, propValues)
        })
        
        // Generate CSS text
        const cssText = formatCSS(selector, properties)
        
        const generatedItem: GeneratedCSS = {
          selector,
          properties,
          cssText,
          timestamp: new Date(),
          id: `css_${Date.now()}_${i}`
        }
        
        cssItems.push(generatedItem)
        
        // Add delay for animation
        if (i % 2 === 0) {
          await new Promise(resolve => setTimeout(resolve, 150))
        }
      }
      
      setGeneratedCSS(cssItems)
    } catch (error) {
      console.error('Error generating CSS:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatCSS = (selector: string, properties: { [key: string]: string }): string => {
    const indent = config.minify ? '' : '  '
    const newline = config.minify ? '' : '\n'
    const space = config.minify ? '' : ' '
    
    let css = `${selector}${space}{${newline}`
    
    Object.entries(properties).forEach(([prop, value]) => {
      css += `${indent}${prop}:${space}${value};${newline}`
    })
    
    css += `}${newline}`
    
    return css
  }

  const toggleProperty = (property: string) => {
    setConfig(prev => ({
      ...prev,
      properties: prev.properties.includes(property)
        ? prev.properties.filter(p => p !== property)
        : [...prev.properties, property]
    }))
  }

  const copyCSS = (css: string) => {
    navigator.clipboard.writeText(css)
  }

  const copyAllCSS = () => {
    const allCSS = generatedCSS.map(item => item.cssText).join('\n')
    navigator.clipboard.writeText(allCSS)
  }

  const downloadCSS = () => {
    const content = generatedCSS.map(item => item.cssText).join('\n')
    const blob = new Blob([content], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-styles-${Date.now()}.css`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'buttons' | 'cards' | 'animations' | 'effects') => {
    switch (preset) {
      case 'buttons':
        setConfig(prev => ({ 
          ...prev, 
          properties: ['background', 'border', 'box-shadow'],
          count: 8
        }))
        break
      case 'cards':
        setConfig(prev => ({ 
          ...prev, 
          properties: ['background', 'border', 'box-shadow'],
          count: 6
        }))
        break
      case 'animations':
        setConfig(prev => ({ 
          ...prev, 
          properties: ['transform', 'animation'],
          count: 5
        }))
        break
      case 'effects':
        setConfig(prev => ({ 
          ...prev, 
          properties: ['filter', 'text-shadow', 'box-shadow'],
          count: 7
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
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">CSS Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random CSS styles for inspiration and rapid prototyping. Create unique designs with random properties and values.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：CSS配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Code className="h-5 w-5" />
                  CSS Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure CSS property generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 属性选择 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">CSS Properties ({config.properties.length} selected)</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableProperties.map(property => (
                      <button
                        key={property.key}
                        onClick={() => toggleProperty(property.key)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.properties.includes(property.key)
                            ? 'bg-violet-500/20 border-violet-400 text-violet-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium mb-1">{property.name}</div>
                        <div className="text-xs text-slate-400 mb-1">
                          {property.description}
                        </div>
                        <div className="text-xs text-slate-500">
                          {property.examples.join(', ')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 生成数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Styles</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      count: Math.max(1, Math.min(20, parseInt(e.target.value) || 5))
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* 格式选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.minify}
                        onChange={(e) => setConfig(prev => ({ ...prev, minify: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Minify output</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeVendorPrefixes}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeVendorPrefixes: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include vendor prefixes</span>
                    </label>
                  </div>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('buttons')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Buttons
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('cards')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      Cards
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('animations')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Animations
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('effects')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Effects
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateCSS}
                  disabled={isGenerating || config.properties.length === 0}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Palette className="h-4 w-4 mr-2" />
                      Generate CSS
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的CSS */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated CSS Styles</CardTitle>
                    <CardDescription className="text-slate-300">
                      {generatedCSS.length > 0 ? `${generatedCSS.length} CSS styles generated` : 'No CSS styles generated yet'}
                    </CardDescription>
                  </div>
                  {generatedCSS.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllCSS}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy All
                      </Button>
                      <Button
                        onClick={downloadCSS}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedCSS.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {generatedCSS.map((cssItem, index) => (
                        <div
                          key={cssItem.id}
                          className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-violet-400 font-mono font-semibold">
                              {cssItem.selector}
                            </span>
                            <Button
                              onClick={() => copyCSS(cssItem.cssText)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="bg-slate-900 border border-white/20 rounded p-3 mb-3">
                            <pre className="text-sm text-white whitespace-pre-wrap overflow-x-auto">
                              {cssItem.cssText}
                            </pre>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{Object.keys(cssItem.properties).length} properties</span>
                            <span>#{index + 1} • {cssItem.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Palette className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate CSS styles?</p>
                    <p>Select properties and click "Generate CSS"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">CSS Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Property Types</h4>
                    <p className="text-sm">Select CSS properties to generate random values for backgrounds, borders, shadows, and more.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Output Options</h4>
                    <p className="text-sm">Choose between minified or formatted output, with optional vendor prefixes.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Quick Presets</h4>
                    <p className="text-sm">Use presets for common UI elements like buttons, cards, animations, and effects.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Design inspiration</li>
                      <li>Rapid prototyping</li>
                      <li>UI experimentation</li>
                      <li>Style variations</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Creative coding</li>
                      <li>Learning CSS</li>
                      <li>Art projects</li>
                      <li>Quick mockups</li>
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