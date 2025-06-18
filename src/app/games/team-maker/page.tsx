"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, RefreshCw, Copy, Download, Shuffle, UserPlus, Settings, Crown } from 'lucide-react'

interface Team {
  id: number
  name: string
  members: string[]
  captain?: string
}

interface Person {
  name: string
  isLeader?: boolean
}

export default function TeamMakerPage() {
  const [inputText, setInputText] = useState('')
  const [people, setPeople] = useState<Person[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [teamCount, setTeamCount] = useState(2)
  const [assignCaptains, setAssignCaptains] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateTeams = async () => {
    const lines = inputText.split('\n').filter(line => line.trim() !== '')
    if (lines.length === 0) return

    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 600))

    const newPeople: Person[] = lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.endsWith('*')) {
        return { name: trimmed.slice(0, -1).trim(), isLeader: true }
      }
      return { name: trimmed }
    })

    const shuffledPeople = [...newPeople].sort(() => Math.random() - 0.5)
    const newTeams: Team[] = []

    for (let i = 0; i < teamCount; i++) {
      newTeams.push({
        id: i + 1,
        name: `Team ${i + 1}`,
        members: []
      })
    }

    shuffledPeople.forEach((person, index) => {
      const teamIndex = index % teamCount
      newTeams[teamIndex].members.push(person.name)
    })

    if (assignCaptains) {
      newTeams.forEach(team => {
        if (team.members.length > 0) {
          const randomIndex = Math.floor(Math.random() * team.members.length)
          team.captain = team.members[randomIndex]
        }
      })
    }

    setTeams(newTeams)
    setIsGenerating(false)
  }

  const addSampleData = () => {
    const sample = [
      'Alice Johnson*', 'Bob Smith', 'Carol Davis', 'David Wilson*', 
      'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'
    ]
    setInputText(sample.join('\n'))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Team Maker</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Randomly divide people into balanced teams. Perfect for sports, projects, games, and group activities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UserPlus className="h-5 w-5" />
                People List
              </CardTitle>
              <CardDescription className="text-slate-300">
                Enter names one per line (add * for leaders)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Names</Label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Alice Johnson&#10;Bob Smith*&#10;Carol Davis&#10;..."
                  rows={8}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none resize-y"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Teams</Label>
                  <Input
                    type="number"
                    min={2}
                    max={20}
                    value={teamCount}
                    onChange={(e) => setTeamCount(Math.max(2, parseInt(e.target.value) || 2))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={assignCaptains}
                    onChange={(e) => setAssignCaptains(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span className="text-white">Assign team captains</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateTeams}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Make Teams
                    </>
                  )}
                </Button>
                <Button 
                  onClick={addSampleData}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Team Results</CardTitle>
              <CardDescription className="text-slate-300">
                {teams.length > 0 ? `${teams.length} teams created` : 'Configure and generate teams'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white text-lg">{team.name}</h3>
                        <div className="text-xs text-slate-400 bg-white/10 px-2 py-1 rounded">
                          {team.members.length} members
                        </div>
                      </div>
                      
                      {team.captain && (
                        <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-500/20 border border-yellow-400/30 rounded">
                          <Crown className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-100 font-medium">Captain: {team.captain}</span>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {team.members.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white/5 rounded"
                          >
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-white">{member}</span>
                            {member === team.captain && (
                              <Crown className="h-3 w-3 text-yellow-400 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Add people and generate teams to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 