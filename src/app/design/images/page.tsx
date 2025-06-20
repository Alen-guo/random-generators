"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image, RefreshCw, Copy, Download, Grid, Camera, Palette } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface ImageConfig {
  width: number
  height: number
  category: string
  orientation: 'square' | 'landscape' | 'portrait'
  style: 'photos' | 'illustrations' | 'patterns' | 'gradients'
}

interface GeneratedImage {
  url: string
  width: number
  height: number
  category: string
  style: string
  timestamp: Date
  id: string
}

export default function ImagesPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<ImageConfig>({
    width: 800,
    height: 600,
    category: 'nature',
    orientation: 'landscape',
    style: 'photos'
  })
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageCount, setImageCount] = useState(4)

  const categories = [
    'nature', 'animals', 'food', 'people', 'business', 'technology',
    'architecture', 'travel', 'sports', 'abstract', 'textures', 'patterns'
  ]

  const styles = [
    { key: 'photos', name: 'Photos', desc: 'Real photographs' },
    { key: 'illustrations', name: 'Illustrations', desc: 'Digital artwork' },
    { key: 'patterns', name: 'Patterns', desc: 'Geometric patterns' },
    { key: 'gradients', name: 'Gradients', desc: 'Color gradients' }
  ]

  const orientations = [
    { key: 'square', name: 'Square', ratio: '1:1', dimensions: { width: 800, height: 800 } },
    { key: 'landscape', name: 'Landscape', ratio: '16:9', dimensions: { width: 800, height: 450 } },
    { key: 'portrait', name: 'Portrait', ratio: '9:16', dimensions: { width: 450, height: 800 } }
  ]

  const presetSizes = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Desktop Wallpaper', width: 1920, height: 1080 }
  ]

  const generateImages = async () => {
    setIsGenerating(true)
    
    try {
      const newImages: GeneratedImage[] = []
      
      for (let i = 0; i < imageCount; i++) {
        // Generate placeholder image URLs (in real app, would use actual API)
        const imageUrl = generatePlaceholderUrl(config)
        
        const generatedImage: GeneratedImage = {
          url: imageUrl,
          width: config.width,
          height: config.height,
          category: config.category,
          style: config.style,
          timestamp: new Date(),
          id: `img_${Date.now()}_${i}`
        }
        
        newImages.push(generatedImage)
        
        // Add delay for animation effect
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      setGeneratedImages(newImages)
    } catch (error) {
      console.error('Error generating images:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePlaceholderUrl = (config: ImageConfig): string => {
    // Enhanced placeholder generation with better variety
    const { width, height, category, style } = config
    const seed = Math.floor(Math.random() * 1000000)
    
    if (style === 'gradients') {
      const gradients = [
        'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(45deg, #fa709a 0%, #fee140 100%)'
      ]
      const gradient = gradients[Math.floor(Math.random() * gradients.length)]
      // Create data URL for gradient
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const grd = ctx.createLinearGradient(0, 0, width, height)
        grd.addColorStop(0, '#667eea')
        grd.addColorStop(1, '#764ba2')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, width, height)
        return canvas.toDataURL()
      }
    }
    
    if (style === 'patterns') {
      // Generate geometric patterns
      const patterns = ['dots', 'stripes', 'checkers', 'triangles', 'hexagons']
      const pattern = patterns[Math.floor(Math.random() * patterns.length)]
      return `https://dummyimage.com/${width}x${height}/2D3748/4A5568.png&text=${pattern.toUpperCase()}`
    }
    
    // Use multiple placeholder services for variety
    const services = [
      `https://picsum.photos/${width}/${height}?random=${seed}`,
      `https://source.unsplash.com/${width}x${height}/?${category}&sig=${seed}`,
      `https://via.placeholder.com/${width}x${height}/6366F1/FFFFFF?text=${category.toUpperCase()}`
    ]
    
    return services[Math.floor(Math.random() * services.length)]
  }

  const setOrientation = (orientation: 'square' | 'landscape' | 'portrait') => {
    const selected = orientations.find(o => o.key === orientation)
    if (selected) {
      setConfig(prev => ({
        ...prev,
        orientation,
        width: selected.dimensions.width,
        height: selected.dimensions.height
      }))
    }
  }

  const setPresetSize = (preset: { width: number; height: number }) => {
    setConfig(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height
    }))
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const generateRandomConfig = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    const randomOrientation = orientations[Math.floor(Math.random() * orientations.length)]
    
    setConfig({
      category: randomCategory,
      style: randomStyle.key as 'photos' | 'illustrations' | 'patterns' | 'gradients',
      orientation: randomOrientation.key as 'square' | 'landscape' | 'portrait',
      width: randomOrientation.dimensions.width,
      height: randomOrientation.dimensions.height
    })
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
              <Image className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Image Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random placeholder images for your projects. Perfect for mockups, designs, and content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Camera className="h-5 w-5" />
                  Image Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your image generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 尺寸设置 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Dimensions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={config.width}
                        onChange={(e) => setConfig(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Input
                        type="number"
                        placeholder="Height"
                        value={config.height}
                        onChange={(e) => setConfig(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Orientation</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {orientations.map(orientation => (
                        <Button
                          key={orientation.key}
                          variant="outline"
                          size="sm"
                          onClick={() => setOrientation(orientation.key as any)}
                          className={`${
                            config.orientation === orientation.key
                              ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                              : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          {orientation.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 类别选择 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        onClick={() => setConfig(prev => ({ ...prev, category }))}
                        className={`${
                          config.category === category
                            ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        } capitalize`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 风格选择 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Style</Label>
                  <div className="space-y-2">
                    {styles.map(style => (
                      <button
                        key={style.key}
                        onClick={() => setConfig(prev => ({ ...prev, style: style.key as any }))}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.style === style.key
                            ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm text-slate-400">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 生成数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Images</Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={imageCount}
                    onChange={(e) => setImageCount(Math.max(1, Math.min(12, parseInt(e.target.value) || 4)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={generateImages}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 font-semibold notranslate"
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
                        <Image className="h-4 w-4 mr-2" />
                        Generate Images
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={generateRandomConfig}
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Random Config
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 预设尺寸 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Preset Sizes</CardTitle>
                <CardDescription className="text-slate-300">
                  Common social media dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {presetSizes.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetSize(preset)}
                    className="w-full justify-between bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <span>{preset.name}</span>
                    <span className="text-slate-400 text-xs">{preset.width}×{preset.height}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的图片 */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Grid className="h-5 w-5" />
                  Generated Images
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {generatedImages.length > 0 ? `${generatedImages.length} images generated` : 'No images generated yet'}
                  {config.width && config.height && ` • ${config.width}×${config.height}px`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="bg-white/5 border border-white/20 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                      >
                        <div className="aspect-video bg-slate-800 relative overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Generated ${image.category} image`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium capitalize">
                              {image.category}
                            </span>
                            <span className="text-slate-400 text-sm capitalize">
                              {image.style}
                            </span>
                          </div>
                          <div className="text-slate-400 text-sm mb-3">
                            {image.width} × {image.height}px
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => copyImageUrl(image.url)}
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy URL
                            </Button>
                            <Button
                              onClick={() => downloadImage(image.url, `image-${image.id}.jpg`)}
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate images?</p>
                    <p>Configure your settings and click "Generate Images"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">How to Use Image Generator</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">1. Set Dimensions</h4>
                    <p className="text-sm">Choose custom dimensions or use preset sizes for social media.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">2. Select Category & Style</h4>
                    <p className="text-sm">Pick the subject matter and visual style for your images.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">3. Generate & Download</h4>
                    <p className="text-sm">Generate multiple images at once and download your favorites.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Website mockups</li>
                      <li>Social media content</li>
                      <li>Presentation slides</li>
                      <li>Design placeholders</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Blog post images</li>
                      <li>App development</li>
                      <li>Print materials</li>
                      <li>Creative projects</li>
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