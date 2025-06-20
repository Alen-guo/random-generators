"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Hash, RefreshCw, Copy, Download, BarChart3, Settings, Info } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface NumberResult {
  value: number
  timestamp: Date
}

export default function IntegerGeneratorPage() {
  const containerRef = useTranslationProtection()
  const [min, setMin] = useState(-1000)
  const [max, setMax] = useState(1000)
  const [count, setCount] = useState(10)
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [results, setResults] = useState<NumberResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNumbers = async () => {
    if (min > max) {
      alert('Minimum value cannot be greater than maximum value')
      return
    }

    if (!allowDuplicates && (max - min + 1) < count) {
      alert('Cannot generate unique numbers: range is smaller than count')
      return
    }

    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newResults: NumberResult[] = []
    const usedNumbers = new Set<number>()
    
    for (let i = 0; i < count; i++) {
      let number: number
      let attempts = 0
      
      do {
        number = Math.floor(Math.random() * (max - min + 1)) + min
        attempts++
        
        // Prevent infinite loop
        if (attempts > 10000) {
          alert('Unable to generate unique numbers')
          setIsGenerating(false)
          return
        }
      } while (!allowDuplicates && usedNumbers.has(number))
      
      if (!allowDuplicates) {
        usedNumbers.add(number)
      }
      
      newResults.push({
        value: number,
        timestamp: new Date()
      })
    }
    
    setResults(newResults)
    setIsGenerating(false)
  }

  const getStatistics = () => {
    if (results.length === 0) return null
    
    const values = results.map(r => r.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const average = sum / values.length
    const sortedValues = [...values].sort((a, b) => a - b)
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)]
    
    return {
      sum,
      average: Math.round(average * 100) / 100,
      median,
      min: Math.min(...values),
      max: Math.max(...values),
      range: Math.max(...values) - Math.min(...values)
    }
  }

  const copyResults = (format: 'list' | 'csv' | 'json') => {
    const values = results.map(r => r.value)
    let text = ''
    
    switch (format) {
      case 'list':
        text = values.join(', ')
        break
      case 'csv':
        text = values.join('\n')
        break
      case 'json':
        text = JSON.stringify(values, null, 2)
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const values = results.map(r => r.value)
    const blob = new Blob([values.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'random-integers.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const statistics = getStatistics()

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Hash className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Random Integer Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random integers within any range. Perfect for statistical sampling, testing, and mathematical applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  Number Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your number generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Minimum Value</Label>
                    <Input
                      type="number"
                      value={min}
                      onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Maximum Value</Label>
                    <Input
                      type="number"
                      value={max}
                      onChange={(e) => setMax(parseInt(e.target.value) || 100)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Count</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10000}
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(10000, parseInt(e.target.value) || 10)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 10,000 numbers</p>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span className="text-white">Allow duplicate numbers</span>
                </label>

                <Button 
                  onClick={generateNumbers}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Hash className="h-5 w-5 mr-2" />
                      Generate Numbers
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 快速设置 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => { setMin(1); setMax(10); setCount(5) }}
                >
                  1-10 (5 numbers)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => { setMin(1); setMax(100); setCount(10) }}
                >
                  1-100 (10 numbers)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => { setMin(-50); setMax(50); setCount(20) }}
                >
                  -50 to 50 (20 numbers)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => { setMin(1); setMax(1000); setCount(100) }}
                >
                  1-1000 (100 numbers)
                </Button>
              </CardContent>
            </Card>

            {/* 统计信息 */}
            {statistics && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Sum</div>
                      <div className="text-white font-mono">{statistics.sum}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Average</div>
                      <div className="text-white font-mono">{statistics.average}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Median</div>
                      <div className="text-white font-mono">{statistics.median}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Range</div>
                      <div className="text-white font-mono">{statistics.range}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Min</div>
                      <div className="text-white font-mono">{statistics.min}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Max</div>
                      <div className="text-white font-mono">{statistics.max}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：结果显示 */}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 && (
              <>
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Generated Numbers</CardTitle>
                        <CardDescription className="text-slate-300">
                          {results.length} random integers from {min} to {max}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResults('list')}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadResults}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-96 overflow-y-auto" data-result="true">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg text-center font-mono text-white backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => navigator.clipboard.writeText(result.value.toString())}
                        >
                          {result.value}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 导出选项 */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Export Options</CardTitle>
                    <CardDescription className="text-slate-300">
                      Copy numbers in different formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => copyResults('list')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy as List
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('csv')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy as CSV
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('json')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy as JSON
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="h-5 w-5" />
                  Applications & Use Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Random integer generation has numerous applications across various fields. Our generator uses 
                  cryptographically secure randomness to ensure unbiased results for all your needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Statistical Applications:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Random sampling for surveys</li>
                      <li>Monte Carlo simulations</li>
                      <li>Statistical testing and analysis</li>
                      <li>Research data generation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Programming & Testing:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Test data generation</li>
                      <li>Algorithm testing</li>
                      <li>Database seeding</li>
                      <li>Performance benchmarking</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Gaming & Entertainment:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Game mechanics and scoring</li>
                      <li>Lottery number selection</li>
                      <li>Random event generation</li>
                      <li>Prize drawings and contests</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Educational Use:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Mathematics problem sets</li>
                      <li>Statistics exercises</li>
                      <li>Probability demonstrations</li>
                      <li>Random assignment tools</li>
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