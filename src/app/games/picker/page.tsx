"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Target, Sparkles, RefreshCw, Copy, Download, Plus, Trash2, History, Zap } from 'lucide-react'

interface PickerItem {
  id: number
  text: string
  weight: number
  color: string
}

interface PickResult {
  item: string
  timestamp: Date
  fromList: string
}

export default function PickerPage() {
  const [items, setItems] = useState<PickerItem[]>([
    { id: 1, text: 'Option 1', weight: 1, color: '#FF6B6B' },
    { id: 2, text: 'Option 2', weight: 1, color: '#4ECDC4' },
    { id: 3, text: 'Option 3', weight: 1, color: '#45B7D1' }
  ])
  const [newItemText, setNewItemText] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [results, setResults] = useState<PickResult[]>([])
  const [pickCount, setPickCount] = useState(1)
  const [allowDuplicates, setAllowDuplicates] = useState(true)

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471'
  ]

  const addItem = () => {
    if (!newItemText.trim()) return
    
    const newItem: PickerItem = {
      id: Date.now(),
      text: newItemText.trim(),
      weight: 1,
      color: colors[items.length % colors.length]
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

  const pickRandom = async () => {
    if (items.length === 0) return

    setIsAnimating(true)
    setSelectedItem(null)

    // Animation effect
    for (let i = 0; i < 10; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)]
      setSelectedItem(randomItem.text)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Final selection with weighted probability
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    const pickedItems: string[] = []
    let availableItems = [...items]

    for (let pick = 0; pick < pickCount; pick++) {
      if (availableItems.length === 0) break

      const currentTotalWeight = availableItems.reduce((sum, item) => sum + item.weight, 0)
      const random = Math.random() * currentTotalWeight
      let weightSum = 0
      let selectedItemObj = availableItems[0]

      for (const item of availableItems) {
        weightSum += item.weight
        if (random <= weightSum) {
          selectedItemObj = item
          break
        }
      }

      pickedItems.push(selectedItemObj.text)

      // Remove from available items if duplicates not allowed
      if (!allowDuplicates) {
        availableItems = availableItems.filter(item => item.id !== selectedItemObj.id)
      }

      // Add to results
      const newResult: PickResult = {
        item: selectedItemObj.text,
        timestamp: new Date(),
        fromList: `${items.length} items`
      }
      setResults(prev => [newResult, ...prev.slice(0, 19)]) // Keep last 20 results
    }

    setSelectedItem(pickedItems.join(', '))
    setIsAnimating(false)
  }

  const loadPreset = (preset: 'yesno' | 'directions' | 'meals' | 'activities') => {
    let newItems: Omit<PickerItem, 'id'>[] = []
    
    switch (preset) {
      case 'yesno':
        newItems = [
          { text: 'Yes', weight: 1, color: '#4ECDC4' },
          { text: 'No', weight: 1, color: '#FF6B6B' },
          { text: 'Maybe', weight: 1, color: '#FFEAA7' }
        ]
        break
      case 'directions':
        newItems = [
          { text: 'North', weight: 1, color: '#FF6B6B' },
          { text: 'East', weight: 1, color: '#4ECDC4' },
          { text: 'South', weight: 1, color: '#45B7D1' },
          { text: 'West', weight: 1, color: '#96CEB4' }
        ]
        break
      case 'meals':
        newItems = [
          { text: 'Pizza', weight: 1, color: '#FF6B6B' },
          { text: 'Chinese Food', weight: 1, color: '#4ECDC4' },
          { text: 'Italian', weight: 1, color: '#45B7D1' },
          { text: 'Mexican', weight: 1, color: '#96CEB4' },
          { text: 'Burger', weight: 1, color: '#FFEAA7' },
          { text: 'Sushi', weight: 1, color: '#DDA0DD' },
          { text: 'Thai Food', weight: 1, color: '#FFA07A' },
          { text: 'Indian', weight: 1, color: '#98D8C8' }
        ]
        break
      case 'activities':
        newItems = [
          { text: 'Watch a Movie', weight: 1, color: '#FF6B6B' },
          { text: 'Go for a Walk', weight: 1, color: '#4ECDC4' },
          { text: 'Read a Book', weight: 1, color: '#45B7D1' },
          { text: 'Play Games', weight: 1, color: '#96CEB4' },
          { text: 'Listen to Music', weight: 1, color: '#FFEAA7' },
          { text: 'Exercise', weight: 1, color: '#DDA0DD' },
          { text: 'Call a Friend', weight: 1, color: '#FFA07A' },
          { text: 'Take a Nap', weight: 1, color: '#98D8C8' }
        ]
        break
    }
    
    setItems(newItems.map((item, index) => ({
      ...item,
      id: Date.now() + index
    })))
    setSelectedItem(null)
  }

  const addBulkItems = () => {
    const bulkText = prompt('Enter items separated by commas or new lines:')
    if (!bulkText) return
    
    const lines = bulkText.split(/[,\n]/).map(line => line.trim()).filter(line => line)
    const newItems = lines.map((text, index) => ({
      id: Date.now() + index,
      text,
      weight: 1,
      color: colors[(items.length + index) % colors.length]
    }))
    
    setItems([...items, ...newItems])
  }

  const clearResults = () => {
    setResults([])
  }

  const copyResults = () => {
    const text = results.map(r => `${r.item} (${r.timestamp.toLocaleString()})`).join('\n')
    navigator.clipboard.writeText(text)
  }

  const getItemByText = (text: string) => {
    return items.find(item => item.text === text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Random Picker</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Make decisions effortlessly! Add your options and let randomness choose for you. Perfect for decisions, games, and selections.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：选择结果 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" />
                  Random Selection
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {items.length} items • Click to pick
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 选择结果显示 */}
                <div className="text-center">
                  <div className="h-32 flex items-center justify-center">
                    {selectedItem ? (
                      <div 
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          isAnimating ? 'animate-pulse' : 'animate-bounce'
                        }`}
                        style={{
                          backgroundColor: getItemByText(selectedItem.split(', ')[0])?.color + '20' || '#8B5CF6' + '20',
                          borderColor: getItemByText(selectedItem.split(', ')[0])?.color || '#8B5CF6'
                        }}
                      >
                        <div className="text-white font-bold text-xl text-center break-words">
                          {selectedItem}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-center">
                        <Target className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p>Click "Pick Random" to select</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 选择设置 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Pick Count</Label>
                      <Input
                        type="number"
                        min={1}
                        max={Math.min(10, items.length)}
                        value={pickCount}
                        onChange={(e) => setPickCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Options</Label>
                      <label className="flex items-center space-x-2 mt-2">
                        <input
                          type="checkbox"
                          checked={allowDuplicates}
                          onChange={(e) => setAllowDuplicates(e.target.checked)}
                          className="rounded accent-violet-500"
                        />
                        <span className="text-white text-sm">Allow duplicates</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={pickRandom}
                    disabled={isAnimating || items.length === 0}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 font-semibold"
                  >
                    {isAnimating ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Picking...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Pick Random
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 选择历史 */}
            {results.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <History className="h-5 w-5" />
                      Recent Picks
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyResults}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={clearResults}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {results.slice(0, 10).map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                      >
                        <span className="text-white font-medium">{result.item}</span>
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

          {/* 右侧：选项管理 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Picker Options</CardTitle>
                <CardDescription className="text-slate-300">
                  Add, edit, and manage your options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 添加选项 */}
                <div className="flex gap-2">
                  <Input
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Enter new option..."
                    className="flex-1 bg-white/10 border-white/20 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  />
                  <Button
                    onClick={addItem}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0"
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
                      Yes/No/Maybe
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
                      onClick={() => loadPreset('meals')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                    >
                      Food Options
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => loadPreset('activities')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                    >
                      Activities
                    </Button>
                  </div>
                </div>

                {/* 选项列表 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Current Options ({items.length})</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div
                          className="w-4 h-4 rounded-full"
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
                          title="Weight (higher = more likely)"
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
                      No options yet. Add some options to get started!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">How to Use Random Picker</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">1. Add Options</h4>
                    <p className="text-sm">Enter your choices one by one or use bulk add for multiple items.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">2. Set Weights</h4>
                    <p className="text-sm">Adjust weights to make some options more likely to be selected.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">3. Configure Settings</h4>
                    <p className="text-sm">Choose how many items to pick and whether to allow duplicates.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">4. Pick Random</h4>
                    <p className="text-sm">Click the button and let randomness decide for you!</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Making difficult decisions</li>
                      <li>Choosing what to eat</li>
                      <li>Picking activities</li>
                      <li>Game show style selections</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Classroom random selections</li>
                      <li>Gift exchange assignments</li>
                      <li>Breaking ties</li>
                      <li>Random sampling</li>
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