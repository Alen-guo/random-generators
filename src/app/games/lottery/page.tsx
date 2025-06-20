"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star, RefreshCw, Copy, Download, Ticket, Trophy, Globe, Settings, Info } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface LotteryConfig {
  name: string
  mainNumbers: { min: number; max: number; count: number }
  bonusNumbers?: { min: number; max: number; count: number }
  description: string
  country: string
}

interface LotteryResult {
  config: LotteryConfig
  mainNumbers: number[]
  bonusNumbers?: number[]
  timestamp: Date
}

const lotteryConfigs: LotteryConfig[] = [
  {
    name: 'Powerball (US)',
    mainNumbers: { min: 1, max: 69, count: 5 },
    bonusNumbers: { min: 1, max: 26, count: 1 },
    description: 'Pick 5 numbers from 1-69 + 1 Powerball from 1-26',
    country: 'United States'
  },
  {
    name: 'Mega Millions (US)',
    mainNumbers: { min: 1, max: 70, count: 5 },
    bonusNumbers: { min: 1, max: 25, count: 1 },
    description: 'Pick 5 numbers from 1-70 + 1 Mega Ball from 1-25',
    country: 'United States'
  },
  {
    name: 'EuroMillions',
    mainNumbers: { min: 1, max: 50, count: 5 },
    bonusNumbers: { min: 1, max: 12, count: 2 },
    description: 'Pick 5 numbers from 1-50 + 2 Lucky Stars from 1-12',
    country: 'Europe'
  },
  {
    name: 'UK National Lottery',
    mainNumbers: { min: 1, max: 59, count: 6 },
    description: 'Pick 6 numbers from 1-59',
    country: 'United Kingdom'
  },
  {
    name: 'Canada Lotto 6/49',
    mainNumbers: { min: 1, max: 49, count: 6 },
    description: 'Pick 6 numbers from 1-49',
    country: 'Canada'
  },
  {
    name: 'Australian Powerball',
    mainNumbers: { min: 1, max: 35, count: 7 },
    bonusNumbers: { min: 1, max: 20, count: 1 },
    description: 'Pick 7 numbers from 1-35 + 1 Powerball from 1-20',
    country: 'Australia'
  },
  {
    name: 'SuperEnalotto (Italy)',
    mainNumbers: { min: 1, max: 90, count: 6 },
    description: 'Pick 6 numbers from 1-90',
    country: 'Italy'
  },
  {
    name: 'El Gordo (Spain)',
    mainNumbers: { min: 1, max: 54, count: 5 },
    bonusNumbers: { min: 0, max: 9, count: 1 },
    description: 'Pick 5 numbers from 1-54 + 1 key number from 0-9',
    country: 'Spain'
  }
]

