"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, RefreshCw, Copy, Download, Timer, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

interface TimeConfig {
  timeFormat: '12' | '24'
  includeSeconds: boolean
  includeMilliseconds: boolean
  startTime: string
  endTime: string
  count: number
  sortOrder: 'none' | 'asc' | 'desc'
  timezone: string
}

interface GeneratedTime {
  id: string
  time: Date
  formatted12: string
  formatted24: string
  timestamp: number
  period: 'morning' | 'afternoon' | 'evening' | 'night'
  workHours: boolean
}

export default function TimePage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<TimeConfig>({
    timeFormat: '24',
    includeSeconds: true,
    includeMilliseconds: false,
    startTime: '00:00',
    endTime: '23:59',
    count: 10,
    sortOrder: 'none',
    timezone: 'local'
  })
  const [generatedTimes, setGeneratedTimes] = useState<GeneratedTime[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const timezones = [
    { value: 'local', label: 'Local Time' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
  ]

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num))
    return hours * 60 + minutes
  }

  const formatTime = (date: Date, format: '12' | '24', includeSeconds: boolean, includeMs: boolean): string => {
    let options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: format === '12'
    }

    if (includeSeconds) {
      options.second = '2-digit'
    }

    let formatted = date.toLocaleTimeString('en-US', options)

    if (includeMs && includeSeconds) {
      const ms = date.getMilliseconds().toString().padStart(3, '0')
      // 在秒后添加毫秒
      if (format === '12') {
        formatted = formatted.replace(/(\d{2}:\d{2}:\d{2})(\s[AP]M)/, `$1.${ms}$2`)
      } else {
        formatted = formatted.replace(/(\d{2}:\d{2}:\d{2})/, `$1.${ms}`)
      }
    }

    return formatted
  }

  const getTimePeriod = (date: Date): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = date.getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }

  const isWorkHours = (date: Date): boolean => {
    const hour = date.getHours()
    const day = date.getDay()
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17
  }

  const generateTimes = async () => {
    setIsGenerating(true)
    
    try {
      const startMinutes = parseTime(config.startTime)
      const endMinutes = parseTime(config.endTime)
      const times: GeneratedTime[] = []
      
      for (let i = 0; i < config.count; i++) {
        // 生成随机分钟数
        let randomMinutes: number
        if (endMinutes >= startMinutes) {
          randomMinutes = startMinutes + Math.random() * (endMinutes - startMinutes)
        } else {
          // 跨午夜的情况 (如 22:00 到 06:00)
          const range1 = (24 * 60) - startMinutes
          const range2 = endMinutes
          const totalRange = range1 + range2
          const rand = Math.random() * totalRange
          
          if (rand < range1) {
            randomMinutes = startMinutes + rand
          } else {
            randomMinutes = rand - range1
          }
        }
        
        // 创建今天的时间
        const today = new Date()
        const timeDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          Math.floor(randomMinutes / 60),
          Math.floor(randomMinutes % 60),
          config.includeSeconds ? Math.floor(Math.random() * 60) : 0,
          config.includeMilliseconds ? Math.floor(Math.random() * 1000) : 0
        )
        
        const formatted12 = formatTime(timeDate, '12', config.includeSeconds, config.includeMilliseconds)
        const formatted24 = formatTime(timeDate, '24', config.includeSeconds, config.includeMilliseconds)
        
        times.push({
          id: `time_${Date.now()}_${i}`,
          time: timeDate,
          formatted12,
          formatted24,
          timestamp: timeDate.getTime(),
          period: getTimePeriod(timeDate),
          workHours: isWorkHours(timeDate)
        })
        
        // 添加小延迟确保ID唯一
        await new Promise(resolve => setTimeout(resolve, 1))
      }
      
      // 排序
      if (config.sortOrder === 'asc') {
        times.sort((a, b) => a.timestamp - b.timestamp)
      } else if (config.sortOrder === 'desc') {
        times.sort((a, b) => b.timestamp - a.timestamp)
      }
      
      setGeneratedTimes(times)
      
    } catch (error) {
      console.error('Error generating times:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyTimes = () => {
    const format = config.timeFormat === '12' ? 'formatted12' : 'formatted24'
    const content = generatedTimes.map(time => time[format]).join('\n')
    navigator.clipboard.writeText(content)
  }

  const downloadTimes = () => {
    const content = `Random Times
Generated: ${new Date().toLocaleString()}
Format: ${config.timeFormat}-hour${config.includeSeconds ? ' with seconds' : ''}${config.includeMilliseconds ? ' and milliseconds' : ''}
Range: ${config.startTime} - ${config.endTime}
Count: ${generatedTimes.length}
Sort: ${config.sortOrder === 'none' ? 'Random' : config.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
Timezone: ${config.timezone}

12-Hour Format,24-Hour Format,Timestamp,Period,Work Hours
${generatedTimes.map(time => 
  `"${time.formatted12}","${time.formatted24}",${time.timestamp},"${time.period}","${time.workHours ? 'Yes' : 'No'}"`
).join('\n')}`

    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-times-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'business' | 'morning' | 'evening' | 'fullday' | 'night' | 'lunch') => {
    switch (preset) {
      case 'business':
        setConfig(prev => ({ ...prev, startTime: '09:00', endTime: '17:00', count: 20 }))
        break
      case 'morning':
        setConfig(prev => ({ ...prev, startTime: '06:00', endTime: '12:00', count: 15 }))
        break
      case 'evening':
        setConfig(prev => ({ ...prev, startTime: '18:00', endTime: '23:59', count: 12 }))
        break
      case 'fullday':
        setConfig(prev => ({ ...prev, startTime: '00:00', endTime: '23:59', count: 24 }))
        break
      case 'night':
        setConfig(prev => ({ ...prev, startTime: '22:00', endTime: '06:00', count: 10 }))
        break
      case 'lunch':
        setConfig(prev => ({ ...prev, startTime: '11:30', endTime: '14:30', count: 8 }))
        break
    }
  }

  const periodEmojis = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌅',
    night: '🌙'
  }

  const periodColors = {
    morning: 'from-yellow-400 to-orange-400',
    afternoon: 'from-blue-400 to-blue-500',
    evening: 'from-orange-400 to-red-400',
    night: 'from-purple-400 to-indigo-500'
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Random Time Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random times within specified ranges. Perfect for scheduling, testing, and time-based simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Timer className="h-5 w-5" />
                  Time Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure time generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 时间格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Time Format</Label>
                  <Select value={config.timeFormat} onValueChange={(value: '12' | '24') => setConfig(prev => ({ ...prev, timeFormat: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 时间范围 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Start Time</Label>
                    <Input
                      type="time"
                      value={config.startTime}
                      onChange={(e) => setConfig(prev => ({ ...prev, startTime: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">End Time</Label>
                    <Input
                      type="time"
                      value={config.endTime}
                      onChange={(e) => setConfig(prev => ({ ...prev, endTime: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* 精度选项 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeSeconds"
                      checked={config.includeSeconds}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeSeconds: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="includeSeconds" className="text-slate-300">Include Seconds</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeMilliseconds"
                      checked={config.includeMilliseconds}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeMilliseconds: e.target.checked }))}
                      disabled={!config.includeSeconds}
                      className="rounded"
                    />
                    <Label htmlFor="includeMilliseconds" className="text-slate-300">Include Milliseconds</Label>
                  </div>
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

                {/* 排序 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Sort Order</Label>
                  <Select value={config.sortOrder} onValueChange={(value: any) => setConfig(prev => ({ ...prev, sortOrder: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Random Order</SelectItem>
                      <SelectItem value="asc">Ascending (Early to Late)</SelectItem>
                      <SelectItem value="desc">Descending (Late to Early)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 时区 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Timezone</Label>
                  <Select value={config.timezone} onValueChange={(value) => setConfig(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('business')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      💼 Business Hours
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('morning')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌅 Morning
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('evening')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌆 Evening
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('fullday')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🕛 Full Day
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('night')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌙 Night
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('lunch')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🍽️ Lunch Time
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateTimes}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 font-semibold notranslate"
                >
                  translate="no"
                  data-interactive="true"
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Generate Times
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的时间 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedTimes.length > 0 ? (
              <>
                {/* 操作按钮 */}
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {generatedTimes.length} times generated
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={copyTimes}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={downloadTimes}
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

                {/* 时间列表 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Generated Times</CardTitle>
                      <CardDescription className="text-slate-300">
                        {config.timeFormat}-hour format, {config.startTime} - {config.endTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {generatedTimes.map((time, index) => (
                          <motion.div
                            key={time.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className={`bg-gradient-to-r ${periodColors[time.period]} p-4 rounded-lg text-center relative overflow-hidden`}
                          >
                            <div className="relative z-10">
                              <div className="text-white font-mono text-lg font-bold mb-2">
                                {config.timeFormat === '12' ? time.formatted12 : time.formatted24}
                              </div>
                              <div className="text-white/80 text-sm space-y-1">
                                <div className="flex items-center justify-center gap-1">
                                  <span>{periodEmojis[time.period]}</span>
                                  <span>{time.period}</span>
                                </div>
                                {time.workHours && (
                                  <div className="bg-white/20 rounded-full px-2 py-1 text-xs">
                                    Work Hours
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-black/10"></div>
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
                  <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate random times?</p>
                  <p>Set your time range and preferences, then click "Generate Times"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Time Generation Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Time Formats</h4>
                    <p className="text-sm">Choose between 12-hour (AM/PM) or 24-hour format. Optionally include seconds and milliseconds for higher precision.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Time Ranges</h4>
                    <p className="text-sm">Support for cross-midnight ranges (e.g., 22:00-06:00). Times are categorized by period and work hours.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Timezone Support</h4>
                    <p className="text-sm">Generate times in various timezones for global applications and testing scenarios.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Use Cases:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Meeting scheduling</li>
                      <li>Appointment booking</li>
                      <li>Event planning</li>
                      <li>Testing time-based logic</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Shift scheduling</li>
                      <li>Random time selection</li>
                      <li>Performance testing</li>
                      <li>Educational examples</li>
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