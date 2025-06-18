"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShuffleIcon, RefreshCw, Copy, Download, List, Trash2, Plus, ArrowUpDown } from 'lucide-react'

interface ListItem {
  id: number
  text: string
  originalIndex: number
}

export default function ListRandomizerPage() {
  const [inputText, setInputText] = useState('')
  const [items, setItems] = useState<ListItem[]>([])
  const [shuffledItems, setShuffledItems] = useState<ListItem[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [removeBlankLines, setRemoveBlankLines] = useState(true)
  const [removeDuplicates, setRemoveDuplicates] = useState(false)

  const parseItems = () => {
    let lines = inputText.split('\n')
    
    if (removeBlankLines) {
      lines = lines.filter(line => line.trim() !== '')
    }
    
    if (removeDuplicates) {
      lines = [...new Set(lines)]
    }
    
    const newItems: ListItem[] = lines.map((line, index) => ({
      id: Date.now() + index,
      text: line.trim(),
      originalIndex: index + 1
    }))
    
    setItems(newItems)
  }

  const shuffleList = async () => {
    if (items.length === 0) {
      parseItems()
      return
    }
    
    setIsShuffling(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    setShuffledItems(shuffled)
    setIsShuffling(false)
  }

  const addSampleData = (type: 'names' | 'colors' | 'countries' | 'numbers') => {
    const samples = {
      names: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'],
      colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Cyan', 'Magenta', 'Lime'],
      countries: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India', 'China'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    }
    
    setInputText(samples[type].join('\n'))
  }

  const copyResults = (format: 'numbered' | 'plain' | 'csv') => {
    let text = ''
    
    switch (format) {
      case 'numbered':
        text = shuffledItems.map((item, index) => `${index + 1}. ${item.text}`).join('\n')
        break
      case 'plain':
        text = shuffledItems.map(item => item.text).join('\n')
        break
      case 'csv':
        text = shuffledItems.map(item => `"${item.text}"`).join(',\n')
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const text = shuffledItems.map((item, index) => `${index + 1}. ${item.text}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'shuffled-list.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInputText('')
    setItems([])
    setShuffledItems([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <ShuffleIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">List Randomizer</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Randomize any list of items. Perfect for shuffling names, creating random orders, or organizing data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <List className="h-5 w-5" />
                  Input Your List
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Enter items one per line, or use sample data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">List Items</Label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your list items here, one per line..."
                    rows={12}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 focus:outline-none resize-y"
                  />
                  <p className="text-xs text-slate-400">
                    {inputText.split('\n').filter(line => line.trim() !== '').length} items
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-300">Options</Label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={removeBlankLines}
                      onChange={(e) => setRemoveBlankLines(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <span className="text-white">Remove blank lines</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={removeDuplicates}
                      onChange={(e) => setRemoveDuplicates(e.target.checked)}
                      className="rounded accent-orange-500"
                    />
                    <span className="text-white">Remove duplicates</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={shuffleList}
                    disabled={isShuffling || inputText.trim() === ''}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold"
                  >
                    {isShuffling ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Shuffling...
                      </>
                    ) : (
                      <>
                        <ShuffleIcon className="h-4 w-4 mr-2" />
                        Randomize List
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 示例数据 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Sample Data</CardTitle>
                <CardDescription className="text-slate-300">
                  Click to load sample lists for testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => addSampleData('names')}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Names
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addSampleData('colors')}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Colors
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addSampleData('countries')}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Countries
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addSampleData('numbers')}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Numbers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果区域 */}
          <div className="space-y-6">
            {shuffledItems.length > 0 && (
              <>
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <ArrowUpDown className="h-5 w-5" />
                          Randomized List
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {shuffledItems.length} items shuffled
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResults('numbered')}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadResults}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {shuffledItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 text-white">{item.text}</div>
                          <div className="text-xs text-slate-400">
                            was #{item.originalIndex}
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
                      Copy results in different formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => copyResults('numbered')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Numbered List
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('plain')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Plain Text
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
                <CardTitle className="text-white">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">1. Enter Your List</h4>
                    <p className="text-sm">Type or paste your items, one per line</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">2. Configure Options</h4>
                    <p className="text-sm">Choose whether to remove blanks or duplicates</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">3. Randomize</h4>
                    <p className="text-sm">Click "Randomize List" to shuffle your items</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">4. Export Results</h4>
                    <p className="text-sm">Copy or download your shuffled list</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Use Cases:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Randomize participant order for presentations</li>
                    <li>Shuffle playlist or reading lists</li>
                    <li>Create random team assignments</li>
                    <li>Randomize survey questions</li>
                    <li>Generate random sampling orders</li>
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