"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Shuffle, Copy, RefreshCw } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

export default function DatesPage() {
  const containerRef = useTranslationProtection()
  const [count, setCount] = useState(10)
  const [startDate, setStartDate] = useState('2020-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [format, setFormat] = useState('YYYY-MM-DD')
  const [dates, setDates] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const formatDate = (date: Date, format: string) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    switch (format) {
      case 'YYYY-MM-DD': return `${year}-${month}-${day}`
      case 'MM/DD/YYYY': return `${month}/${day}/${year}`
      case 'DD/MM/YYYY': return `${day}/${month}/${year}`
      case 'YYYY/MM/DD': return `${year}/${month}/${day}`
      case 'Month DD, YYYY': 
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December']
        return `${months[date.getMonth()]} ${day}, ${year}`
      default: return `${year}-${month}-${day}`
    }
  }

  const generateDates = async () => {
    setIsGenerating(true)
    
    // 添加延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    
    const newDates = Array.from({length: count}, () => {
      const randomTime = start.getTime() + Math.random() * timeDiff
      const randomDate = new Date(randomTime)
      return formatDate(randomDate, format)
    })
    
    setDates(newDates.sort())
    setIsGenerating(false)
  }

  const copyDates = () => {
    navigator.clipboard.writeText(dates.join('\n'))
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Date Generator</h1>
          <p className="text-xl text-orange-200 max-w-2xl mx-auto">
            Generate random dates within specified ranges for testing and development.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-400" />
                Date Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count" className="text-white">Count</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-white">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-white">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                      <SelectItem value="Month DD, YYYY">Month DD, YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={generateDates} 
                disabled={isGenerating}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white notranslate"
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
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate Dates
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {dates.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Generated Dates</CardTitle>
                  <Button
                    onClick={copyDates}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" data-result="true">
                  {dates.map((date, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-3 text-center text-white font-mono">
                      {date}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 