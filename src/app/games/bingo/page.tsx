"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shuffle, RotateCcw, Copy, Download, Grid3X3, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface BingoConfig {
  gridSize: number
  minNumber: number
  maxNumber: number
  freeSpace: boolean
  numberOfCards: number
  cardTitle: string
}

interface BingoCard {
  id: number
  title: string
  grid: (number | string)[][]
  numbers: number[]
}

const presets = [
  { name: 'Classic B-I-N-G-O', gridSize: 5, minNumber: 1, maxNumber: 75, freeSpace: true, title: 'BINGO' },
  { name: '3x3 Mini', gridSize: 3, minNumber: 1, maxNumber: 30, freeSpace: false, title: 'MINI BINGO' },
  { name: '4x4 Quick', gridSize: 4, minNumber: 1, maxNumber: 50, freeSpace: false, title: 'QUICK BINGO' },
  { name: '6x6 Super', gridSize: 6, minNumber: 1, maxNumber: 100, freeSpace: true, title: 'SUPER BINGO' },
]

export default function BingoPage() {
  const [config, setConfig] = useState<BingoConfig>({
    gridSize: 5,
    minNumber: 1,
    maxNumber: 75,
    freeSpace: true,
    numberOfCards: 1,
    cardTitle: 'BINGO'
  })
  
  const [bingoCards, setBingoCards] = useState<BingoCard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateBingoCards = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const cards: BingoCard[] = []
      
      for (let cardNum = 0; cardNum < config.numberOfCards; cardNum++) {
        const grid: (number | string)[][] = []
        const usedNumbers = new Set<number>()
        
        // 生成网格
        for (let row = 0; row < config.gridSize; row++) {
          const gridRow: (number | string)[] = []
          
          for (let col = 0; col < config.gridSize; col++) {
            // 检查是否是中心位置且需要免费空间
            const isCenterSpace = config.freeSpace && 
              row === Math.floor(config.gridSize / 2) && 
              col === Math.floor(config.gridSize / 2)
            
            if (isCenterSpace) {
              gridRow.push('FREE')
            } else {
              // 为每列分配不同的数字范围（如传统BINGO）
              let columnMin = config.minNumber
              let columnMax = config.maxNumber
              
              if (config.gridSize === 5 && config.maxNumber === 75) {
                // 传统BINGO分配：B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)
                const rangeSize = Math.floor((config.maxNumber - config.minNumber + 1) / config.gridSize)
                columnMin = config.minNumber + (col * rangeSize)
                columnMax = Math.min(columnMin + rangeSize - 1, config.maxNumber)
              }
              
              let number: number
              do {
                number = Math.floor(Math.random() * (columnMax - columnMin + 1)) + columnMin
              } while (usedNumbers.has(number))
              
              usedNumbers.add(number)
              gridRow.push(number)
            }
          }
          
          grid.push(gridRow)
        }
        
        cards.push({
          id: cardNum + 1,
          title: config.cardTitle,
          grid,
          numbers: Array.from(usedNumbers).sort((a, b) => a - b)
        })
      }
      
      setBingoCards(cards)
      setIsGenerating(false)
    }, 800)
  }

  const applyPreset = (preset: typeof presets[0]) => {
    setConfig({
      ...config,
      gridSize: preset.gridSize,
      minNumber: preset.minNumber,
      maxNumber: preset.maxNumber,
      freeSpace: preset.freeSpace,
      cardTitle: preset.title
    })
  }

  const copyCards = () => {
    const text = bingoCards.map(card => {
      const cardText = `${card.title} - Card ${card.id}\n`
      const gridText = card.grid.map(row => 
        row.map(cell => String(cell).padStart(4, ' ')).join(' ')
      ).join('\n')
      return cardText + gridText
    }).join('\n\n')
    
    navigator.clipboard.writeText(text)
  }

  const downloadCards = () => {
    const text = bingoCards.map(card => {
      const cardText = `${card.title} - Card ${card.id}\n`
      const gridText = card.grid.map(row => 
        row.map(cell => String(cell).padStart(4, ' ')).join(' ')
      ).join('\n')
      return cardText + gridText
    }).join('\n\n')
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bingo-cards.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printCards = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const printContent = bingoCards.map(card => `
        <div style="page-break-after: always; text-align: center; margin: 20px;">
          <h2>${card.title} - Card ${card.id}</h2>
          <table style="margin: 0 auto; border-collapse: collapse; border: 2px solid black;">
            ${card.grid.map(row => `
              <tr>
                ${row.map(cell => `
                  <td style="border: 1px solid black; width: 60px; height: 60px; text-align: center; vertical-align: middle; font-size: 18px; font-weight: bold;">
                    ${cell}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </table>
        </div>
      `).join('')

      printWindow.document.write(`
        <html>
          <head>
            <title>Bingo Cards</title>
            <style>
              body { font-family: Arial, sans-serif; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getColumnHeaders = () => {
    if (config.gridSize === 5 && config.cardTitle === 'BINGO') {
      return ['B', 'I', 'N', 'G', 'O']
    }
    return Array.from({length: config.gridSize}, (_, i) => String.fromCharCode(65 + i))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bingo Card Generator
          </h1>
          <p className="text-xl text-red-200 max-w-2xl mx-auto">
            Create custom bingo cards for your games and events. Perfect for parties, classrooms, and fundraisers!
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* 配置面板 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-red-400" />
                Bingo Card Configuration
              </CardTitle>
              <CardDescription className="text-red-200">
                Customize your bingo cards
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

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gridSize" className="text-white">Grid Size</Label>
                  <Select value={config.gridSize.toString()} onValueChange={(value: string) => setConfig({...config, gridSize: parseInt(value)})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3x3</SelectItem>
                      <SelectItem value="4">4x4</SelectItem>
                      <SelectItem value="5">5x5</SelectItem>
                      <SelectItem value="6">6x6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minNumber" className="text-white">Min Number</Label>
                  <Input
                    id="minNumber"
                    type="number"
                    min="1"
                    value={config.minNumber}
                    onChange={(e) => setConfig({...config, minNumber: parseInt(e.target.value) || 1})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxNumber" className="text-white">Max Number</Label>
                  <Input
                    id="maxNumber"
                    type="number"
                    min="1"
                    value={config.maxNumber}
                    onChange={(e) => setConfig({...config, maxNumber: parseInt(e.target.value) || 1})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfCards" className="text-white">Number of Cards</Label>
                  <Input
                    id="numberOfCards"
                    type="number"
                    min="1"
                    max="20"
                    value={config.numberOfCards}
                    onChange={(e) => setConfig({...config, numberOfCards: parseInt(e.target.value) || 1})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="freeSpace"
                    checked={config.freeSpace}
                    onChange={(e) => setConfig({...config, freeSpace: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="freeSpace" className="text-white text-sm">
                    Free Space
                  </Label>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={generateBingoCards}
                    disabled={isGenerating}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Shuffle className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardTitle" className="text-white">Card Title</Label>
                <Input
                  id="cardTitle"
                  value={config.cardTitle}
                  onChange={(e) => setConfig({...config, cardTitle: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="BINGO"
                />
              </div>
            </CardContent>
          </Card>

          {/* 生成的卡片 */}
          {bingoCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Generated Bingo Cards</CardTitle>
                      <CardDescription className="text-red-200">
                        {bingoCards.length} card{bingoCards.length > 1 ? 's' : ''} ready to play
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyCards}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadCards}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={printCards}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bingoCards.map((card) => (
                      <div key={card.id} className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white text-center mb-4">
                          {card.title} - Card {card.id}
                        </h3>
                        
                        <div className="bg-white rounded-lg p-4">
                          {/* 列标题 */}
                          <div className="grid gap-1 mb-2" style={{gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`}}>
                            {getColumnHeaders().map((header, index) => (
                              <div key={index} className="text-center font-bold text-lg text-red-600 py-2">
                                {header}
                              </div>
                            ))}
                          </div>
                          
                          {/* 网格 */}
                          <div className="grid gap-1 border-2 border-gray-800" style={{gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`}}>
                            {card.grid.flat().map((cell, index) => (
                              <div
                                key={index}
                                className={`
                                  aspect-square flex items-center justify-center border border-gray-800 font-bold text-lg
                                  ${cell === 'FREE' ? 'bg-red-100 text-red-600' : 'bg-white text-gray-800'}
                                `}
                              >
                                {cell}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}