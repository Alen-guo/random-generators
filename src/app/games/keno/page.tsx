"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shuffle, RotateCcw, Copy, Download, Star, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface KenoConfig {
  spots: number // 选择的号码数量
  maxNumber: number // 最大号码
  games: number // 生成多少组
  quickPick: boolean // 快速选号
}

interface KenoResult {
  gameId: number
  numbers: number[]
  spots: number
  generatedAt: Date
}

const presets = [
  { name: 'Classic Keno', spots: 10, maxNumber: 80, games: 1 },
  { name: 'Quick Pick 5', spots: 5, maxNumber: 80, games: 1 },
  { name: 'Power Keno', spots: 15, maxNumber: 80, games: 1 },
  { name: 'Multi-Game', spots: 10, maxNumber: 80, games: 5 },
]

export default function KenoPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<KenoConfig>({
    spots: 10,
    maxNumber: 80,
    games: 1,
    quickPick: true
  })
  
  const [results, setResults] = useState<KenoResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])

  const generateKenoNumbers = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newResults: KenoResult[] = []
      
      for (let game = 0; game < config.games; game++) {
        const numbers = new Set<number>()
        
        while (numbers.size < config.spots) {
          const num = Math.floor(Math.random() * config.maxNumber) + 1
          numbers.add(num)
        }
        
        newResults.push({
          gameId: game + 1,
          numbers: Array.from(numbers).sort((a, b) => a - b),
          spots: config.spots,
          generatedAt: new Date()
        })
      }
      
      setResults(newResults)
      setIsGenerating(false)
    }, 500)
  }

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num))
    } else if (selectedNumbers.length < config.spots) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b))
    }
  }

  const clearSelection = () => {
    setSelectedNumbers([])
  }

  const quickPickNumbers = () => {
    const numbers = new Set<number>()
    while (numbers.size < config.spots) {
      const num = Math.floor(Math.random() * config.maxNumber) + 1
      numbers.add(num)
    }
    setSelectedNumbers(Array.from(numbers).sort((a, b) => a - b))
  }

  const copyResults = () => {
    const text = results.map(result => 
      `Game ${result.gameId}: ${result.numbers.join(', ')}`
    ).join('\n')
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const text = results.map(result => 
      `Game ${result.gameId}: ${result.numbers.join(', ')}`
    ).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keno-numbers.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const applyPreset = (preset: typeof presets[0]) => {
    setConfig({
      ...config,
      spots: preset.spots,
      maxNumber: preset.maxNumber,
      games: preset.games
    })
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Keno Quick Pick Generator
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Generate random Keno numbers for your games. Choose your spots and let luck decide your numbers!
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* 配置面板 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                Keno Configuration
              </CardTitle>
              <CardDescription className="text-purple-200">
                Set up your Keno game parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 预设按钮 */}
              <div className="space-y-2">
                <Label className="text-white">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spots" className="text-white">Spots to Pick</Label>
                  <Input
                    id="spots"
                    type="number"
                    min="1"
                    max="20"
                    value={config.spots}
                    onChange={(e) => setConfig({...config, spots: parseInt(e.target.value) || 1})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxNumber" className="text-white">Max Number</Label>
                  <Select value={config.maxNumber.toString()} onValueChange={(value: string) => setConfig({...config, maxNumber: parseInt(value)})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40">40 (Mini Keno)</SelectItem>
                      <SelectItem value="70">70 (Club Keno)</SelectItem>
                      <SelectItem value="80">80 (Classic Keno)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="games" className="text-white">Number of Games</Label>
                  <Input
                    id="games"
                    type="number"
                    min="1"
                    max="10"
                    value={config.games}
                    onChange={(e) => setConfig({...config, games: parseInt(e.target.value) || 1})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={generateKenoNumbers}
                    disabled={isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white notranslate"
                    translate="no"
                    data-interactive="true"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Numbers
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 结果展示 */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Generated Numbers</CardTitle>
                      <CardDescription className="text-purple-200">
                        Your Keno quick picks are ready!
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyResults}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadResults}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-medium">Game {result.gameId}</h3>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                          {result.spots} spots
                        </Badge>
                      </div>
                      <div className="grid grid-cols-10 gap-2">
                        {result.numbers.map((number, numIndex) => (
                          <div
                            key={numIndex}
                            className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                          >
                            {number}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}