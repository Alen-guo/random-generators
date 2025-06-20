"use client"

import { useState, useRef } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RotateCcw, Play, Trophy, Settings, Plus, Trash2, History, Gift } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface WheelItem {
  id: number
  text: string
  color: string
  weight: number
}

interface SpinResult {
  winner: string
  timestamp: Date
  spinDuration: number
}

export default function WheelPage() {
  const containerRef = useTranslationProtection()
  const [items, setItems] = useState<WheelItem[]>([
    { id: 1, text: 'Option 1', color: '#FF6B6B', weight: 1 },
    { id: 2, text: 'Option 2', color: '#4ECDC4', weight: 1 },
    { id: 3, text: 'Option 3', color: '#45B7D1', weight: 1 },
    { id: 4, text: 'Option 4', color: '#96CEB4', weight: 1 },
    { id: 5, text: 'Option 5', color: '#FFEAA7', weight: 1 },
    { id: 6, text: 'Option 6', color: '#DDA0DD', weight: 1 }
  ])
  const [newItemText, setNewItemText] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [results, setResults] = useState<SpinResult[]>([])
  const [showWinner, setShowWinner] = useState<string | null>(null)
  const [allowEmptyResult, setAllowEmptyResult] = useState(false)
  const wheelRef = useRef<SVGGElement>(null)

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471'
  ]

  const addItem = () => {
    if (!newItemText.trim()) return
    
    const newItem: WheelItem = {
      id: Date.now(),
      text: newItemText.trim(),
      color: colors[items.length % colors.length],
      weight: 1
    }
    
    setItems([...items, newItem])
    setNewItemText('')
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItemText = (id: number, text: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, text } : item
    ))
  }

  const updateItemWeight = (id: number, weight: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, weight: Math.max(1, weight) } : item
    ))
  }

  const spin = async () => {
    if (items.length === 0 || isSpinning) return

    setIsSpinning(true)
    setShowWinner(null)
    
    const startTime = Date.now()
    
    // Calculate weighted probabilities
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    const random = Math.random() * totalWeight
    let weightSum = 0
    let selectedItem = items[0]
    
    for (const item of items) {
      weightSum += item.weight
      if (random <= weightSum) {
        selectedItem = item
        break
      }
    }

    // Calculate target rotation
    const itemAngle = 360 / items.length
    const itemIndex = items.findIndex(item => item.id === selectedItem.id)
    const targetAngle = itemIndex * itemAngle
    const spinTurns = 5 + Math.random() * 5 // 5-10 full turns
    const finalRotation = currentRotation + (spinTurns * 360) + (360 - targetAngle)
    
    setCurrentRotation(finalRotation)
    
    // Wait for animation to complete
    setTimeout(() => {
      const endTime = Date.now()
      const duration = endTime - startTime
      
      setIsSpinning(false)
      setShowWinner(selectedItem.text)
      
      // Add to results
      const newResult: SpinResult = {
        winner: selectedItem.text,
        timestamp: new Date(),
        spinDuration: duration
      }
      setResults(prev => [newResult, ...prev.slice(0, 9)]) // Keep last 10 results
    }, 3000)
  }

  const resetWheel = () => {
    if (isSpinning) return
    setCurrentRotation(0)
    setShowWinner(null)
  }

  const clearResults = () => {
    setResults([])
  }

  const loadPreset = (preset: 'yesno' | 'directions' | 'colors' | 'numbers') => {
    let newItems: Omit<WheelItem, 'id'>[] = []
    
    switch (preset) {
      case 'yesno':
        newItems = [
          { text: 'Yes', color: '#4ECDC4', weight: 1 },
          { text: 'No', color: '#FF6B6B', weight: 1 }
        ]
        break
      case 'directions':
        newItems = [
          { text: 'North', color: '#FF6B6B', weight: 1 },
          { text: 'East', color: '#4ECDC4', weight: 1 },
          { text: 'South', color: '#45B7D1', weight: 1 },
          { text: 'West', color: '#96CEB4', weight: 1 }
        ]
        break
      case 'colors':
        newItems = [
          { text: 'Red', color: '#FF6B6B', weight: 1 },
          { text: 'Blue', color: '#45B7D1', weight: 1 },
          { text: 'Green', color: '#96CEB4', weight: 1 },
          { text: 'Yellow', color: '#FFEAA7', weight: 1 },
          { text: 'Purple', color: '#DDA0DD', weight: 1 },
          { text: 'Orange', color: '#FFA07A', weight: 1 }
        ]
        break
      case 'numbers':
        newItems = Array.from({ length: 8 }, (_, i) => ({
          text: String(i + 1),
          color: colors[i % colors.length],
          weight: 1
        }))
        break
    }
    
    setItems(newItems.map((item, index) => ({
      ...item,
      id: Date.now() + index
    })))
    setCurrentRotation(0)
    setShowWinner(null)
  }

  const addBulkItems = () => {
    const bulkText = prompt('Enter items separated by commas or new lines:')
    if (!bulkText) return
    
    const lines = bulkText.split(/[,\n]/).map(line => line.trim()).filter(line => line)
    const newItems = lines.map((text, index) => ({
      id: Date.now() + index,
      text,
      color: colors[(items.length + index) % colors.length],
      weight: 1
    }))
    
    setItems([...items, ...newItems])
  }

  const getWheelSegments = () => {
    if (items.length === 0) return []
    
    const itemAngle = 360 / items.length
    
    return items.map((item, index) => {
      const startAngle = index * itemAngle
      const endAngle = (index + 1) * itemAngle
      const midAngle = (startAngle + endAngle) / 2
      
      return {
        ...item,
        startAngle,
        endAngle,
        midAngle,
        pathData: createWheelPath(startAngle, endAngle)
      }
    })
  }

  const createWheelPath = (startAngle: number, endAngle: number) => {
    const centerX = 150
    const centerY = 150
    const radius = 140
    
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    
    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  const segments = getWheelSegments()

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Prize Wheel</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Create a custom spinning wheel for random selections. Perfect for giveaways, decision making, and games.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：轮盘 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Gift className="h-5 w-5" />
                  Spin the Wheel
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {items.length} items • Click to spin
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                {/* 轮盘 */}
                <div className="relative">
                  <svg width="300" height="300" className="drop-shadow-lg">
                    {/* 轮盘背景 */}
                    <circle
                      cx="150"
                      cy="150"
                      r="145"
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth="2"
                    />
                    
                    {/* 轮盘片段 */}
                    <g
                      ref={wheelRef}
                      style={{
                        transform: `rotate(${currentRotation}deg)`,
                        transformOrigin: '150px 150px',
                        transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
                      }}
                    >
                      {segments.map((segment, index) => (
                        <g key={segment.id}>
                          <path
                            d={segment.pathData}
                            fill={segment.color}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={150 + 70 * Math.cos((segment.midAngle * Math.PI) / 180)}
                            y={150 + 70 * Math.sin((segment.midAngle * Math.PI) / 180)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="12"
                            fontWeight="bold"
                            transform={`rotate(${segment.midAngle + 90}, ${150 + 70 * Math.cos((segment.midAngle * Math.PI) / 180)}, ${150 + 70 * Math.sin((segment.midAngle * Math.PI) / 180)})`}
                          >
                            {segment.text.length > 10 ? segment.text.substring(0, 8) + '...' : segment.text}
                          </text>
                        </g>
                      ))}
                    </g>
                    
                    {/* 指针 */}
                    <polygon
                      points="150,10 160,30 140,30"
                      fill="#fbbf24"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    
                    {/* 中心圆 */}
                    <circle
                      cx="150"
                      cy="150"
                      r="15"
                      fill="#334155"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* 控制按钮 */}
                <div className="flex gap-3">
                  <Button
                    onClick={spin}
                    disabled={isSpinning || items.length === 0}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 notranslate"
                    translate="no"
                    data-interactive="true"
                  >
                    {isSpinning ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Spinning...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Spin
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={resetWheel}
                    variant="outline"
                    disabled={isSpinning}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* 获奖结果 */}
                {showWinner && (
                  <div className="w-full p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-amber-400" />
                      <span className="text-amber-100 font-medium">Winner!</span>
                    </div>
                    <div className="text-white font-bold text-xl">{showWinner}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 抽奖历史 */}
            {results.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <History className="h-5 w-5" />
                      Recent Results
                    </CardTitle>
                    <Button
                      onClick={clearResults}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                      >
                        <span className="text-white font-medium">{result.winner}</span>
                        <span className="text-xs text-slate-400">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：配置面板 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  Wheel Configuration
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Add, edit, and manage wheel items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 添加项目 */}
                <div className="flex gap-2">
                  <Input
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Enter new item..."
                    className="flex-1 bg-white/10 border-white/20 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  />
                  <Button
                    onClick={addItem}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={addBulkItems}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Bulk Add
                  </Button>
                </div>

                {/* 预设选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => loadPreset('yesno')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                    >
                      Yes/No
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => loadPreset('directions')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                    >
                      Directions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => loadPreset('colors')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                    >
                      Colors
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => loadPreset('numbers')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                    >
                      Numbers
                    </Button>
                  </div>
                </div>

                {/* 项目列表 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Current Items ({items.length})</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <Input
                          value={item.text}
                          onChange={(e) => updateItemText(item.id, e.target.value)}
                          className="flex-1 bg-white/10 border-white/20 text-white text-sm"
                        />
                        <Input
                          type="number"
                          min="1"
                          value={item.weight}
                          onChange={(e) => updateItemWeight(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 bg-white/10 border-white/20 text-white text-sm"
                          title="Weight"
                        />
                        <Button
                          onClick={() => removeItem(item.id)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {items.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      No items yet. Add some items to get started!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">1. Add Items</h4>
                    <p className="text-sm">Enter your options one by one or use bulk add for multiple items.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">2. Adjust Weights</h4>
                    <p className="text-sm">Set different weights to make some items more likely to be selected.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">3. Spin the Wheel</h4>
                    <p className="text-sm">Click the spin button and watch the wheel decide for you!</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">4. View Results</h4>
                    <p className="text-sm">Check the recent results to see the history of selections.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Prize giveaways</li>
                      <li>Random selections</li>
                      <li>Decision making</li>
                      <li>Game shows</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Team assignments</li>
                      <li>Restaurant choices</li>
                      <li>Activity selection</li>
                      <li>Educational games</li>
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