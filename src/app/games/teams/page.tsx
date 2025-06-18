"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Shuffle, RotateCcw, Copy, Download, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

interface TeamConfig {
  numberOfTeams: number
  teamSize: 'auto' | 'fixed'
  fixedSize: number
  balanceMethod: 'random' | 'snake' | 'balanced'
  allowUneven: boolean
}

interface Team {
  id: number
  name: string
  members: string[]
  memberCount: number
}

export default function TeamsPage() {
  const [config, setConfig] = useState<TeamConfig>({
    numberOfTeams: 2,
    teamSize: 'auto',
    fixedSize: 5,
    balanceMethod: 'random',
    allowUneven: true
  })
  
  const [playerList, setPlayerList] = useState('')
  const [teams, setTeams] = useState<Team[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateTeams = () => {
    const players = playerList.split('\n').filter(p => p.trim()).map(p => p.trim())
    
    if (players.length === 0) {
      alert('Please enter player names')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      let shuffledPlayers = [...players]
      
      // 洗牌
      for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]]
      }

      const newTeams: Team[] = []
      
      // 计算团队大小
      let actualTeamSize: number
      if (config.teamSize === 'auto') {
        actualTeamSize = Math.ceil(players.length / config.numberOfTeams)
      } else {
        actualTeamSize = config.fixedSize
      }

      // 分配玩家到团队
      if (config.balanceMethod === 'snake') {
        // 蛇形分配法
        for (let i = 0; i < config.numberOfTeams; i++) {
          newTeams.push({
            id: i + 1,
            name: `Team ${i + 1}`,
            members: [],
            memberCount: 0
          })
        }

        let currentTeam = 0
        let direction = 1
        
        for (const player of shuffledPlayers) {
          newTeams[currentTeam].members.push(player)
          newTeams[currentTeam].memberCount++
          
          currentTeam += direction
          
          if (currentTeam >= config.numberOfTeams) {
            currentTeam = config.numberOfTeams - 1
            direction = -1
          } else if (currentTeam < 0) {
            currentTeam = 0
            direction = 1
          }
        }
      } else {
        // 随机分配或平衡分配
        for (let i = 0; i < config.numberOfTeams; i++) {
          newTeams.push({
            id: i + 1,
            name: `Team ${i + 1}`,
            members: [],
            memberCount: 0
          })
        }

        let playerIndex = 0
        for (const player of shuffledPlayers) {
          const teamIndex = playerIndex % config.numberOfTeams
          newTeams[teamIndex].members.push(player)
          newTeams[teamIndex].memberCount++
          playerIndex++
        }
      }

      setTeams(newTeams)
      setIsGenerating(false)
    }, 500)
  }

  const addSamplePlayers = () => {
    const samplePlayers = [
      'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince',
      'Edward Norton', 'Fiona Apple', 'George Lucas', 'Hannah Montana',
      'Ian Fleming', 'Julia Roberts', 'Kevin Hart', 'Lisa Simpson'
    ]
    setPlayerList(samplePlayers.join('\n'))
  }

  const copyTeams = () => {
    const text = teams.map(team => 
      `${team.name} (${team.memberCount} members):\n${team.members.map(m => `  - ${m}`).join('\n')}`
    ).join('\n\n')
    navigator.clipboard.writeText(text)
  }

  const downloadTeams = () => {
    const text = teams.map(team => 
      `${team.name} (${team.memberCount} members):\n${team.members.map(m => `  - ${m}`).join('\n')}`
    ).join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teams.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTeamColors = (index: number) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
      'bg-teal-500', 'bg-cyan-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Team Generator
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Randomly divide players into balanced teams. Perfect for sports, games, and group activities!
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* 配置面板 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Team Configuration
              </CardTitle>
              <CardDescription className="text-blue-200">
                Set up your teams and division method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfTeams" className="text-white">Number of Teams</Label>
                  <Input
                    id="numberOfTeams"
                    type="number"
                    min="2"
                    max="10"
                    value={config.numberOfTeams}
                    onChange={(e) => setConfig({...config, numberOfTeams: parseInt(e.target.value) || 2})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Team Size</Label>
                  <Select value={config.teamSize} onValueChange={(value: 'auto' | 'fixed') => setConfig({...config, teamSize: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Balanced)</SelectItem>
                      <SelectItem value="fixed">Fixed Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.teamSize === 'fixed' && (
                  <div className="space-y-2">
                    <Label htmlFor="fixedSize" className="text-white">Players per Team</Label>
                    <Input
                      id="fixedSize"
                      type="number"
                      min="1"
                      max="20"
                      value={config.fixedSize}
                      onChange={(e) => setConfig({...config, fixedSize: parseInt(e.target.value) || 1})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">Balance Method</Label>
                  <Select value={config.balanceMethod} onValueChange={(value: TeamConfig['balanceMethod']) => setConfig({...config, balanceMethod: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="snake">Snake Draft</SelectItem>
                      <SelectItem value="balanced">Round Robin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowUneven"
                  checked={config.allowUneven}
                  onChange={(e) => setConfig({...config, allowUneven: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="allowUneven" className="text-white">
                  Allow uneven teams
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* 玩家输入 */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-400" />
                Player List
              </CardTitle>
              <CardDescription className="text-blue-200">
                Enter player names (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={addSamplePlayers}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Add Sample Players
                </Button>
                <Button
                  onClick={() => setPlayerList('')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              <Textarea
                placeholder="Enter player names, one per line..."
                value={playerList}
                onChange={(e) => setPlayerList(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
              />

              <div className="flex justify-between items-center">
                <span className="text-white text-sm">
                  {playerList.split('\n').filter(p => p.trim()).length} players entered
                </span>
                <Button 
                  onClick={generateTeams}
                  disabled={isGenerating || !playerList.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Shuffle className="h-4 w-4 mr-2" />
                      Generate Teams
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 生成的团队 */}
          {teams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Generated Teams</CardTitle>
                      <CardDescription className="text-blue-200">
                        {teams.length} teams with {teams.reduce((sum, team) => sum + team.memberCount, 0)} total players
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyTeams}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadTeams}
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
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team, index) => (
                      <div key={team.id} className="bg-white/5 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-4 h-4 rounded-full ${getTeamColors(index)}`}></div>
                          <h3 className="text-xl font-bold text-white">
                            {team.name}
                          </h3>
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {team.memberCount}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {team.members.map((member, memberIndex) => (
                            <div
                              key={memberIndex}
                              className="flex items-center gap-2 p-2 bg-white/10 rounded"
                            >
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span className="text-white">{member}</span>
                            </div>
                          ))}
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