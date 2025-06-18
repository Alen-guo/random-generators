"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shuffle, RotateCcw, Copy, Download, Spade, Heart, Club, Diamond } from 'lucide-react'
import { motion } from 'framer-motion'

interface PlayingCard {
  suit: 'spades' | 'hearts' | 'clubs' | 'diamonds'
  rank: string
  value: number
  color: 'red' | 'black'
}

interface DeckConfig {
  includeJokers: boolean
  numberOfDecks: number
  shuffleMethod: 'random' | 'riffle' | 'overhand'
}

const suits = [
  { name: 'spades', symbol: '♠', color: 'black' as const, icon: Spade },
  { name: 'hearts', symbol: '♥', color: 'red' as const, icon: Heart },
  { name: 'clubs', symbol: '♣', color: 'black' as const, icon: Club },
  { name: 'diamonds', symbol: '♦', color: 'red' as const, icon: Diamond },
]

const ranks = [
  { name: 'A', value: 1 }, { name: '2', value: 2 }, { name: '3', value: 3 },
  { name: '4', value: 4 }, { name: '5', value: 5 }, { name: '6', value: 6 },
  { name: '7', value: 7 }, { name: '8', value: 8 }, { name: '9', value: 9 },
  { name: '10', value: 10 }, { name: 'J', value: 11 }, { name: 'Q', value: 12 }, { name: 'K', value: 13 }
]

