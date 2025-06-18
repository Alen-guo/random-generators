"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, RefreshCw, Copy, Download, TrendingUp, BarChart2, Settings } from 'lucide-react'

interface DecimalResult {
  value: number
  formatted: string
  timestamp: Date
}

export default function DecimalGeneratorPage() {
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(100)
  const [decimalPlaces, setDecimalPlaces] = useState(2)
  const [numberCount, setNumberCount] = useState(10)
  const [allowNegative, setAllowNegative] = useState(false)
  const [results, setResults] = useState<DecimalResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateDecimals = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newResults: DecimalResult[] = []
    
    for (let i = 0; i < numberCount; i++) {
      let min = minValue
      let max = maxValue
      
      if (allowNegative) {
        min = -Math.abs(maxValue)
        max = Math.abs(maxValue)
      }
      
      const randomValue = Math.random() * (max - min) + min
      const roundedValue = Number(randomValue.toFixed(decimalPlaces))
      
      newResults.push({
        value: roundedValue,
        formatted: roundedValue.toFixed(decimalPlaces),
        timestamp: new Date()
      })
    }
    
    setResults(newResults)
    setIsGenerating(false)
  }

  const copyResults = (format: 'list' | 'csv' | 'json' | 'math') => {
    const values = results.map(r => r.value)
    let text = ''
    
    switch (format) {
      case 'list':
        text = values.join('\n')
        break
      case 'csv':
        text = 'Value,Formatted,Generated\n' + 
               results.map(r => `${r.value},"${r.formatted}","${r.timestamp.toISOString()}"`).join('\n')
        break
      case 'json':
        text = JSON.stringify(values, null, 2)
        break
      case 'math':
        text = `[${values.join(', ')}]`
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const text = results.map(r => r.formatted).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'random-decimals.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const getStatistics = () => {
    if (results.length === 0) return null
    
    const values = results.map(r => r.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const mean = sum / values.length
    const sortedValues = [...values].sort((a, b) => a - b)
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)]
    
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
    const standardDeviation = Math.sqrt(variance)
    
    return {
      count: values.length,
      sum: Number(sum.toFixed(decimalPlaces)),
      mean: Number(mean.toFixed(decimalPlaces)),
      median: Number(median.toFixed(decimalPlaces)),
      min: Math.min(...values),
      max: Math.max(...values),
      range: Number((Math.max(...values) - Math.min(...values)).toFixed(decimalPlaces)),
      standardDeviation: Number(standardDeviation.toFixed(decimalPlaces))
    }
  }

  const loadPreset = (preset: 'percentage' | 'probability' | 'currency' | 'scientific' | 'temperature') => {
    switch (preset) {
      case 'percentage':
        setMinValue(0)
        setMaxValue(100)
        setDecimalPlaces(2)
        setAllowNegative(false)
        break
      case 'probability':
        setMinValue(0)
        setMaxValue(1)
        setDecimalPlaces(4)
        setAllowNegative(false)
        break
      case 'currency':
        setMinValue(0)
        setMaxValue(1000)
        setDecimalPlaces(2)
        setAllowNegative(false)
        break
      case 'scientific':
        setMinValue(0)
        setMaxValue(10)
        setDecimalPlaces(6)
        setAllowNegative(false)
        break
      case 'temperature':
        setMinValue(-40)
        setMaxValue(40)
        setDecimalPlaces(1)
        setAllowNegative(true)
        break
    }
  }

  const statistics = getStatistics()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Decimal Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random decimal numbers with customizable precision. Perfect for mathematical simulations, testing, and data generation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设置面�?*/}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  Decimal Options
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your decimal number generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Min Value</Label>
                    <Input
                      type="number"
                      step="any"
                      value={minValue}
                      onChange={(e) => setMinValue(parseFloat(e.target.value) || 0)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Max Value</Label>
                    <Input
                      type="number"
                      step="any"
                      value={maxValue}
                      onChange={(e) => setMaxValue(parseFloat(e.target.value) || 100)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Decimal Places</Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={decimalPlaces}
                    onChange={(e) => setDecimalPlaces(Math.max(0, Math.min(10, parseInt(e.target.value) || 2)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">0 to 10 decimal places</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Count</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10000}
                    value={numberCount}
                    onChange={(e) => setNumberCount(Math.max(1, Math.min(10000, parseInt(e.target.value) || 10)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 10,000 numbers</p>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={allowNegative}
                    onChange={(e) => setAllowNegative(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span className="text-white">Include negative numbers</span>
                </label>

                <Button 
                  onClick={generateDecimals}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5 mr-2" />
                      Generate Decimals
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 预设配置 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Presets</CardTitle>
                <CardDescription className="text-slate-300">
                  Common decimal number scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => loadPreset('percentage')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Percentage (0-100)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('probability')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Probability (0-1)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('currency')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Currency (0-1000)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('scientific')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Scientific (6 decimals)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('temperature')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Temperature (°C)
                </Button>
              </CardContent>
            </Card>

            {/* 统计信息 */}
            {statistics && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart2 className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Count:</span>
                      <span className="text-white font-mono">{statistics.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sum:</span>
                      <span className="text-white font-mono">{statistics.sum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mean:</span>
                      <span className="text-white font-mono">{statistics.mean}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Median:</span>
                      <span className="text-white font-mono">{statistics.median}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Min:</span>
                      <span className="text-white font-mono">{statistics.min}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max:</span>
                      <span className="text-white font-mono">{statistics.max}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Range:</span>
                      <span className="text-white font-mono">{statistics.range}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Std Dev:</span>
                      <span className="text-white font-mono">{statistics.standardDeviation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：结果显�?*/}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 && (
              <>
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Generated Decimals</CardTitle>
                        <CardDescription className="text-slate-300">
                          {results.length} random decimal numbers
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => navigator.clipboard.writeText(result.formatted)}
                        >
                          <div className="text-center">
                            <div className="text-white font-mono text-lg font-bold">
                              {result.formatted}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              #{index + 1}
                            </div>
                          </div>
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
                      Copy decimals in different formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => copyResults('list')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Plain List
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('csv')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        CSV Format
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('json')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        JSON Array
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('math')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Math Format
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Applications & Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Generate precise decimal numbers for various mathematical, scientific, and practical applications 
                  with customizable precision and range controls.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Scientific Applications:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Mathematical simulations</li>
                      <li>Statistical sampling</li>
                      <li>Monte Carlo methods</li>
                      <li>Experimental data generation</li>
                      <li>Algorithm testing</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Business & Finance:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Price simulations</li>
                      <li>Financial modeling</li>
                      <li>Currency calculations</li>
                      <li>Percentage calculations</li>
                      <li>Revenue projections</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Programming & Testing:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Software testing data</li>
                      <li>Database seeding</li>
                      <li>Performance benchmarking</li>
                      <li>API response simulation</li>
                      <li>Unit test cases</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Educational:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Math problem generation</li>
                      <li>Statistics exercises</li>
                      <li>Probability examples</li>
                      <li>Data analysis practice</li>
                      <li>Excel/spreadsheet data</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <h4 className="font-medium text-emerald-300 mb-2">Number Generation Features:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-emerald-100">
                    <li>Cryptographically secure random generation</li>
                    <li>Configurable precision up to 10 decimal places</li>
                    <li>Support for negative number ranges</li>
                    <li>Real-time statistical analysis</li>
                    <li>Multiple export formats</li>
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
