"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart3, RefreshCw, Copy, Download, TrendingUp, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface GaussianConfig {
  mean: number
  standardDeviation: number
  count: number
  decimalPlaces: number
  filterOutliers: boolean
  outlierThreshold: number
}

interface GeneratedNumber {
  id: string
  value: number
  zScore: number
  percentile: number
  timestamp: Date
}

export default function GaussianPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<GaussianConfig>({
    mean: 0,
    standardDeviation: 1,
    count: 10,
    decimalPlaces: 2,
    filterOutliers: false,
    outlierThreshold: 3
  })
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumber[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [statistics, setStatistics] = useState<{
    actualMean: number
    actualStdDev: number
    min: number
    max: number
    range: number
  } | null>(null)

  // Box-Muller变换生成正态分布随机数
  const generateGaussian = (mean: number, stdDev: number): number => {
    let u = 0, v = 0
    while(u === 0) u = Math.random() // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    return z * stdDev + mean
  }

  // 计算累积分布函数 (CDF)
  const normalCDF = (x: number, mean: number, stdDev: number): number => {
    const z = (x - mean) / stdDev
    return 0.5 * (1 + erf(z / Math.sqrt(2)))
  }

  // 误差函数近似
  const erf = (x: number): number => {
    const a1 =  0.254829592
    const a2 = -0.284496736
    const a3 =  1.421413741
    const a4 = -1.453152027
    const a5 =  1.061405429
    const p  =  0.3275911

    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return sign * y
  }

  const generateNumbers = async () => {
    setIsGenerating(true)
    
    try {
      const numbers: GeneratedNumber[] = []
      let attempts = 0
      const maxAttempts = config.count * 10 // 防止无限循环
      
      while (numbers.length < config.count && attempts < maxAttempts) {
        attempts++
        
        const rawValue = generateGaussian(config.mean, config.standardDeviation)
        const zScore = (rawValue - config.mean) / config.standardDeviation
        
        // 过滤异常值（如果启用）
        if (config.filterOutliers && Math.abs(zScore) > config.outlierThreshold) {
          continue
        }
        
        const value = Number(rawValue.toFixed(config.decimalPlaces))
        const percentile = normalCDF(value, config.mean, config.standardDeviation) * 100
        
        numbers.push({
          id: `gaussian_${Date.now()}_${numbers.length}`,
          value,
          zScore: Number(zScore.toFixed(3)),
          percentile: Number(percentile.toFixed(1)),
          timestamp: new Date()
        })
      }
      
      // 计算实际统计数据
      if (numbers.length > 0) {
        const values = numbers.map(n => n.value)
        const actualMean = values.reduce((sum, val) => sum + val, 0) / values.length
        const variance = values.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0) / values.length
        const actualStdDev = Math.sqrt(variance)
        const min = Math.min(...values)
        const max = Math.max(...values)
        
        setStatistics({
          actualMean: Number(actualMean.toFixed(config.decimalPlaces)),
          actualStdDev: Number(actualStdDev.toFixed(config.decimalPlaces)),
          min,
          max,
          range: Number((max - min).toFixed(config.decimalPlaces))
        })
      }
      
      setGeneratedNumbers(numbers)
      
    } catch (error) {
      console.error('Error generating gaussian numbers:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyNumbers = () => {
    const content = generatedNumbers.map(num => num.value).join('\n')
    navigator.clipboard.writeText(content)
  }

  const downloadNumbers = () => {
    const content = `Gaussian Random Numbers
Generated: ${new Date().toLocaleString()}
Mean: ${config.mean}
Standard Deviation: ${config.standardDeviation}
Count: ${generatedNumbers.length}
Decimal Places: ${config.decimalPlaces}
Outlier Filtering: ${config.filterOutliers ? `Enabled (±${config.outlierThreshold}σ)` : 'Disabled'}

${statistics ? `Actual Statistics:
Mean: ${statistics.actualMean}
Standard Deviation: ${statistics.actualStdDev}
Minimum: ${statistics.min}
Maximum: ${statistics.max}
Range: ${statistics.range}

` : ''}Value,Z-Score,Percentile
${generatedNumbers.map(num => `${num.value},${num.zScore},${num.percentile}%`).join('\n')}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `gaussian-numbers-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'standard' | 'iq_scores' | 'heights' | 'test_scores') => {
    switch (preset) {
      case 'standard':
        setConfig({
          mean: 0,
          standardDeviation: 1,
          count: 100,
          decimalPlaces: 3,
          filterOutliers: false,
          outlierThreshold: 3
        })
        break
      case 'iq_scores':
        setConfig({
          mean: 100,
          standardDeviation: 15,
          count: 50,
          decimalPlaces: 0,
          filterOutliers: true,
          outlierThreshold: 2.5
        })
        break
      case 'heights':
        setConfig({
          mean: 170,
          standardDeviation: 10,
          count: 30,
          decimalPlaces: 1,
          filterOutliers: true,
          outlierThreshold: 3
        })
        break
      case 'test_scores':
        setConfig({
          mean: 75,
          standardDeviation: 12,
          count: 25,
          decimalPlaces: 1,
          filterOutliers: true,
          outlierThreshold: 2
        })
        break
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Gaussian Number Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random numbers following a normal (Gaussian) distribution. Perfect for statistical analysis, simulations, and modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Distribution Parameters
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure the normal distribution parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 均值 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Mean (μ)</Label>
                  <Input
                    type="number"
                    value={config.mean}
                    onChange={(e) => setConfig(prev => ({ ...prev, mean: parseFloat(e.target.value) || 0 }))}
                    className="bg-white/10 border-white/20 text-white"
                    step="any"
                  />
                  <p className="text-xs text-slate-400">Center of the distribution</p>
                </div>

                {/* 标准差 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Standard Deviation (σ)</Label>
                  <Input
                    type="number"
                    value={config.standardDeviation}
                    onChange={(e) => setConfig(prev => ({ ...prev, standardDeviation: Math.max(0.01, parseFloat(e.target.value) || 1) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="0.01"
                    step="any"
                  />
                  <p className="text-xs text-slate-400">Spread of the distribution</p>
                </div>

                {/* 数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Count</Label>
                  <Input
                    type="number"
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ ...prev, count: Math.max(1, Math.min(1000, parseInt(e.target.value) || 10)) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="1"
                    max="1000"
                  />
                </div>

                {/* 小数位数 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Decimal Places</Label>
                  <Input
                    type="number"
                    value={config.decimalPlaces}
                    onChange={(e) => setConfig(prev => ({ ...prev, decimalPlaces: Math.max(0, Math.min(10, parseInt(e.target.value) || 2)) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="0"
                    max="10"
                  />
                </div>

                {/* 异常值过滤 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="filterOutliers"
                      checked={config.filterOutliers}
                      onChange={(e) => setConfig(prev => ({ ...prev, filterOutliers: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="filterOutliers" className="text-slate-300">Filter Outliers</Label>
                  </div>
                  
                  {config.filterOutliers && (
                    <div className="space-y-2">
                      <Label className="text-slate-300">Threshold (σ)</Label>
                      <Input
                        type="number"
                        value={config.outlierThreshold}
                        onChange={(e) => setConfig(prev => ({ ...prev, outlierThreshold: Math.max(1, parseFloat(e.target.value) || 3) }))}
                        className="bg-white/10 border-white/20 text-white"
                        min="1"
                        step="0.1"
                      />
                      <p className="text-xs text-slate-400">Remove values beyond ±{config.outlierThreshold}σ</p>
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
                      onClick={() => loadPreset('standard')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📊 Standard
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('iq_scores')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🧠 IQ Scores
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('heights')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📏 Heights (cm)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('test_scores')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📝 Test Scores
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateNumbers}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-semibold notranslate"
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
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Numbers
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 统计信息 */}
            {statistics && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Info className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Actual Mean</div>
                      <div className="text-white font-mono">{statistics.actualMean}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Actual Std Dev</div>
                      <div className="text-white font-mono">{statistics.actualStdDev}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Minimum</div>
                      <div className="text-white font-mono">{statistics.min}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Maximum</div>
                      <div className="text-white font-mono">{statistics.max}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-slate-400 text-sm">Range</div>
                    <div className="text-white font-mono">{statistics.range}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：生成的数字 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedNumbers.length > 0 ? (
              <>
                {/* 操作按钮 */}
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {generatedNumbers.length} numbers generated
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={copyNumbers}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={downloadNumbers}
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

                {/* 数字列表 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Generated Numbers</CardTitle>
                      <CardDescription className="text-slate-300">
                        Normal distribution with μ={config.mean}, σ={config.standardDeviation}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {generatedNumbers.map((num, index) => (
                          <motion.div
                            key={num.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="bg-slate-800 border border-white/20 rounded p-3 text-center"
                          >
                            <div className="text-white font-mono text-lg font-bold mb-1">
                              {num.value}
                            </div>
                            <div className="text-xs text-slate-400 space-y-1">
                              <div>Z: {num.zScore}</div>
                              <div>{num.percentile}%ile</div>
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
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate Gaussian numbers?</p>
                  <p>Set your distribution parameters and click "Generate Numbers"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Gaussian Distribution Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Normal Distribution</h4>
                    <p className="text-sm">Also known as Gaussian distribution, follows the bell curve pattern where 68% of values fall within 1σ, 95% within 2σ, and 99.7% within 3σ.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Statistical Metrics</h4>
                    <p className="text-sm">Each number includes its Z-score (standard deviations from mean) and percentile rank in the distribution.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Outlier Filtering</h4>
                    <p className="text-sm">Optional removal of extreme values beyond specified standard deviation thresholds for cleaner datasets.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Applications:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Statistical modeling</li>
                      <li>Monte Carlo simulations</li>
                      <li>Quality control</li>
                      <li>Scientific research</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>A/B testing</li>
                      <li>Risk analysis</li>
                      <li>Machine learning</li>
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