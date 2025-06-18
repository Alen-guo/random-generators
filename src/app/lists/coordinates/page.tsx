"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, RefreshCw, Copy, Download, Globe, Navigation2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface CoordinateConfig {
  type: 'global' | 'country' | 'region' | 'custom'
  format: 'decimal' | 'dms' | 'both'
  precision: number
  count: number
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
  country: string
  landOnly: boolean
  includeAltitude: boolean
  altitudeRange: [number, number]
}

interface GeneratedCoordinate {
  id: string
  latitude: number
  longitude: number
  altitude?: number
  decimal: string
  dms: string
  location?: string
  country?: string
  timezone?: string
  distance?: number
}

export default function CoordinatesPage() {
  const [config, setConfig] = useState<CoordinateConfig>({
    type: 'global',
    format: 'decimal',
    precision: 6,
    count: 10,
    minLat: -90,
    maxLat: 90,
    minLng: -180,
    maxLng: 180,
    country: 'us',
    landOnly: false,
    includeAltitude: false,
    altitudeRange: [0, 1000]
  })
  const [generatedCoordinates, setGeneratedCoordinates] = useState<GeneratedCoordinate[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const countries = [
    { value: 'us', label: 'United States', bounds: [24.396308, -125.000000, 49.384358, -66.93457] },
    { value: 'china', label: 'China', bounds: [18.197700, 73.406586, 53.560370, 134.773911] },
    { value: 'canada', label: 'Canada', bounds: [41.675105, -141.00187, 83.23324, -52.233040] },
    { value: 'uk', label: 'United Kingdom', bounds: [49.82380, -13.69460, 60.91464, 1.76834] },
    { value: 'australia', label: 'Australia', bounds: [-43.64397, 113.33837, -10.66821, 153.56924] },
    { value: 'brazil', label: 'Brazil', bounds: [-33.75118, -73.98283, 5.24448, -32.37531] },
    { value: 'india', label: 'India', bounds: [8.088219, 68.176645, 35.493891, 97.415292] },
    { value: 'russia', label: 'Russia', bounds: [41.151416, 19.66064, 81.857361, 179.99999] },
    { value: 'japan', label: 'Japan', bounds: [24.045416, 129.408463, 45.551483, 145.543137] },
    { value: 'germany', label: 'Germany', bounds: [47.270114, 5.866315, 55.0583, 15.041896] }
  ]

  const regions = [
    { value: 'north_america', label: 'North America', bounds: [14.53849, -168.22, 83.162102, -52.233] },
    { value: 'europe', label: 'Europe', bounds: [34.804593, -31.25, 71.185474, 69.037] },
    { value: 'asia', label: 'Asia', bounds: [0.8493, 26.04, 77.8423, 179.99] },
    { value: 'africa', label: 'Africa', bounds: [-34.819166, -25.36, 37.540725, 63.5] },
    { value: 'south_america', label: 'South America', bounds: [-55.98, -92.23, 12.46, -28.22] },
    { value: 'oceania', label: 'Oceania', bounds: [-47.75, 112.92, -8.51, 179.97] }
  ]

  const convertToDMS = (decimal: number, isLatitude: boolean): string => {
    const abs = Math.abs(decimal)
    const degrees = Math.floor(abs)
    const minutes = Math.floor((abs - degrees) * 60)
    const seconds = ((abs - degrees) * 60 - minutes) * 60
    
    const direction = isLatitude 
      ? (decimal >= 0 ? 'N' : 'S')
      : (decimal >= 0 ? 'E' : 'W')
    
    return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getTimezone = (latitude: number, longitude: number): string => {
    // 简化的时区计算（基于经度）
    const offset = Math.round(longitude / 15)
    const sign = offset >= 0 ? '+' : ''
    return `UTC${sign}${offset}`
  }

  const generateCoordinates = async () => {
    setIsGenerating(true)
    
    try {
      const coordinates: GeneratedCoordinate[] = []
      let bounds = [config.minLat, config.minLng, config.maxLat, config.maxLng]
      
      // 根据选择的区域设置边界
      if (config.type === 'country') {
        const country = countries.find(c => c.value === config.country)
        if (country) {
          bounds = country.bounds
        }
      } else if (config.type === 'region') {
        const region = regions.find(r => r.value === config.country)
        if (region) {
          bounds = region.bounds
        }
      }
      
      const [minLat, minLng, maxLat, maxLng] = bounds
      let attempts = 0
      const maxAttempts = config.count * 10
      
      while (coordinates.length < config.count && attempts < maxAttempts) {
        attempts++
        
        let latitude = minLat + Math.random() * (maxLat - minLat)
        let longitude = minLng + Math.random() * (maxLng - minLng)
        
        // 陆地限制（简化版本）
        if (config.landOnly) {
          // 这里应该使用真实的地理数据库，暂时用简化逻辑
          const isOcean = (
            (latitude > -60 && latitude < 60 && Math.abs(longitude) > 170) || // 太平洋
            (latitude > 0 && latitude < 70 && longitude > -60 && longitude < 20) || // 大西洋
            (latitude > -40 && latitude < 30 && longitude > 20 && longitude < 120) // 印度洋
          )
          if (isOcean && Math.random() > 0.3) continue // 70%概率跳过海洋
        }
        
        // 精度调整
        latitude = Number(latitude.toFixed(config.precision))
        longitude = Number(longitude.toFixed(config.precision))
        
        // 海拔
        let altitude: number | undefined
        if (config.includeAltitude) {
          altitude = Math.round(
            config.altitudeRange[0] + 
            Math.random() * (config.altitudeRange[1] - config.altitudeRange[0])
          )
        }
        
        const decimal = `${latitude}, ${longitude}`
        const dms = `${convertToDMS(latitude, true)}, ${convertToDMS(longitude, false)}`
        
        // 计算与第一个点的距离
        let distance: number | undefined
        if (coordinates.length > 0) {
          distance = calculateDistance(
            coordinates[0].latitude, 
            coordinates[0].longitude, 
            latitude, 
            longitude
          )
        }
        
        coordinates.push({
          id: `coord_${Date.now()}_${coordinates.length}`,
          latitude,
          longitude,
          altitude,
          decimal,
          dms,
          timezone: getTimezone(latitude, longitude),
          distance: distance ? Number(distance.toFixed(2)) : undefined
        })
        
        await new Promise(resolve => setTimeout(resolve, 1))
      }
      
      setGeneratedCoordinates(coordinates)
      
    } catch (error) {
      console.error('Error generating coordinates:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyCoordinates = () => {
    const format = config.format === 'decimal' ? 'decimal' : config.format === 'dms' ? 'dms' : 'both'
    let content: string
    
    if (format === 'both') {
      content = generatedCoordinates.map(coord => `${coord.decimal} | ${coord.dms}`).join('\n')
    } else {
      content = generatedCoordinates.map(coord => coord[format as keyof GeneratedCoordinate]).join('\n')
    }
    
    navigator.clipboard.writeText(content)
  }

  const downloadCoordinates = () => {
    const content = `Random Geographic Coordinates
Generated: ${new Date().toLocaleString()}
Type: ${config.type}
Format: ${config.format}
Precision: ${config.precision} decimal places
Count: ${generatedCoordinates.length}
Land Only: ${config.landOnly}
Include Altitude: ${config.includeAltitude}

Latitude,Longitude,Decimal Format,DMS Format${config.includeAltitude ? ',Altitude (m)' : ''}${config.includeAltitude ? ',Timezone' : ''},Distance from First (km)
${generatedCoordinates.map(coord => 
  `${coord.latitude},${coord.longitude},"${coord.decimal}","${coord.dms}"${coord.altitude !== undefined ? `,${coord.altitude}` : ''}${coord.timezone ? `,${coord.timezone}` : ''}${coord.distance !== undefined ? `,${coord.distance}` : ''}`
).join('\n')}`

    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-coordinates-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'global' | 'usa' | 'europe' | 'asia' | 'custom_region') => {
    switch (preset) {
      case 'global':
        setConfig(prev => ({ 
          ...prev, 
          type: 'global',
          minLat: -90, maxLat: 90, 
          minLng: -180, maxLng: 180,
          count: 20,
          landOnly: false
        }))
        break
      case 'usa':
        setConfig(prev => ({ 
          ...prev, 
          type: 'country',
          country: 'us',
          count: 15,
          landOnly: true
        }))
        break
      case 'europe':
        setConfig(prev => ({ 
          ...prev, 
          type: 'region',
          country: 'europe',
          count: 12,
          landOnly: true
        }))
        break
      case 'asia':
        setConfig(prev => ({ 
          ...prev, 
          type: 'region',
          country: 'asia',
          count: 18,
          landOnly: true
        }))
        break
      case 'custom_region':
        setConfig(prev => ({ 
          ...prev, 
          type: 'custom',
          minLat: 30, maxLat: 50,
          minLng: -10, maxLng: 40,
          count: 10,
          landOnly: true
        }))
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Random Coordinates Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random geographic coordinates worldwide or within specific regions. Perfect for mapping, testing, and location-based applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  Location Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure coordinate generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 生成类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Generation Type</Label>
                  <Select value={config.type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global (Worldwide)</SelectItem>
                      <SelectItem value="region">By Region</SelectItem>
                      <SelectItem value="country">By Country</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 区域/国家选择 */}
                {(config.type === 'country' || config.type === 'region') && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      {config.type === 'country' ? 'Country' : 'Region'}
                    </Label>
                    <Select value={config.country} onValueChange={(value) => setConfig(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(config.type === 'country' ? countries : regions).map(item => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 自定义范围 */}
                {config.type === 'custom' && (
                  <div className="space-y-3">
                    <Label className="text-slate-300">Custom Bounds</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-slate-400">Min Latitude</Label>
                        <Input
                          type="number"
                          value={config.minLat}
                          onChange={(e) => setConfig(prev => ({ ...prev, minLat: Math.max(-90, Math.min(90, parseFloat(e.target.value) || -90)) }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                          min="-90"
                          max="90"
                          step="any"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Max Latitude</Label>
                        <Input
                          type="number"
                          value={config.maxLat}
                          onChange={(e) => setConfig(prev => ({ ...prev, maxLat: Math.max(-90, Math.min(90, parseFloat(e.target.value) || 90)) }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                          min="-90"
                          max="90"
                          step="any"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Min Longitude</Label>
                        <Input
                          type="number"
                          value={config.minLng}
                          onChange={(e) => setConfig(prev => ({ ...prev, minLng: Math.max(-180, Math.min(180, parseFloat(e.target.value) || -180)) }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                          min="-180"
                          max="180"
                          step="any"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Max Longitude</Label>
                        <Input
                          type="number"
                          value={config.maxLng}
                          onChange={(e) => setConfig(prev => ({ ...prev, maxLng: Math.max(-180, Math.min(180, parseFloat(e.target.value) || 180)) }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                          min="-180"
                          max="180"
                          step="any"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Format</Label>
                  <Select value={config.format} onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decimal">Decimal Degrees</SelectItem>
                      <SelectItem value="dms">Degrees Minutes Seconds</SelectItem>
                      <SelectItem value="both">Both Formats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 精度 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Decimal Precision</Label>
                  <Input
                    type="number"
                    value={config.precision}
                    onChange={(e) => setConfig(prev => ({ ...prev, precision: Math.max(1, Math.min(10, parseInt(e.target.value) || 6)) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-slate-400">Higher precision = more accurate location</p>
                </div>

                {/* 数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Count</Label>
                  <Input
                    type="number"
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ ...prev, count: Math.max(1, Math.min(100, parseInt(e.target.value) || 10)) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="1"
                    max="100"
                  />
                </div>

                {/* 选项 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="landOnly"
                      checked={config.landOnly}
                      onChange={(e) => setConfig(prev => ({ ...prev, landOnly: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="landOnly" className="text-slate-300">Land Areas Only</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeAltitude"
                      checked={config.includeAltitude}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeAltitude: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="includeAltitude" className="text-slate-300">Include Altitude</Label>
                  </div>
                  
                  {config.includeAltitude && (
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      <div>
                        <Label className="text-xs text-slate-400">Min (m)</Label>
                        <Input
                          type="number"
                          value={config.altitudeRange[0]}
                          onChange={(e) => setConfig(prev => ({ 
                            ...prev, 
                            altitudeRange: [parseInt(e.target.value) || 0, prev.altitudeRange[1]]
                          }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Max (m)</Label>
                        <Input
                          type="number"
                          value={config.altitudeRange[1]}
                          onChange={(e) => setConfig(prev => ({ 
                            ...prev, 
                            altitudeRange: [prev.altitudeRange[0], parseInt(e.target.value) || 1000]
                          }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('global')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌍 Global
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('usa')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🇺🇸 USA
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('europe')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🇪🇺 Europe
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('asia')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌏 Asia
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateCoordinates}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Generate Coordinates
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的坐标 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedCoordinates.length > 0 ? (
              <>
                {/* 操作按钮 */}
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {generatedCoordinates.length} coordinates generated
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={copyCoordinates}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={downloadCoordinates}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download CSV
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 坐标列表 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Generated Coordinates</CardTitle>
                      <CardDescription className="text-slate-300">
                        {config.format} format, {config.precision} decimal places
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {generatedCoordinates.map((coord, index) => (
                          <motion.div
                            key={coord.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="bg-slate-800 border border-white/20 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-green-400" />
                                  <span className="text-white font-medium">#{index + 1}</span>
                                  {coord.distance && (
                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                      {coord.distance} km from #1
                                    </span>
                                  )}
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-white font-mono text-sm">
                                    📍 {coord.decimal}
                                  </div>
                                  {(config.format === 'dms' || config.format === 'both') && (
                                    <div className="text-slate-300 font-mono text-sm">
                                      🧭 {coord.dms}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-4 text-xs text-slate-400">
                                    {coord.altitude !== undefined && (
                                      <span>⛰️ {coord.altitude}m</span>
                                    )}
                                    {coord.timezone && (
                                      <span>🕐 {coord.timezone}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(coord.decimal)}
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate coordinates?</p>
                  <p>Choose your location type and preferences, then click "Generate Coordinates"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Coordinate Generation Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Coordinate Formats</h4>
                    <p className="text-sm">Decimal degrees (41.40338, 2.17403) or Degrees Minutes Seconds (41°24'12.17"N, 2°10'26.51"E). Choose based on your application needs.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Geographic Filtering</h4>
                    <p className="text-sm">Generate coordinates globally, by continent, country, or custom bounds. Land-only option filters out ocean coordinates.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Additional Data</h4>
                    <p className="text-sm">Optional altitude, timezone information, and distance calculations from the first generated point.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Applications:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Map testing</li>
                      <li>Location services</li>
                      <li>GIS applications</li>
                      <li>Geographic simulations</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Travel planning</li>
                      <li>Research sampling</li>
                      <li>Game development</li>
                      <li>Educational demos</li>
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