export default function CardsPage() {
  const [config, setConfig] = useState<DeckConfig>({
    includeJokers: false,
    numberOfDecks: 1,
    shuffleMethod: 'random'
  })
  
  const [shuffledDeck, setShuffledDeck] = useState<PlayingCard[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [drawnCards, setDrawnCards] = useState<PlayingCard[]>([])

  const createDeck = (): PlayingCard[] => {
    const deck: PlayingCard[] = []
    
    for (let deckNum = 0; deckNum < config.numberOfDecks; deckNum++) {
      // 标准52张牌
      for (const suit of suits) {
        for (const rank of ranks) {
          deck.push({
            suit: suit.name as PlayingCard['suit'],
            rank: rank.name,
            value: rank.value,
            color: suit.color
          })
        }
      }
      
      // 添加大小王
      if (config.includeJokers) {
        deck.push({
          suit: 'spades',
          rank: 'Joker',
          value: 14,
          color: 'red'
        })
        deck.push({
          suit: 'hearts',
          rank: 'Joker',
          value: 15,
          color: 'black'
        })
      }
    }
    
    return deck
  }

  const shuffleDeck = () => {
    setIsShuffling(true)
    const deck = createDeck()
    
    setTimeout(() => {
      let shuffled = [...deck]
      
      switch (config.shuffleMethod) {
        case 'random':
          // Fisher-Yates shuffle
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }
          break
          
        case 'riffle':
          // 模拟riffle洗牌
          const mid = Math.floor(shuffled.length / 2)
          const left = shuffled.slice(0, mid)
          const right = shuffled.slice(mid)
          shuffled = []
          
          let i = 0, j = 0
          while (i < left.length && j < right.length) {
            if (Math.random() < 0.5) {
              shuffled.push(left[i++])
            } else {
              shuffled.push(right[j++])
            }
          }
          shuffled.push(...left.slice(i), ...right.slice(j))
          break
          
        case 'overhand':
          // 模拟overhand洗牌
          for (let round = 0; round < 7; round++) {
            const chunks = []
            let start = 0
            while (start < shuffled.length) {
              const chunkSize = Math.floor(Math.random() * 10) + 5
              chunks.push(shuffled.slice(start, start + chunkSize))
              start += chunkSize
            }
            shuffled = chunks.reverse().flat()
          }
          break
      }
      
      setShuffledDeck(shuffled)
      setDrawnCards([])
      setIsShuffling(false)
    }, 1000)
  }

  const drawCard = () => {
    if (shuffledDeck.length > 0) {
      const card = shuffledDeck[0]
      setDrawnCards([...drawnCards, card])
      setShuffledDeck(shuffledDeck.slice(1))
    }
  }

  const drawMultipleCards = (count: number) => {
    const cardsToDraw = shuffledDeck.slice(0, count)
    setDrawnCards([...drawnCards, ...cardsToDraw])
    setShuffledDeck(shuffledDeck.slice(count))
  }

  const resetDeck = () => {
    setShuffledDeck([])
    setDrawnCards([])
  }

  const copyDeck = () => {
    const text = shuffledDeck.map(card => `${card.rank} of ${card.suit}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  const downloadDeck = () => {
    const text = shuffledDeck.map(card => `${card.rank} of ${card.suit}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shuffled-deck.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSuitIcon = (suit: PlayingCard['suit']) => {
    const suitData = suits.find(s => s.name === suit)
    if (!suitData) return null
    const IconComponent = suitData.icon
    return <IconComponent className={`h-4 w-4 ${suitData.color === 'red' ? 'text-red-500' : 'text-gray-800'}`} />
  }

  const getSuitSymbol = (suit: PlayingCard['suit']) => {
    return suits.find(s => s.name === suit)?.symbol || ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-teal-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Playing Card Shuffler
          </h1>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            Shuffle and deal playing cards with various shuffling methods. Perfect for card games and magic tricks!
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* 配置面板 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Spade className="h-5 w-5 text-green-400" />
                Deck Configuration
              </CardTitle>
              <CardDescription className="text-green-200">
                Customize your deck and shuffling preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Number of Decks</label>
                  <Select value={config.numberOfDecks.toString()} onValueChange={(value: string) => setConfig({...config, numberOfDecks: parseInt(value)})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Deck (52 cards)</SelectItem>
                      <SelectItem value="2">2 Decks (104 cards)</SelectItem>
                      <SelectItem value="4">4 Decks (208 cards)</SelectItem>
                      <SelectItem value="6">6 Decks (312 cards)</SelectItem>
                      <SelectItem value="8">8 Decks (416 cards)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Shuffle Method</label>
                  <Select value={config.shuffleMethod} onValueChange={(value: DeckConfig['shuffleMethod']) => setConfig({...config, shuffleMethod: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random Shuffle</SelectItem>
                      <SelectItem value="riffle">Riffle Shuffle</SelectItem>
                      <SelectItem value="overhand">Overhand Shuffle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="jokers"
                    checked={config.includeJokers}
                    onChange={(e) => setConfig({...config, includeJokers: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="jokers" className="text-white text-sm font-medium">
                    Include Jokers
                  </label>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={shuffleDeck}
                    disabled={isShuffling}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isShuffling ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Shuffle className="h-4 w-4 mr-2" />
                        Shuffle Deck
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 牌组信息 */}
          {shuffledDeck.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Shuffled Deck</CardTitle>
                    <CardDescription className="text-green-200">
                      {shuffledDeck.length} cards remaining • {drawnCards.length} cards drawn
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={drawCard}
                      disabled={shuffledDeck.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Draw 1
                    </Button>
                    <Button
                      onClick={() => drawMultipleCards(5)}
                      disabled={shuffledDeck.length < 5}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Draw 5
                    </Button>
                    <Button
                      onClick={resetDeck}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 顶部的牌 */}
                {shuffledDeck.length > 0 && (
                  <div className="text-center">
                    <h3 className="text-white mb-2">Next Card:</h3>
                    <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                      <div className={`text-2xl font-bold ${shuffledDeck[0].color === 'red' ? 'text-red-500' : 'text-gray-800'}`}>
                        {shuffledDeck[0].rank}
                        <br />
                        {getSuitSymbol(shuffledDeck[0].suit)}
                      </div>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={copyDeck}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Deck
                  </Button>
                  <Button
                    onClick={downloadDeck}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 已抽取的牌 */}
          {drawnCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Drawn Cards</CardTitle>
                  <CardDescription className="text-green-200">
                    Cards that have been drawn from the deck
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {drawnCards.map((card, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 shadow-lg text-center">
                        <div className={`font-bold ${card.color === 'red' ? 'text-red-500' : 'text-gray-800'}`}>
                          {card.rank}
                        </div>
                        <div className={`text-xl ${card.color === 'red' ? 'text-red-500' : 'text-gray-800'}`}>
                          {getSuitSymbol(card.suit)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 完整牌组预览 */}
          {shuffledDeck.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Full Deck Order</CardTitle>
                <CardDescription className="text-green-200">
                  Complete shuffled deck order (click to reveal)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <details className="text-white">
                  <summary className="cursor-pointer hover:text-green-300">
                    Click to show all {shuffledDeck.length} cards in order
                  </summary>
                  <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {shuffledDeck.map((card, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`${card.color === 'red' ? 'border-red-400 text-red-300' : 'border-gray-400 text-gray-300'} bg-white/10`}
                      >
                        {card.rank}{getSuitSymbol(card.suit)}
                      </Badge>
                    ))}
                  </div>
                </details>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}