export default function LotteryGeneratorPage() {
  const containerRef = useTranslationProtection()
  const [selectedLottery, setSelectedLottery] = useState(lotteryConfigs[0])
  const [customConfig, setCustomConfig] = useState<LotteryConfig>({
    name: 'Custom Lottery',
    mainNumbers: { min: 1, max: 50, count: 6 },
    description: 'Custom lottery configuration',
    country: 'Custom'
  })
  const [useCustom, setUseCustom] = useState(false)
  const [numberOfDraws, setNumberOfDraws] = useState(1)
  const [results, setResults] = useState<LotteryResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNumbers = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const config = useCustom ? customConfig : selectedLottery
    const newResults: LotteryResult[] = []
    
    for (let i = 0; i < numberOfDraws; i++) {
      // Generate main numbers
      const mainNumbers: number[] = []
      while (mainNumbers.length < config.mainNumbers.count) {
        const num = Math.floor(Math.random() * (config.mainNumbers.max - config.mainNumbers.min + 1)) + config.mainNumbers.min
        if (!mainNumbers.includes(num)) {
          mainNumbers.push(num)
        }
      }
      mainNumbers.sort((a, b) => a - b)
      
      // Generate bonus numbers if needed
      let bonusNumbers: number[] | undefined
      if (config.bonusNumbers) {
        bonusNumbers = []
        while (bonusNumbers.length < config.bonusNumbers.count) {
          const num = Math.floor(Math.random() * (config.bonusNumbers.max - config.bonusNumbers.min + 1)) + config.bonusNumbers.min
          if (!bonusNumbers.includes(num)) {
            bonusNumbers.push(num)
          }
        }
        bonusNumbers.sort((a, b) => a - b)
      }
      
      newResults.push({
        config,
        mainNumbers,
        bonusNumbers,
        timestamp: new Date()
      })
    }
    
    setResults(newResults)
    setIsGenerating(false)
  }

  const copyResults = (format: 'simple' | 'detailed' | 'csv') => {
    let text = ''
    
    switch (format) {
      case 'simple':
        text = results.map(result => {
          const main = result.mainNumbers.join(', ')
          const bonus = result.bonusNumbers ? ` | Bonus: ${result.bonusNumbers.join(', ')}` : ''
          return `${main}${bonus}`
        }).join('\n')
        break
      case 'detailed':
        text = results.map((result, index) => {
          const main = result.mainNumbers.join(', ')
          const bonus = result.bonusNumbers ? ` | Bonus: ${result.bonusNumbers.join(', ')}` : ''
          return `Draw ${index + 1} (${result.config.name}): ${main}${bonus}`
        }).join('\n')
        break
      case 'csv':
        text = 'Draw,Lottery,Main Numbers,Bonus Numbers,Generated\n' + 
               results.map((result, index) => {
                 const main = result.mainNumbers.join(';')
                 const bonus = result.bonusNumbers ? result.bonusNumbers.join(';') : ''
                 return `${index + 1},"${result.config.name}","${main}","${bonus}","${result.timestamp.toISOString()}"`
               }).join('\n')
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const text = results.map((result, index) => {
      const main = result.mainNumbers.join(', ')
      const bonus = result.bonusNumbers ? ` | Bonus: ${result.bonusNumbers.join(', ')}` : ''
      return `Draw ${index + 1} (${result.config.name}): ${main}${bonus}`
    }).join('\n')
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lottery-numbers.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Lottery Number Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate lucky numbers for popular lotteries worldwide. Choose from preset configurations or create your own custom lottery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Ticket className="h-5 w-5" />
                  Lottery Selection
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Choose a lottery or create custom settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={!useCustom}
                      onChange={() => setUseCustom(false)}
                      className="accent-yellow-500"
                    />
                    <span className="text-white">Popular Lotteries</span>
                  </label>
                  
                  {!useCustom && (
                    <select
                      value={lotteryConfigs.indexOf(selectedLottery)}
                      onChange={(e) => setSelectedLottery(lotteryConfigs[parseInt(e.target.value)])}
                      className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-yellow-400 focus:ring-yellow-400/20 focus:outline-none"
                    >
                      {lotteryConfigs.map((config, index) => (
                        <option key={index} value={index} className="bg-slate-800">
                          {config.name} ({config.country})
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={useCustom}
                      onChange={() => setUseCustom(true)}
                      className="accent-yellow-500"
                    />
                    <span className="text-white">Custom Configuration</span>
                  </label>
                </div>

                {useCustom && (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-slate-300 text-xs">Min</Label>
                        <Input
                          type="number"
                          value={customConfig.mainNumbers.min}
                          onChange={(e) => setCustomConfig(prev => ({
                            ...prev,
                            mainNumbers: { ...prev.mainNumbers, min: parseInt(e.target.value) || 1 }
                          }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-slate-300 text-xs">Max</Label>
                        <Input
                          type="number"
                          value={customConfig.mainNumbers.max}
                          onChange={(e) => setCustomConfig(prev => ({
                            ...prev,
                            mainNumbers: { ...prev.mainNumbers, max: parseInt(e.target.value) || 50 }
                          }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-slate-300 text-xs">Count</Label>
                        <Input
                          type="number"
                          value={customConfig.mainNumbers.count}
                          onChange={(e) => setCustomConfig(prev => ({
                            ...prev,
                            mainNumbers: { ...prev.mainNumbers, count: parseInt(e.target.value) || 6 }
                          }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Draws</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={numberOfDraws}
                    onChange={(e) => setNumberOfDraws(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 20 draws</p>
                </div>

                <Button 
                  onClick={generateNumbers}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 font-semibold notranslate"
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
                      <Star className="h-5 w-5 mr-2" />
                      Generate Lucky Numbers
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 当前配置显示 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  Current Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!useCustom ? (
                  <>
                    <div>
                      <h4 className="font-medium text-white">{selectedLottery.name}</h4>
                      <p className="text-sm text-slate-400">{selectedLottery.country}</p>
                    </div>
                    <p className="text-sm text-slate-300">{selectedLottery.description}</p>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-white">Custom Lottery</h4>
                      <p className="text-sm text-slate-400">
                        Pick {customConfig.mainNumbers.count} numbers from {customConfig.mainNumbers.min}-{customConfig.mainNumbers.max}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5" />
                  Lottery Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3">
                <div className="space-y-2">
                  <p className="text-sm">🍀 All number combinations have equal probability</p>
                  <p className="text-sm">🎯 Consider playing consistently with the same numbers</p>
                  <p className="text-sm">💰 Only play with money you can afford to lose</p>
                  <p className="text-sm">📊 Check official lottery websites for draw schedules</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果显示 */}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 && (
              <>
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Your Lucky Numbers</CardTitle>
                        <CardDescription className="text-slate-300">
                          {results.length} draw{results.length > 1 ? 's' : ''} for {results[0].config.name}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResults('simple')}
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
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white">
                              Draw #{index + 1}
                            </h4>
                            <span className="text-xs text-slate-400">
                              {result.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {/* Main Numbers */}
                            <div>
                              <div className="text-sm text-slate-300 mb-2">Main Numbers:</div>
                              <div className="flex flex-wrap gap-2">
                                {result.mainNumbers.map((number, numIndex) => (
                                  <div
                                    key={numIndex}
                                    className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                  >
                                    {number}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Bonus Numbers */}
                            {result.bonusNumbers && (
                              <div>
                                <div className="text-sm text-slate-300 mb-2">
                                  {result.config.name.includes('Powerball') ? 'Powerball:' : 
                                   result.config.name.includes('Mega') ? 'Mega Ball:' :
                                   result.config.name.includes('Euro') ? 'Lucky Stars:' : 'Bonus:'}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {result.bonusNumbers.map((number, numIndex) => (
                                    <div
                                      key={numIndex}
                                      className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                    >
                                      {number}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
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
                      Save your lucky numbers in different formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => copyResults('simple')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Simple Format
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('detailed')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Detailed Format
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('csv')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        CSV Format
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">How to Use Your Numbers</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Our lottery number generator creates completely random number combinations based on official 
                  lottery rules and formats from around the world.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Popular Lotteries Included:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>US Powerball & Mega Millions</li>
                      <li>European EuroMillions</li>
                      <li>UK National Lottery</li>
                      <li>Canadian Lotto 6/49</li>
                      <li>Australian Powerball</li>
                      <li>And many more worldwide</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Next Steps:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Save or print your numbers</li>
                      <li>Check official lottery websites</li>
                      <li>Purchase tickets from authorized retailers</li>
                      <li>Keep your tickets safe</li>
                      <li>Check results after draws</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-100">
                    <strong>Remember:</strong> This is a number generator for entertainment purposes. 
                    Always purchase tickets through official lottery retailers and play responsibly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}