"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Coins, RefreshCw, History, Info, TrendingUp } from 'lucide-react'

interface CoinResult {
  result: 'heads' | 'tails'
  timestamp: Date
}

export default function CoinFlipperPage() {
  const [numFlips, setNumFlips] = useState(1)
  const [results, setResults] = useState<CoinResult[]>([])
  const [history, setHistory] = useState<CoinResult[]>([])
  const [isFlipping, setIsFlipping] = useState(false)

  const flipCoins = async () => {
    setIsFlipping(true)
    
    // 添加翻转动画延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newResults: CoinResult[] = []
    for (let i = 0; i < numFlips; i++) {
      const result = Math.random() < 0.5 ? 'heads' : 'tails'
      newResults.push({
        result,
        timestamp: new Date()
      })
    }
    
    setResults(newResults)
    setHistory(prev => [...newResults, ...prev].slice(0, 50))
    setIsFlipping(false)
  }

  const getStats = () => {
    if (results.length === 0) return { heads: 0, tails: 0, headsPercent: 0, tailsPercent: 0 }
    
    const heads = results.filter(r => r.result === 'heads').length
    const tails = results.filter(r => r.result === 'tails').length
    
    return {
      heads,
      tails,
      headsPercent: Math.round((heads / results.length) * 100),
      tailsPercent: Math.round((tails / results.length) * 100)
    }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Coin Flipper</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Flip virtual coins to make decisions. Get truly random heads or tails results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：介绍和统计 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="h-5 w-5" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">1. Set Number of Flips</h4>
                  <p className="text-sm">Choose how many coins to flip at once</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">2. Flip Coins</h4>
                  <p className="text-sm">Click "Flip Coins" to generate results</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">3. View Results</h4>
                  <p className="text-sm">See heads/tails outcomes and statistics</p>
                </div>
              </CardContent>
            </Card>

            {results.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Heads:</span>
                      <span className="text-white font-bold">{stats.heads} ({stats.headsPercent}%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Tails:</span>
                      <span className="text-white font-bold">{stats.tails} ({stats.tailsPercent}%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Flips:</span>
                      <span className="text-white font-bold">{results.length}</span>
                    </div>
                  </div>
                  
                  {/* 可视化比例 */}
                  <div className="space-y-2">
                    <div className="flex h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500"
                        style={{ width: `${stats.headsPercent}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-orange-500"
                        style={{ width: `${stats.tailsPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-yellow-400">Heads</span>
                      <span className="text-orange-400">Tails</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">About Coin Flipping</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Coin flipping is one of the oldest and simplest methods for making random decisions. 
                  Each flip has exactly 50% probability of landing on heads or tails.
                </p>
                <p className="text-sm leading-relaxed">
                  Perfect for making binary decisions, settling disputes, choosing between two options, 
                  or generating random binary data for various applications.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：主要功能区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 设置面板 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Coin Flip Settings</CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your coin flip parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Coins</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={numFlips}
                    onChange={(e) => setNumFlips(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 100 coins</p>
                </div>

                <Button 
                  onClick={flipCoins}
                  disabled={isFlipping}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 font-semibold text-lg py-6"
                >
                  {isFlipping ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Flipping Coins...
                    </>
                  ) : (
                    <>
                      <Coins className="h-5 w-5 mr-2" />
                      Flip {numFlips} Coin{numFlips > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 结果显示 */}
            {results.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Flip Results</CardTitle>
                  <CardDescription className="text-slate-300">
                    {numFlips} coin{numFlips > 1 ? 's' : ''} flipped
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 硬币结果 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {results.map((coin, index) => (
                      <div
                        key={index}
                        className="relative"
                      >
                        <div className={`aspect-square rounded-full shadow-lg flex items-center justify-center border-4 ${
                          coin.result === 'heads' 
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-600' 
                            : 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-600'
                        }`}>
                          <span className="text-white font-bold text-sm uppercase">
                            {coin.result}
                          </span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 历史记录 */}
            {history.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <History className="h-5 w-5" />
                    Flip History
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Your recent coin flips
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.slice(0, 20).map((flip, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Coins className="h-4 w-4 text-yellow-400" />
                          <span className={`font-bold uppercase ${
                            flip.result === 'heads' ? 'text-yellow-400' : 'text-orange-400'
                          }`}>
                            {flip.result}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {flip.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 