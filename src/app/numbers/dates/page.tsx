"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, RefreshCw, Copy, Download, Clock, CalendarDays } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface DateConfig {
  startDate: string
  endDate: string
  format: string
  includeTime: boolean
  timezone: string
  count: number
}

interface GeneratedDate {
  date: Date
  formatted: string
  timestamp: number
  dayOfWeek: string
  relative: string
  id: string
}

export default function DatesPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<DateConfig>({
    startDate: '2020-01-01',
    endDate: new Date().toISOString().split('T')[0],
    format: 'YYYY-MM-DD',
    includeTime: false,
    timezone: 'local',
    count: 10
  })
  const [generatedDates, setGeneratedDates] = useState<GeneratedDate[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const dateFormats = [
    { key: 'YYYY-MM-DD', label: 'ISO Date (2024-01-15)', example: '2024-01-15' },
    { key: 'MM/DD/YYYY', label: 'US Format (01/15/2024)', example: '01/15/2024' },
    { key: 'DD/MM/YYYY', label: 'EU Format (15/01/2024)', example: '15/01/2024' },
    { key: 'DD-MM-YYYY', label: 'Dash Format (15-01-2024)', example: '15-01-2024' },
    { key: 'Month DD, YYYY', label: 'Long Format (January 15, 2024)', example: 'January 15, 2024' },
    { key: 'DD Month YYYY', label: 'Day First (15 January 2024)', example: '15 January 2024' },
    { key: 'YYYY/MM/DD', label: 'Slash ISO (2024/01/15)', example: '2024/01/15' },
    { key: 'Weekday, Month DD, YYYY', label: 'Full Format (Monday, January 15, 2024)', example: 'Monday, January 15, 2024' }
  ]

  const dateRangePresets = [
    { 
      key: 'thisYear', 
      label: 'This Year', 
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date(new Date().getFullYear(), 11, 31)
    },
    { 
      key: 'lastYear', 
      label: 'Last Year', 
      start: new Date(new Date().getFullYear() - 1, 0, 1),
      end: new Date(new Date().getFullYear() - 1, 11, 31)
    },
    { 
      key: 'pastYear', 
      label: 'Past Year', 
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    { 
      key: 'nextYear', 
      label: 'Next Year', 
      start: new Date(),
      end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    { 
      key: 'thisMonth', 
      label: 'This Month', 
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    { 
      key: 'decade', 
      label: 'Past Decade', 
      start: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  ]

  const formatDate = (date: Date, format: string, includeTime: boolean): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const weekdayNames = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ]

    const timeString = includeTime 
      ? ` ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
      : ''

    switch (format) {
      case 'YYYY-MM-DD':
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}${timeString}`
      case 'MM/DD/YYYY':
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}${timeString}`
      case 'DD/MM/YYYY':
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}${timeString}`
      case 'DD-MM-YYYY':
        return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}${timeString}`
      case 'Month DD, YYYY':
        return `${monthNames[month - 1]} ${day}, ${year}${timeString}`
      case 'DD Month YYYY':
        return `${day} ${monthNames[month - 1]} ${year}${timeString}`
      case 'YYYY/MM/DD':
        return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}${timeString}`
      case 'Weekday, Month DD, YYYY':
        return `${weekdayNames[date.getDay()]}, ${monthNames[month - 1]} ${day}, ${year}${timeString}`
      default:
        return date.toISOString().split('T')[0] + timeString
    }
  }

  const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 0) return `In ${diffDays} days`
    return `${Math.abs(diffDays)} days ago`
  }

  const generateRandomDate = (start: Date, end: Date): Date => {
    const startTime = start.getTime()
    const endTime = end.getTime()
    const randomTime = startTime + Math.random() * (endTime - startTime)
    
    const randomDate = new Date(randomTime)
    
    if (config.includeTime) {
      randomDate.setHours(Math.floor(Math.random() * 24))
      randomDate.setMinutes(Math.floor(Math.random() * 60))
      randomDate.setSeconds(Math.floor(Math.random() * 60))
    } else {
      randomDate.setHours(0, 0, 0, 0)
    }
    
    return randomDate
  }

  const generateDates = async () => {
    setIsGenerating(true)
    
    try {
      const startDate = new Date(config.startDate + 'T00:00:00')
      const endDate = new Date(config.endDate + 'T23:59:59')
      
      if (startDate >= endDate) {
        alert('Start date must be before end date')
        setIsGenerating(false)
        return
      }
      
      const dates: GeneratedDate[] = []
      
      for (let i = 0; i < config.count; i++) {
        const randomDate = generateRandomDate(startDate, endDate)
        
        const generatedDate: GeneratedDate = {
          date: randomDate,
          formatted: formatDate(randomDate, config.format, config.includeTime),
          timestamp: randomDate.getTime(),
          dayOfWeek: randomDate.toLocaleDateString('en-US', { weekday: 'long' }),
          relative: getRelativeTime(randomDate),
          id: `date_${Date.now()}_${i}`
        }
        
        dates.push(generatedDate)
        
        // Add delay for animation
        if (i % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 150))
        }
      }
      
      // Sort dates chronologically
      dates.sort((a, b) => a.timestamp - b.timestamp)
      setGeneratedDates(dates)
    } catch (error) {
      console.error('Error generating dates:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const setPresetRange = (preset: typeof dateRangePresets[0]) => {
    setConfig(prev => ({
      ...prev,
      startDate: preset.start.toISOString().split('T')[0],
      endDate: preset.end.toISOString().split('T')[0]
    }))
  }

  const copyDate = (formatted: string) => {
    navigator.clipboard.writeText(formatted)
  }

  const copyAllDates = () => {
    const allDates = generatedDates.map(d => d.formatted).join('\n')
    navigator.clipboard.writeText(allDates)
  }

  const downloadDates = () => {
    const content = generatedDates.map(d => 
      `${d.formatted}\t${d.dayOfWeek}\t${d.relative}\t${d.timestamp}`
    ).join('\n')
    
    const header = 'Formatted Date\tDay of Week\tRelative Time\tTimestamp\n'
    const blob = new Blob([header + content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-dates-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const getDateStats = () => {
    if (generatedDates.length === 0) return null
    
    const timestamps = generatedDates.map(d => d.timestamp)
    const earliest = new Date(Math.min(...timestamps))
    const latest = new Date(Math.max(...timestamps))
    const range = latest.getTime() - earliest.getTime()
    const rangeDays = Math.ceil(range / (1000 * 60 * 60 * 24))
    
    return { earliest, latest, rangeDays }
  }

  const stats = getDateStats()

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Date Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random dates within specified ranges. Perfect for testing, data creation, and scheduling applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：日期配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CalendarDays className="h-5 w-5" />
                  Date Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your date generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 日期范围 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Start Date</Label>
                    <Input
                      type="date"
                      value={config.startDate}
                      onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">End Date</Label>
                    <Input
                      type="date"
                      value={config.endDate}
                      onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* 预设范围 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Ranges</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dateRangePresets.map(preset => (
                      <Button
                        key={preset.key}
                        variant="outline"
                        size="sm"
                        onClick={() => setPresetRange(preset)}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 日期格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Date Format</Label>
                  <select
                    value={config.format}
                    onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    {dateFormats.map(format => (
                      <option key={format.key} value={format.key} className="bg-slate-800">
                        {format.label}
                      </option>
                    ))}
                  </select>
                  <div className="text-slate-400 text-xs">
                    Example: {dateFormats.find(f => f.key === config.format)?.example}
                  </div>
                </div>

                {/* 时间选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Options</Label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={config.includeTime}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeTime: e.target.checked }))}
                      className="rounded"
                    />
                    <Clock className="h-3 w-3" />
                    <span className="text-sm">Include random time</span>
                  </label>
                </div>

                {/* 生成数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Dates</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      count: Math.max(1, Math.min(100, parseInt(e.target.value) || 10))
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <Button
                  onClick={generateDates}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-semibold notranslate"
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
                      <Calendar className="h-4 w-4 mr-2" />
                      Generate Dates
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的日期 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated Dates</CardTitle>
                    <CardDescription className="text-slate-300">
                      {generatedDates.length > 0 ? `${generatedDates.length} dates generated` : 'No dates generated yet'}
                    </CardDescription>
                  </div>
                  {generatedDates.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllDates}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy All
                      </Button>
                      <Button
                        onClick={downloadDates}
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
                {generatedDates.length > 0 ? (
                  <div className="space-y-4">
                    {/* 统计信息 */}
                    {stats && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-slate-400 text-sm">Earliest Date</div>
                          <div className="text-white font-bold text-sm">
                            {stats.earliest.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-slate-400 text-sm">Latest Date</div>
                          <div className="text-white font-bold text-sm">
                            {stats.latest.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-slate-400 text-sm">Date Range</div>
                          <div className="text-white font-bold text-sm">
                            {stats.rangeDays} days
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 日期列表 */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {generatedDates.map((dateItem, index) => (
                        <div
                          key={dateItem.id}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="text-white font-mono text-sm mb-1">
                              {dateItem.formatted}
                            </div>
                            <div className="flex items-center gap-4 text-slate-400 text-xs">
                              <span>{dateItem.dayOfWeek}</span>
                              <span>{dateItem.relative}</span>
                              <span>#{index + 1}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => copyDate(dateItem.formatted)}
                            size="sm"
                            variant="ghost"
                            className="text-slate-400 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate dates?</p>
                    <p>Set your date range and click "Generate Dates"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Date Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Date Ranges</h4>
                    <p className="text-sm">Set custom start and end dates or use quick presets for common ranges.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Format Options</h4>
                    <p className="text-sm">Choose from various date formats including ISO, US, European, and verbose formats.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Time Inclusion</h4>
                    <p className="text-sm">Optionally include random times for more precise date-time generation.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Test data creation</li>
                      <li>Event scheduling</li>
                      <li>Database seeding</li>
                      <li>Date range testing</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Calendar applications</li>
                      <li>Booking systems</li>
                      <li>Historical data</li>
                      <li>Timeline generation</li>
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