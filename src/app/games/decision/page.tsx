"use client"

import { useState, useRef } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RotateCcw, RefreshCw, Plus, Trash2, Settings, Play, Copy, Download } from 'lucide-react'

interface WheelOption {
  id: string
  text: string
  weight: number
  color: string
}

interface SpinResult {
  option: WheelOption
  spinAngle: number
  timestamp: Date
  spinNumber: number
}

export default function DecisionPage() {
  const [options, setOptions] = useState<WheelOption[]>([
    { id: '1', text: 'Option 1', weight: 1, color: '#FF6B6B' },
    { id: '2', text: 'Option 2', weight: 1, color: '#4ECDC4' },
    { id: '3', text: 'Option 3', weight: 1, color: '#45B7D1' },
    { id: '4', text: 'Option 4', weight: 1, color: '#FFA07A' }
  ])
  const [newOption, setNewOption] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null)
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(3)
  const [spinCount, setSpinCount] = useState(0)
  
  const wheelRef = useRef<HTMLDivElement>(null)

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#AED6F1'
  ]

  const addOption = () => {
    if (newOption.trim() && options.length < 12) {
      const newId = Date.now().toString()
      const colorIndex = options.length % colors.length
      setOptions([...options, {
        id: newId,
        text: newOption.trim(),
        weight: 1,
        color: colors[colorIndex]
      }])
      setNewOption('')
    }
  }

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const updateOption = (id: string, updates: Partial<WheelOption>) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, ...updates } : opt
    ))
  }

  const calculateSegments = () => {
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0)
    let currentAngle = 0
    
    return options.map(option => {
      const segmentAngle = (option.weight / totalWeight) * 360
      const segment = {
        ...option,
        startAngle: currentAngle,
        endAngle: currentAngle + segmentAngle,
        angle: segmentAngle
      }
      currentAngle += segmentAngle
      return segment
    })
  }

  const selectWeightedOption = () => {
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0)
    let random = Math.random() * totalWeight
    
    for (const option of options) {
      random -= option.weight
      if (random <= 0) {
        return option
      }
    }
    return options[0]
  }

  const spinWheel = async () => {
    if (isSpinning || options.length < 2) return
    
    setIsSpinning(true)
    const selectedOption = selectWeightedOption()
    const segments = calculateSegments()
    const targetSegment = segments.find(seg => seg.id === selectedOption.id)
    
    if (!targetSegment) return
    
    // Calculate target angle to land on the selected option
    const segmentCenter = targetSegment.startAngle + (targetSegment.angle / 2)
    const baseSpins = 3 + (animationSpeed * 2) // More spins based on speed
    const targetAngle = (baseSpins * 360) + (360 - segmentCenter)
    
    // Apply rotation to wheel
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${2 + animationSpeed}s cubic-bezier(0.23, 1, 0.32, 1)`
      wheelRef.current.style.transform = `rotate(${targetAngle}deg)`
    }
    
    // Wait for animation to complete
    setTimeout(() => {
      const newSpinCount = spinCount + 1
      const result: SpinResult = {
        option: selectedOption,
        spinAngle: targetAngle,
        timestamp: new Date(),
        spinNumber: newSpinCount
      }
      
      setCurrentResult(result)
      setSpinHistory([result, ...spinHistory.slice(0, 9)]) // Keep last 10 results
      setSpinCount(newSpinCount)
      setIsSpinning(false)
    }, (2 + animationSpeed) * 1000)
  }

  const resetWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none'
      wheelRef.current.style.transform = 'rotate(0deg)'
    }
    setCurrentResult(null)
    setTimeout(() => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = ''
      }
    }, 50)
  }

  const loadPreset = (preset: 'yesno' | 'food' | 'activities' | 'directions') => {
    let newOptions: WheelOption[] = []
    
    switch (preset) {
      case 'yesno':
        newOptions = [
          { id: '1', text: 'Yes', weight: 1, color: '#4ECDC4' },
          { id: '2', text: 'No', weight: 1, color: '#FF6B6B' }
        ]
        break
      case 'food':
        newOptions = [
          { id: '1', text: 'Pizza', weight: 1, color: '#FF6B6B' },
          { id: '2', text: 'Burger', weight: 1, color: '#4ECDC4' },
          { id: '3', text: 'Sushi', weight: 1, color: '#45B7D1' },
          { id: '4', text: 'Pasta', weight: 1, color: '#FFA07A' },
          { id: '5', text: 'Tacos', weight: 1, color: '#98D8C8' },
          { id: '6', text: 'Salad', weight: 1, color: '#F7DC6F' }
        ]
        break
      case 'activities':
        newOptions = [
          { id: '1', text: 'Watch Movie', weight: 1, color: '#BB8FCE' },
          { id: '2', text: 'Go for Walk', weight: 1, color: '#85C1E9' },
          { id: '3', text: 'Read Book', weight: 1, color: '#F8C471' },
          { id: '4', text: 'Play Games', weight: 1, color: '#82E0AA' },
          { id: '5', text: 'Listen Music', weight: 1, color: '#F1948A' },
          { id: '6', text: 'Exercise', weight: 1, color: '#AED6F1' }
        ]
        break
      case 'directions':
        newOptions = [
          { id: '1', text: 'North', weight: 1, color: '#FF6B6B' },
          { id: '2', text: 'South', weight: 1, color: '#4ECDC4' },
          { id: '3', text: 'East', weight: 1, color: '#45B7D1' },
          { id: '4', text: 'West', weight: 1, color: '#FFA07A' }
        ]
        break
    }
    
    setOptions(newOptions)
    resetWheel()
  }

  const copyResult = () => {
    if (currentResult) {
      navigator.clipboard.writeText(`Decision: ${currentResult.option.text}`)
    }
  }

  const downloadHistory = () => {
    if (spinHistory.length === 0) return
    
    const content = spinHistory.map((result, index) => 
      `${result.spinNumber}. ${result.option.text} - ${result.timestamp.toLocaleString()}`
    ).join('\n')
    
    const header = `Decision Wheel History\nTotal Spins: ${spinHistory.length}\n\n`
    const blob = new Blob([header + content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `decision-history-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const segments = calculateSegments()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <RotateCcw className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Decision Wheel</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Make decisions easily with a customizable spinning wheel. Add your options, set weights, and let fate decide!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：轮盘和控制 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 决策轮盘 */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-6">
                  {/* 轮盘 */}
                  <div className="relative">
                    <div className="w-80 h-80 relative">
                      {/* 指针 */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white"></div>
                      </div>
                      
                      {/* 轮盘 */}
                      <div
                        ref={wheelRef}
                        className="w-full h-full rounded-full border-4 border-white/20 relative overflow-hidden shadow-2xl"
                      >
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          {segments.map((segment, index) => {
                            const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180)
                            const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180)
                            const largeArc = segment.angle > 180 ? 1 : 0
                            
                            const x1 = 100 + 95 * Math.cos(startAngleRad)
                            const y1 = 100 + 95 * Math.sin(startAngleRad)
                            const x2 = 100 + 95 * Math.cos(endAngleRad)
                            const y2 = 100 + 95 * Math.sin(endAngleRad)
                            
                            const pathData = [
                              `M 100 100`,
                              `L ${x1} ${y1}`,
                              `A 95 95 0 ${largeArc} 1 ${x2} ${y2}`,
                              'Z'
                            ].join(' ')
                            
                            const textAngle = segment.startAngle + (segment.angle / 2) - 90
                            const textRadius = 65
                            const textX = 100 + textRadius * Math.cos(textAngle * (Math.PI / 180))
                            const textY = 100 + textRadius * Math.sin(textAngle * (Math.PI / 180))
                            
                            return (
                              <g key={segment.id}>
                                <path
                                  d={pathData}
                                  fill={segment.color}
                                  stroke="white"
                                  strokeWidth="1"
                                />
                                <text
                                  x={textX}
                                  y={textY}
                                  fill="white"
                                  fontSize="12"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                                >
                                  {segment.text.length > 8 ? segment.text.substring(0, 8) + '...' : segment.text}
                                </text>
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* 控制按钮 */}
                  <div className="flex gap-4">
                    <Button
                      onClick={spinWheel}
                      disabled={isSpinning || options.length < 2}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold px-8 py-3"
                    >
                      {isSpinning ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                          Spinning...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Spin the Wheel
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={resetWheel}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* 结果显示 */}
                  {currentResult && (
                    <div className="text-center p-6 bg-white/10 rounded-lg border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-2">Result:</h3>
                      <div 
                        className="text-4xl font-bold mb-2"
                        style={{ color: currentResult.option.color }}
                      >
                        {currentResult.option.text}
                      </div>
                      <div className="text-slate-400 text-sm mb-3">
                        Spin #{currentResult.spinNumber} • {currentResult.timestamp.toLocaleTimeString()}
                      </div>
                      <Button
                        onClick={copyResult}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Result
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 历史记录 */}
            {spinHistory.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Spin History</CardTitle>
                      <CardDescription className="text-slate-300">
                        {spinHistory.length} recent spins
                      </CardDescription>
                    </div>
                    <Button
                      onClick={downloadHistory}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {spinHistory.map((result, index) => (
                      <div
                        key={`${result.spinNumber}-${index}`}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: result.option.color }}
                          />
                          <span className="text-white font-medium">{result.option.text}</span>
                        </div>
                        <div className="text-slate-400 text-sm">
                          #{result.spinNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：选项配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="h-5 w-5" />
                    Options ({options.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowSettings(!showSettings)}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-slate-300">
                  Add and configure wheel options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 添加选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Add New Option</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Enter option text"
                      className="bg-white/10 border-white/20 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addOption()}
                      maxLength={20}
                    />
                    <Button
                      onClick={addOption}
                      disabled={!newOption.trim() || options.length >= 12}
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 选项列表 */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {options.map((option, index) => (
                    <div key={option.id} className="p-3 bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                          <Input
                            value={option.text}
                            onChange={(e) => updateOption(option.id, { text: e.target.value })}
                            className="bg-transparent border-none text-white text-sm p-0 h-auto"
                            maxLength={20}
                          />
                        </div>
                        <Button
                          onClick={() => removeOption(option.id)}
                          disabled={options.length <= 2}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {showSettings && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-slate-400 text-xs">Weight:</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={option.weight}
                              onChange={(e) => updateOption(option.id, { 
                                weight: Math.max(1, parseInt(e.target.value) || 1) 
                              })}
                              className="bg-white/10 border-white/20 text-white text-xs h-6 w-16"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-slate-400 text-xs">Color:</Label>
                            <input
                              type="color"
                              value={option.color}
                              onChange={(e) => updateOption(option.id, { color: e.target.value })}
                              className="w-8 h-6 rounded border border-white/20"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 动画设置 */}
                {showSettings && (
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <Label className="text-slate-300">Animation Speed</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Fast</span>
                      <Input
                        type="range"
                        min="1"
                        max="5"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs text-slate-400">Slow</span>
                    </div>
                  </div>
                )}

                {/* 快速预设 */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('yesno')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      Yes/No
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('food')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      Food
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('activities')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      Activities
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('directions')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-white text-sm">Getting Started</h4>
                  <p className="text-xs">Add your options, adjust weights if needed, and spin the wheel to make decisions randomly.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white text-sm">Weights</h4>
                  <p className="text-xs">Higher weight values make options more likely to be selected. Default weight is 1 for all options.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white text-sm">Perfect For</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Making tough decisions</li>
                    <li>Choosing restaurants</li>
                    <li>Team assignments</li>
                    <li>Game selections</li>
                    <li>Activity planning</li>
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