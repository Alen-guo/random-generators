"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, RefreshCw, Copy, Download, Globe, User, Settings } from 'lucide-react'

interface NameResult {
  firstName: string
  lastName: string
  fullName: string
  gender: 'male' | 'female' | 'unisex'
  origin: string
}

export default function NameGeneratorPage() {
  const [nameCount, setNameCount] = useState(10)
  const [gender, setGender] = useState<'any' | 'male' | 'female'>('any')
  const [nameOrigin, setNameOrigin] = useState<'any' | 'american' | 'british' | 'european' | 'asian' | 'spanish' | 'international'>('any')
  const [includeMiddleName, setIncludeMiddleName] = useState(false)
  const [results, setResults] = useState<NameResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // 示例姓名数据�?
  const nameDatabase = {
    american: {
      male: {
        first: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Steven', 'Kenneth', 'Joshua', 'Kevin', 'Brian'],
        last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
      },
      female: {
        first: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle'],
        last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
      }
    },
    british: {
      male: {
        first: ['Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Noah', 'Charlie', 'Muhammad', 'Thomas', 'Oscar', 'William', 'James', 'Henry', 'Alfie', 'Joshua', 'Mason', 'Ethan', 'Alexander', 'Adam', 'Daniel'],
        last: ['Smith', 'Jones', 'Taylor', 'Williams', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Roberts', 'Johnson', 'Lewis', 'Walker', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright']
      },
      female: {
        first: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Isabella', 'Sophia', 'Grace', 'Lily', 'Freya', 'Emily', 'Ivy', 'Ella', 'Rosie', 'Evie', 'Florence', 'Poppy', 'Charlotte', 'Willow', 'Evelyn'],
        last: ['Smith', 'Jones', 'Taylor', 'Williams', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Roberts', 'Johnson', 'Lewis', 'Walker', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright']
      }
    },
    international: {
      male: {
        first: ['Alex', 'Chris', 'Sam', 'Jordan', 'Taylor', 'Cameron', 'Morgan', 'Casey', 'Riley', 'Avery', 'Jamie', 'Quinn', 'Sage', 'River', 'Phoenix', 'Angel', 'Skyler', 'Justice', 'Finley', 'Emery'],
        last: ['Anderson', 'Miller', 'Clark', 'Lewis', 'Lee', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Gonzalez']
      },
      female: {
        first: ['Alex', 'Chris', 'Sam', 'Jordan', 'Taylor', 'Cameron', 'Morgan', 'Casey', 'Riley', 'Avery', 'Jamie', 'Quinn', 'Sage', 'River', 'Phoenix', 'Angel', 'Skyler', 'Justice', 'Finley', 'Emery'],
        last: ['Anderson', 'Miller', 'Clark', 'Lewis', 'Lee', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Gonzalez']
      }
    }
  }

  const generateNames = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newResults: NameResult[] = []
    
    for (let i = 0; i < nameCount; i++) {
      let selectedOrigin = nameOrigin
      let selectedGender = gender
      
      // Random selection if "any" is chosen
      if (nameOrigin === 'any') {
        const origins = ['american', 'british', 'international']
        selectedOrigin = origins[Math.floor(Math.random() * origins.length)] as typeof selectedOrigin
      }
      
      if (gender === 'any') {
        selectedGender = Math.random() < 0.5 ? 'male' : 'female'
      }
      
      // Get name data for selected origin and gender
      const originData = nameDatabase[selectedOrigin as keyof typeof nameDatabase]
      const genderData = originData[selectedGender as keyof typeof originData]
      
      const firstName = genderData.first[Math.floor(Math.random() * genderData.first.length)]
      const lastName = genderData.last[Math.floor(Math.random() * genderData.last.length)]
      
      let fullName = `${firstName} ${lastName}`
      if (includeMiddleName) {
        const middleName = genderData.first[Math.floor(Math.random() * genderData.first.length)]
        fullName = `${firstName} ${middleName} ${lastName}`
      }
      
      newResults.push({
        firstName,
        lastName,
        fullName,
        gender: selectedGender as 'male' | 'female',
        origin: selectedOrigin === 'american' ? 'American' : selectedOrigin === 'british' ? 'British' : 'International'
      })
    }
    
    setResults(newResults)
    setIsGenerating(false)
  }

  const copyResults = (format: 'full' | 'first' | 'last' | 'csv') => {
    let text = ''
    
    switch (format) {
      case 'full':
        text = results.map(name => name.fullName).join('\n')
        break
      case 'first':
        text = results.map(name => name.firstName).join('\n')
        break
      case 'last':
        text = results.map(name => name.lastName).join('\n')
        break
      case 'csv':
        text = 'First Name,Last Name,Full Name,Gender,Origin\n' + 
               results.map(name => `"${name.firstName}","${name.lastName}","${name.fullName}","${name.gender}","${name.origin}"`).join('\n')
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const text = results.map(name => name.fullName).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'random-names.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const getGenderStats = () => {
    if (results.length === 0) return { male: 0, female: 0 }
    
    const male = results.filter(name => name.gender === 'male').length
    const female = results.filter(name => name.gender === 'female').length
    
    return { male, female }
  }

  const getOriginStats = () => {
    if (results.length === 0) return {}
    
    const stats: Record<string, number> = {}
    results.forEach(name => {
      stats[name.origin] = (stats[name.origin] || 0) + 1
    })
    
    return stats
  }

  const genderStats = getGenderStats()
  const originStats = getOriginStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Name Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate realistic random names from different cultures and origins. Perfect for characters, testing, and creative projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设置面�?*/}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  Name Options
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Customize your name generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Names</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={nameCount}
                    onChange={(e) => setNameCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 10)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 100 names</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Gender</Label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as typeof gender)}
                    className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 focus:outline-none"
                  >
                    <option value="any" className="bg-slate-800">Any Gender</option>
                    <option value="male" className="bg-slate-800">Male Names</option>
                    <option value="female" className="bg-slate-800">Female Names</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Name Origin</Label>
                  <select
                    value={nameOrigin}
                    onChange={(e) => setNameOrigin(e.target.value as typeof nameOrigin)}
                    className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20 focus:outline-none"
                  >
                    <option value="any" className="bg-slate-800">Any Origin</option>
                    <option value="american" className="bg-slate-800">American Names</option>
                    <option value="british" className="bg-slate-800">British Names</option>
                    <option value="international" className="bg-slate-800">International Names</option>
                  </select>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeMiddleName}
                    onChange={(e) => setIncludeMiddleName(e.target.checked)}
                    className="rounded accent-indigo-500"
                  />
                  <span className="text-white">Include middle names</span>
                </label>

                <Button 
                  onClick={generateNames}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Users className="h-5 w-5 mr-2" />
                      Generate Names
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 统计信息 */}
            {results.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Gender Distribution</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Male:</span>
                        <span className="text-white">{genderStats.male}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Female:</span>
                        <span className="text-white">{genderStats.female}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Origin Distribution</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(originStats).map(([origin, count]) => (
                        <div key={origin} className="flex justify-between">
                          <span className="text-slate-400">{origin}:</span>
                          <span className="text-white">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Name Origins</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-medium text-white">American</h4>
                  <p className="text-xs">Common US names reflecting diverse heritage</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-white">British</h4>
                  <p className="text-xs">Traditional UK names and modern variants</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-white">International</h4>
                  <p className="text-xs">Globally recognized unisex names</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果显�?*/}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 && (
              <>
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Generated Names</CardTitle>
                        <CardDescription className="text-slate-300">
                          {results.length} random names generated
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResults('full')}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadResults}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {results.map((name, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => navigator.clipboard.writeText(name.fullName)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{name.fullName}</div>
                            <div className="text-xs text-slate-400">
                              {name.gender} �?{name.origin}
                            </div>
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
                      Copy names in different formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => copyResults('full')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Full Names
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('first')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        First Names
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('last')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Last Names
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
                <CardTitle className="text-white">Applications & Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Generate realistic names for various applications. Our name database includes authentic names 
                  from different cultures and regions, ensuring diversity and authenticity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Creative Projects:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Character names for stories</li>
                      <li>Game character creation</li>
                      <li>Role-playing scenarios</li>
                      <li>Creative writing exercises</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Professional Use:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Software testing data</li>
                      <li>Database seeding</li>
                      <li>User interface mockups</li>
                      <li>Training materials</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Educational:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Student roster examples</li>
                      <li>Cultural diversity studies</li>
                      <li>Language learning</li>
                      <li>Social studies projects</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Business:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Customer personas</li>
                      <li>Sample user accounts</li>
                      <li>Market research</li>
                      <li>Privacy-safe examples</li>
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
