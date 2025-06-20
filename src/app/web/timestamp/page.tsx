"use client"

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, Copy, RefreshCw, Calendar, Globe, Timer } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface TimestampResult {
  unix: number
  iso: string
  local: string
  utc: string
  relative: string
}

export default function TimestampPage() {
  const containerRef = useTranslationProtection()
  const [currentTime, setCurrentTime] = useState<TimestampResult | null>(null)
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [customTimestamp, setCustomTimestamp] = useState('')
  const [convertedTime, setConvertedTime] = useState<TimestampResult | null>(null)
  const [results, setResults] = useState<TimestampResult[]>([])
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateTimestamp = (date?: Date): TimestampResult => {
    const targetDate = date || new Date()
    const unix = Math.floor(targetDate.getTime() / 1000)
    
    return {
      unix,
      iso: targetDate.toISOString(),
      local: targetDate.toLocaleString(),
      utc: targetDate.toUTCString(),
      relative: getRelativeTime(targetDate)
    }
  }

  const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(Math.abs(diff) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    const future = diff < 0
    const prefix = future ? 'in ' : ''
    const suffix = future ? '' : ' ago'
    
    if (seconds < 60) return `${prefix}${seconds} seconds${suffix}`
    if (minutes < 60) return `${prefix}${minutes} minutes${suffix}`
    if (hours < 24) return `${prefix}${hours} hours${suffix}`
    return `${prefix}${days} days${suffix}`
  }

  const updateCurrentTime = () => {
    setCurrentTime(generateTimestamp())
  }

  const generateCustomTimestamp = async () => {
    setIsGenerating(true)
    
    try {
      let targetDate: Date
      
      if (customDate || customTime) {
        const dateStr = customDate || new Date().toISOString().split('T')[0]
        const timeStr = customTime || '12:00'
        targetDate = new Date(`${dateStr}T${timeStr}:00`)
      } else {
        targetDate = new Date()
      }
      
      if (isNaN(targetDate.getTime())) {
        throw new Error('Invalid date')
      }
      
      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const result = generateTimestamp(targetDate)
      setResults(prev => [result, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Error generating timestamp:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const convertFromTimestamp = async () => {
    setIsGenerating(true)
    
    try {
      const timestamp = parseInt(customTimestamp)
      if (isNaN(timestamp)) {
        throw new Error('Invalid timestamp')
      }
      
      // Handle both seconds and milliseconds
      const date = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000)
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp')
      }
      
      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200))
      
      setConvertedTime(generateTimestamp(date))
    } catch (error) {
      console.error('Error converting timestamp:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateRandomTimestamp = async (type: 'past' | 'future' | 'thisYear' | 'random') => {
    setIsGenerating(true)
    
    try {
      let targetDate: Date
      const now = new Date()
      
      switch (type) {
        case 'past':
          const pastDays = Math.floor(Math.random() * 365) + 1
          targetDate = new Date(now.getTime() - pastDays * 24 * 60 * 60 * 1000)
          break
        case 'future':
          const futureDays = Math.floor(Math.random() * 365) + 1
          targetDate = new Date(now.getTime() + futureDays * 24 * 60 * 60 * 1000)
          break
        case 'thisYear':
          const startOfYear = new Date(now.getFullYear(), 0, 1)
          const endOfYear = new Date(now.getFullYear(), 11, 31)
          const randomTime = startOfYear.getTime() + Math.random() * (endOfYear.getTime() - startOfYear.getTime())
          targetDate = new Date(randomTime)
          break
        default:
          // Random between 1970 and 2050
          const minTime = new Date('1970-01-01').getTime()
          const maxTime = new Date('2050-12-31').getTime()
          targetDate = new Date(minTime + Math.random() * (maxTime - minTime))
      }
      
      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const result = generateTimestamp(targetDate)
      setResults(prev => [result, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Error generating random timestamp:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const loadPresetDateTime = (preset: 'now' | 'midnight' | 'noon' | 'endOfDay' | 'startOfWeek' | 'endOfWeek') => {
    const now = new Date()
    let targetDate: Date
    
    switch (preset) {
      case 'now':
        targetDate = now
        break
      case 'midnight':
        targetDate = new Date(now)
        targetDate.setHours(0, 0, 0, 0)
        break
      case 'noon':
        targetDate = new Date(now)
        targetDate.setHours(12, 0, 0, 0)
        break
      case 'endOfDay':
        targetDate = new Date(now)
        targetDate.setHours(23, 59, 59, 999)
        break
      case 'startOfWeek':
        targetDate = new Date(now)
        const dayOfWeek = targetDate.getDay()
        targetDate.setDate(targetDate.getDate() - dayOfWeek)
        targetDate.setHours(0, 0, 0, 0)
        break
      case 'endOfWeek':
        targetDate = new Date(now)
        const daysUntilSunday = 6 - targetDate.getDay()
        targetDate.setDate(targetDate.getDate() + daysUntilSunday)
        targetDate.setHours(23, 59, 59, 999)
        break
    }
    
    setCustomDate(targetDate.toISOString().split('T')[0])
    setCustomTime(targetDate.toTimeString().slice(0, 5))
  }

  useEffect(() => {
    updateCurrentTime()
    
    if (autoUpdate) {
      const interval = setInterval(updateCurrentTime, 1000)
      return () => clearInterval(interval)
    }
  }, [autoUpdate])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Timestamp Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate, convert, and manage timestamps. Perfect for development, testing, and date calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：当前时间和控制 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 当前时间 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Timer className="h-5 w-5" />
                    Current Time
                  </CardTitle>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoUpdate}
                      onChange={(e) => setAutoUpdate(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-white text-sm">Auto Update</span>
                  </label>
                </div>
                <CardDescription className="text-slate-300">
                  Live timestamp information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTime && (
                  <div className="space-y-3">
                    <div
                      className="p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg cursor-pointer hover:bg-emerald-500/20 transition-colors"
                      onClick={() => copyToClipboard(currentTime.unix.toString())}
                    >
                      <div className="text-emerald-300 text-sm font-medium">Unix Timestamp</div>
                      <div className="text-white font-mono text-lg">{currentTime.unix}</div>
                    </div>
                    
                    <div
                      className="p-3 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => copyToClipboard(currentTime.iso)}
                    >
                      <div className="text-slate-400 text-sm">ISO 8601</div>
                      <div className="text-white font-mono text-sm break-all">{currentTime.iso}</div>
                    </div>
                    
                    <div
                      className="p-3 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => copyToClipboard(currentTime.local)}
                    >
                      <div className="text-slate-400 text-sm">Local Time</div>
                      <div className="text-white font-mono text-sm">{currentTime.local}</div>
                    </div>
                    
                    <div
                      className="p-3 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => copyToClipboard(currentTime.utc)}
                    >
                      <div className="text-slate-400 text-sm">UTC</div>
                      <div className="text-white font-mono text-sm">{currentTime.utc}</div>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={updateCurrentTime}
                  className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Now
                </Button>
              </CardContent>
            </Card>

            {/* 随机时间戳 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Random Timestamps</CardTitle>
                <CardDescription className="text-slate-300">
                  Generate random timestamps for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => generateRandomTimestamp('past')}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Random Past (1 Year)'
                  )}
                </Button>
                <Button
                  onClick={() => generateRandomTimestamp('future')}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Random Future (1 Year)'
                  )}
                </Button>
                <Button
                  onClick={() => generateRandomTimestamp('thisYear')}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Random This Year'
                  )}
                </Button>
                <Button
                  onClick={() => generateRandomTimestamp('random')}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Random (1970-2050)'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 中间：自定义生成 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 自定义时间戳生成 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5" />
                  Custom Timestamp
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Generate timestamp from specific date/time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Date</Label>
                  <Input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Time</Label>
                  <Input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => loadPresetDateTime('now')}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Now
                    </Button>
                    <Button
                      onClick={() => loadPresetDateTime('midnight')}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Midnight
                    </Button>
                    <Button
                      onClick={() => loadPresetDateTime('noon')}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Noon
                    </Button>
                    <Button
                      onClick={() => loadPresetDateTime('endOfDay')}
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      End of Day
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateCustomTimestamp}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 notranslate"
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
                      <Clock className="h-4 w-4 mr-2" />
                      Generate Timestamp
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 时间戳转换 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  Convert Timestamp
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Convert Unix timestamp to human readable
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Unix Timestamp</Label>
                  <Input
                    type="number"
                    value={customTimestamp}
                    onChange={(e) => setCustomTimestamp(e.target.value)}
                    placeholder="1640995200 or 1640995200000"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">
                    Supports both seconds and milliseconds
                  </p>
                </div>

                <Button
                  onClick={convertFromTimestamp}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Convert
                    </>
                  )}
                </Button>

                {convertedTime && (
                  <div className="mt-4 space-y-2">
                    <div className="p-3 bg-teal-500/10 border border-teal-400/30 rounded-lg">
                      <div className="text-teal-300 text-sm font-medium">Converted Time</div>
                      <div className="text-white text-sm">{convertedTime.local}</div>
                      <div className="text-slate-400 text-xs mt-1">{convertedTime.relative}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成历史 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Generated Timestamps</CardTitle>
                <CardDescription className="text-slate-300">
                  {results.length > 0 ? `${results.length} timestamps generated` : 'No timestamps generated yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-400 font-mono font-bold">
                            {result.unix}
                          </span>
                          <Button
                            onClick={() => copyToClipboard(result.unix.toString())}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-white text-sm">{result.local}</div>
                        <div className="text-slate-400 text-xs">{result.relative}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generate timestamps to see them here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Timestamp Formats</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Unix Timestamp</h4>
                    <p className="text-sm">Seconds since January 1, 1970 UTC. Standard for databases and APIs.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">ISO 8601</h4>
                    <p className="text-sm">International standard for date/time representation.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Local Time</h4>
                    <p className="text-sm">Time in your local timezone for human readability.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">UTC</h4>
                    <p className="text-sm">Coordinated Universal Time, standard for global applications.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Use Cases:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Database timestamp fields</li>
                    <li>API development and testing</li>
                    <li>Log analysis and debugging</li>
                    <li>Scheduling and automation</li>
                    <li>Data migration tasks</li>
                    <li>Performance benchmarking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}