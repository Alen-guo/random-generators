"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Shuffle, RotateCcw, Copy, Download, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface BracketConfig {
  tournamentName: string
  bracketType: 'single' | 'double'
  seedingMethod: 'random' | 'seeded' | 'manual'
  numberOfRounds: number
}

interface Match {
  id: string
  round: number
  position: number
  player1: string | null
  player2: string | null
  winner: string | null
  isBye: boolean
}

interface Bracket {
  matches: Match[]
  rounds: number
  totalPlayers: number
}

export default function BracketPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<BracketConfig>({
    tournamentName: 'Tournament',
    bracketType: 'single',
    seedingMethod: 'random',
    numberOfRounds: 0
  })
  
  const [playerList, setPlayerList] = useState('')
  const [bracket, setBracket] = useState<Bracket | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateBracket = () => {
    const players = playerList.split('\n').filter(p => p.trim()).map(p => p.trim())
    
    if (players.length < 2) {
      alert('Please enter at least 2 players')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      // 计算需要的轮数
      const rounds = Math.ceil(Math.log2(players.length))
      const totalSlots = Math.pow(2, rounds)
      
      // 准备参赛者列表
      let participants = [...players]
      
      // 根据种子设定方法排序
      if (config.seedingMethod === 'random') {
        // 随机洗牌
        for (let i = participants.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[participants[i], participants[j]] = [participants[j], participants[i]]
        }
      }
      
      // 填充空位(轮空)
      while (participants.length < totalSlots) {
        participants.push('BYE')
      }

      // 生成第一轮比赛
      const matches: Match[] = []
      let matchId = 1

      // 第一轮
      for (let i = 0; i < participants.length; i += 2) {
        const player1 = participants[i] === 'BYE' ? null : participants[i]
        const player2 = participants[i + 1] === 'BYE' ? null : participants[i + 1]
        const isBye = player1 === null || player2 === null
        
        matches.push({
          id: `round1-match${matchId}`,
          round: 1,
          position: matchId,
          player1,
          player2,
          winner: isBye ? (player1 || player2) : null,
          isBye
        })
        matchId++
      }

      // 生成后续轮次的空比赛
      for (let round = 2; round <= rounds; round++) {
        const matchesInRound = Math.pow(2, rounds - round)
        for (let i = 0; i < matchesInRound; i++) {
          matches.push({
            id: `round${round}-match${i + 1}`,
            round,
            position: i + 1,
            player1: null,
            player2: null,
            winner: null,
            isBye: false
          })
        }
      }

      setBracket({
        matches,
        rounds,
        totalPlayers: players.length
      })
      
      setIsGenerating(false)
    }, 800)
  }

  const addSamplePlayers = () => {
    const samplePlayers = [
      'Player 1', 'Player 2', 'Player 3', 'Player 4',
      'Player 5', 'Player 6', 'Player 7', 'Player 8'
    ]
    setPlayerList(samplePlayers.join('\n'))
  }

  const copyBracket = () => {
    if (!bracket) return
    
    let text = `${config.tournamentName}\n${'='.repeat(config.tournamentName.length)}\n\n`
    
    for (let round = 1; round <= bracket.rounds; round++) {
      const roundMatches = bracket.matches.filter(m => m.round === round)
      text += `Round ${round}${round === bracket.rounds ? ' (Final)' : ''}:\n`
      
      roundMatches.forEach(match => {
        const p1 = match.player1 || 'TBD'
        const p2 = match.player2 || 'TBD'
        const winner = match.winner ? ` -> Winner: ${match.winner}` : ''
        text += `  ${p1} vs ${p2}${winner}\n`
      })
      text += '\n'
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadBracket = () => {
    if (!bracket) return
    
    let text = `${config.tournamentName}\n${'='.repeat(config.tournamentName.length)}\n\n`
    
    for (let round = 1; round <= bracket.rounds; round++) {
      const roundMatches = bracket.matches.filter(m => m.round === round)
      text += `Round ${round}${round === bracket.rounds ? ' (Final)' : ''}:\n`
      
      roundMatches.forEach(match => {
        const p1 = match.player1 || 'TBD'
        const p2 = match.player2 || 'TBD'
        const winner = match.winner ? ` -> Winner: ${match.winner}` : ''
        text += `  ${p1} vs ${p2}${winner}\n`
      })
      text += '\n'
    }
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.tournamentName.replace(/\s+/g, '-')}-bracket.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return 'Final'
    if (round === totalRounds - 1) return 'Semi-Final'
    if (round === totalRounds - 2) return 'Quarter-Final'
    return `Round ${round}`
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tournament Bracket Generator
          </h1>
          <p className="text-xl text-orange-200 max-w-2xl mx-auto">
            Create professional tournament brackets for your competitions. Perfect for sports tournaments and gaming events!
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* 配置面板 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Tournament Setup
              </CardTitle>
              <CardDescription className="text-orange-200">
                Set up your tournament bracket
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tournamentName" className="text-white">Tournament Name</Label>
                  <Input
                    id="tournamentName"
                    value={config.tournamentName}
                    onChange={(e) => setConfig({...config, tournamentName: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter tournament name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Seeding Method</Label>
                  <Select value={config.seedingMethod} onValueChange={(value: BracketConfig['seedingMethod']) => setConfig({...config, seedingMethod: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="seeded">Seeded (by order)</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Participants (one per line)</Label>
                <Textarea
                  value={playerList}
                  onChange={(e) => setPlayerList(e.target.value)}
                  placeholder="Enter participant names, one per line..."
                  className="bg-white/10 border-white/20 text-white min-h-[120px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={addSamplePlayers}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Sample Players
                  </Button>
                </div>
              </div>

              <Button 
                onClick={generateBracket}
                disabled={isGenerating || !playerList.trim()}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white notranslate"
                translate="no"
                data-interactive="true"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Generate Bracket
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 对阵表展示 */}
          {bracket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">{config.tournamentName} Bracket</CardTitle>
                      <CardDescription className="text-orange-200">
                        {bracket.totalPlayers} participants • {bracket.rounds} rounds
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyBracket}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadBracket}
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
                <CardContent className="space-y-6">
                  {Array.from({length: bracket.rounds}, (_, roundIndex) => {
                    const round = roundIndex + 1
                    const roundMatches = bracket.matches.filter(m => m.round === round)
                    
                    return (
                      <div key={round} className="space-y-2">
                        <h3 className="text-white font-semibold text-lg">
                          {getRoundName(round, bracket.rounds)}
                        </h3>
                        <div className="grid gap-3">
                          {roundMatches.map((match, index) => (
                            <div key={match.id} className="p-3 bg-white/5 rounded-lg">
                              <div className="text-sm text-orange-200 mb-1">
                                Match {match.position}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-white">
                                  <div className={`font-medium ${match.winner === match.player1 ? 'text-yellow-400' : ''}`}>
                                    {match.player1 || 'TBD'}
                                  </div>
                                  <div className="text-orange-300 text-sm">vs</div>
                                  <div className={`font-medium ${match.winner === match.player2 ? 'text-yellow-400' : ''}`}>
                                    {match.player2 || 'TBD'}
                                  </div>
                                </div>
                                {match.winner && (
                                  <div className="text-yellow-400 font-semibold">
                                    Winner: {match.winner}
                                  </div>
                                )}
                                {match.isBye && (
                                  <div className="text-orange-400 text-sm">
                                    (Bye)
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 