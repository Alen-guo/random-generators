"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dices, RefreshCw, Copy, TrendingUp, History } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface DiceResult {
  value: number
  sides: number
  timestamp: Date
}

interface DiceSet {
  count: number
  sides: number
  results: number[]
  total: number
  timestamp: Date
}

export default function DicePage() {
  const containerRef = useTranslationProtection()
  const [diceCount, setDiceCount] = useState(2)
  const [diceSides, setDiceSides] = useState(6)
  const [currentRoll, setCurrentRoll] = useState<DiceResult[]>([])
  const [rollHistory, setRollHistory] = useState<DiceSet[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [modifier, setModifier] = useState(0)

  const commonDice = [4, 6, 8, 10, 12, 20, 100]

  const rollDice = async () => {
    setIsRolling(true)
    setCurrentRoll([])

    // Animation: show rolling effect
    for (let i = 0; i < 10; i++) {
      const tempResults = Array.from({ length: diceCount }, (_, index) => ({
        value: Math.floor(Math.random() * diceSides) + 1,
        sides: diceSides,
        timestamp: new Date()
      }))
      setCurrentRoll(tempResults)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Final results
    const finalResults = Array.from({ length: diceCount }, (_, index) => ({
      value: Math.floor(Math.random() * diceSides) + 1,
      sides: diceSides,
      timestamp: new Date()
    }))

    setCurrentRoll(finalResults)

    const total = finalResults.reduce((sum, dice) => sum + dice.value, 0)
    const rollSet: DiceSet = {
      count: diceCount,
      sides: diceSides,
      results: finalResults.map(d => d.value),
      total: total + modifier,
      timestamp: new Date()
    }

    setRollHistory(prev => [rollSet, ...prev.slice(0, 19)]) // Keep last 20 rolls
    setIsRolling(false)
  }

  const getDiceColor = (value: number, sides: number) => {
    const percentage = value / sides
    if (percentage >= 0.8) return 'from-emerald-500 to-green-500'
    if (percentage >= 0.6) return 'from-yellow-500 to-orange-500'
    if (percentage >= 0.4) return 'from-blue-500 to-cyan-500'
    return 'from-red-500 to-pink-500'
  }

  const getStatistics = () => {
    if (rollHistory.length === 0) return null

    const allRolls = rollHistory.flatMap(roll => roll.results)
    const total = allRolls.reduce((sum, value) => sum + value, 0)
    const average = total / allRolls.length
    const min = Math.min(...allRolls)
    const max = Math.max(...allRolls)

    // Count frequency
    const frequency: Record<number, number> = {}
    allRolls.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1
    })

    const mostCommon = Object.entries(frequency).reduce((a, b) => 
      frequency[parseInt(a[0])] > frequency[parseInt(b[0])] ? a : b
    )

    return {
      totalRolls: allRolls.length,
      average: average.toFixed(2),
      min,
      max,
      mostCommon: {
        value: parseInt(mostCommon[0]),
        count: mostCommon[1]
      }
    }
  }

  const loadPreset = (preset: 'classic' | 'dnd' | 'advantage' | 'yahtzee') => {
    switch (preset) {
      case 'classic':
        setDiceCount(2)
        setDiceSides(6)
        setModifier(0)
        break
      case 'dnd':
        setDiceCount(1)
        setDiceSides(20)
        setModifier(0)
        break
      case 'advantage':
        setDiceCount(2)
        setDiceSides(20)
        setModifier(0)
        break
      case 'yahtzee':
        setDiceCount(5)
        setDiceSides(6)
        setModifier(0)
        break
    }
  }

  const copyResults = () => {
    if (currentRoll.length === 0) return
    
    const total = currentRoll.reduce((sum, dice) => sum + dice.value, 0) + modifier
    const rolls = currentRoll.map(d => d.value).join(', ')
    const text = `${diceCount}d${diceSides}: [${rolls}] = ${total}`
    navigator.clipboard.writeText(text)
  }

  const clearHistory = () => {
    setRollHistory([])
  }

  const statistics = getStatistics()

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <Dices className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Dice Roller</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Roll virtual dice for games, D&D campaigns, board games, and random decisions. Support for all standard dice types.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：控制面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Dice Configuration</CardTitle>
                <CardDescription className="text-slate-300">
                  Set up your dice roll
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Dice</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={diceCount}
                    onChange={(e) => setDiceCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Dice Sides</Label>
                  <Input
                    type="number"
                    min={2}
                    max={100}
                    value={diceSides}
                    onChange={(e) => setDiceSides(Math.max(2, Math.min(100, parseInt(e.target.value) || 6)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Modifier (+/-)</Label>
                  <Input
                    type="number"
                    min={-50}
                    max={50}
                    value={modifier}
                    onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Common Dice</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {commonDice.map(sides => (
                      <Button
                        key={sides}
                        variant="outline"
                        size="sm"
                        onClick={() => setDiceSides(sides)}
                        className={`${
                          diceSides === sides
                            ? 'bg-red-500/20 border-red-400 text-red-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        d{sides}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 font-semibold text-lg py-3 notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isRolling ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Rolling...
                    </>
                  ) : (
                    <>
                      <Dices className="h-5 w-5 mr-2" />
                      Roll {diceCount}d{diceSides}
                    </>
                  )}
                </Button>

                {/* 预设配置 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('classic')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Classic (2d6)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('dnd')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      D&D (1d20)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('advantage')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Advantage (2d20)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('yahtzee')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Yahtzee (5d6)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 统计信息 */}
            {statistics && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-slate-400 text-sm">Total Rolls</div>
                      <div className="text-white font-bold text-lg">{statistics.totalRolls}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-sm">Average</div>
                      <div className="text-white font-bold text-lg">{statistics.average}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-sm">Min / Max</div>
                      <div className="text-white font-bold text-lg">{statistics.min} / {statistics.max}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-sm">Most Common</div>
                      <div className="text-white font-bold text-lg">
                        {statistics.mostCommon.value} ({statistics.mostCommon.count}x)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 中间：骰子显示 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Current Roll</CardTitle>
                  {currentRoll.length > 0 && (
                    <Button
                      onClick={copyResults}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <CardDescription className="text-slate-300">
                  {diceCount}d{diceSides} {modifier !== 0 && `${modifier >= 0 ? '+' : ''}${modifier}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentRoll.length > 0 ? (
                  <div className="space-y-6">
                    {/* 骰子显示 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
                      {currentRoll.map((dice, index) => (
                        <div
                          key={index}
                          className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getDiceColor(dice.value, dice.sides)} 
                            flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/20
                            transform transition-all duration-300 hover:scale-105`}
                        >
                          <span>{dice.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* 结果汇总 */}
                    <div className="text-center">
                      <div className="text-slate-400 mb-2">Individual: {currentRoll.map(d => d.value).join(' + ')}</div>
                      {modifier !== 0 && (
                        <div className="text-slate-400 mb-2">
                          Modifier: {modifier >= 0 ? '+' : ''}{modifier}
                        </div>
                      )}
                      <div className="text-3xl font-bold text-white">
                        Total: {currentRoll.reduce((sum, dice) => sum + dice.value, 0) + modifier}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Dices className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Click "Roll" to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：历史记录 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <History className="h-5 w-5" />
                    Roll History
                  </CardTitle>
                  {rollHistory.length > 0 && (
                    <Button
                      onClick={clearHistory}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <CardDescription className="text-slate-300">
                  {rollHistory.length > 0 ? `${rollHistory.length} recent rolls` : 'No rolls yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rollHistory.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {rollHistory.map((roll, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">
                            {roll.count}d{roll.sides}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {roll.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-slate-300 text-sm">
                          Rolls: [{roll.results.join(', ')}]
                        </div>
                        <div className="text-white font-bold">
                          Total: {roll.total}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>Roll some dice to see history here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Dice Notation</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">XdY Format</h4>
                    <p className="text-sm">X = number of dice, Y = sides per die</p>
                    <p className="text-xs text-slate-400">Example: 2d6 = roll two 6-sided dice</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Common Dice</h4>
                    <div className="text-sm grid grid-cols-2 gap-1">
                      <div>d4 - Tetrahedron</div>
                      <div>d6 - Standard cube</div>
                      <div>d8 - Octahedron</div>
                      <div>d10 - Pentagonal</div>
                      <div>d12 - Dodecahedron</div>
                      <div>d20 - Icosahedron</div>
                      <div>d100 - Percentile</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Modifiers</h4>
                    <p className="text-sm">Add or subtract a fixed number to the total roll result.</p>
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
