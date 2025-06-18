"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, RefreshCw, Copy, Download, User, MapPin, Zap, Heart } from 'lucide-react'

interface StoryConfig {
  genre: string[]
  length: 'short' | 'medium' | 'long'
  characters: number
  setting: string[]
  mood: string[]
  includeDialogue: boolean
  includeConflict: boolean
  includeResolution: boolean
  perspective: 'first' | 'third' | 'mixed'
}

interface GeneratedStory {
  title: string
  genre: string
  setting: string
  characters: Character[]
  plot: string
  content: string
  wordCount: number
  mood: string
  timestamp: Date
  id: string
}

interface Character {
  name: string
  role: string
  trait: string
  motivation: string
}

export default function StoryPage() {
  const [config, setConfig] = useState<StoryConfig>({
    genre: ['adventure'],
    length: 'medium',
    characters: 2,
    setting: ['modern'],
    mood: ['mysterious'],
    includeDialogue: true,
    includeConflict: true,
    includeResolution: true,
    perspective: 'third'
  })
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const genres = [
    { key: 'adventure', name: 'Adventure', icon: '🗺️', description: 'Exciting journeys and quests' },
    { key: 'romance', name: 'Romance', icon: '💕', description: 'Love stories and relationships' },
    { key: 'mystery', name: 'Mystery', icon: '🔍', description: 'Puzzles and secrets to uncover' },
    { key: 'fantasy', name: 'Fantasy', icon: '🧙', description: 'Magic and mythical worlds' },
    { key: 'scifi', name: 'Sci-Fi', icon: '🚀', description: 'Future technology and space' },
    { key: 'horror', name: 'Horror', icon: '👻', description: 'Scary and suspenseful tales' },
    { key: 'comedy', name: 'Comedy', icon: '😄', description: 'Funny and lighthearted stories' },
    { key: 'drama', name: 'Drama', icon: '🎭', description: 'Emotional and realistic stories' }
  ]

  const settings = [
    { key: 'modern', name: 'Modern City', description: 'Contemporary urban environment' },
    { key: 'medieval', name: 'Medieval', description: 'Knights, castles, and kingdoms' },
    { key: 'future', name: 'Future', description: 'Advanced technology and space' },
    { key: 'school', name: 'School', description: 'Educational institutions' },
    { key: 'forest', name: 'Forest', description: 'Dense woods and wilderness' },
    { key: 'island', name: 'Island', description: 'Isolated tropical paradise' },
    { key: 'space', name: 'Space', description: 'Spacecraft and alien worlds' },
    { key: 'underground', name: 'Underground', description: 'Caves and hidden tunnels' }
  ]

  const moods = [
    { key: 'mysterious', name: 'Mysterious', description: 'Full of secrets and intrigue' },
    { key: 'cheerful', name: 'Cheerful', description: 'Upbeat and positive' },
    { key: 'dark', name: 'Dark', description: 'Somber and serious' },
    { key: 'adventurous', name: 'Adventurous', description: 'Exciting and bold' },
    { key: 'romantic', name: 'Romantic', description: 'Loving and passionate' },
    { key: 'suspenseful', name: 'Suspenseful', description: 'Tense and thrilling' },
    { key: 'whimsical', name: 'Whimsical', description: 'Playful and imaginative' },
    { key: 'melancholic', name: 'Melancholic', description: 'Sad and reflective' }
  ]

  // Character generation data
  const characterNames = {
    male: ['Alex', 'Ben', 'Chris', 'David', 'Ethan', 'Felix', 'Gabriel', 'Henry', 'Ian', 'Jack', 'Kyle', 'Lucas', 'Marcus', 'Nathan', 'Oliver'],
    female: ['Alice', 'Bella', 'Claire', 'Diana', 'Emma', 'Fiona', 'Grace', 'Hannah', 'Isabella', 'Julia', 'Kate', 'Luna', 'Maya', 'Nora', 'Olivia'],
    neutral: ['River', 'Sage', 'Phoenix', 'Quinn', 'Rowan', 'Sky', 'Storm', 'Vale', 'Winter', 'Zen']
  }

  const characterRoles = [
    'protagonist', 'antagonist', 'mentor', 'ally', 'rival', 'mysterious stranger', 
    'comic relief', 'love interest', 'wise elder', 'young apprentice', 'guardian', 
    'explorer', 'scientist', 'artist', 'warrior'
  ]

  const characterTraits = [
    'brave', 'clever', 'mysterious', 'kind', 'stubborn', 'ambitious', 'loyal', 'curious', 
    'resourceful', 'impulsive', 'cautious', 'charismatic', 'introverted', 'optimistic', 
    'pessimistic', 'witty', 'serious', 'gentle', 'fierce', 'wise'
  ]

  const motivations = [
    'seeking truth', 'protecting family', 'finding love', 'gaining power', 'escaping past', 
    'saving the world', 'proving worth', 'seeking revenge', 'finding home', 'discovering identity',
    'achieving dreams', 'overcoming fear', 'helping others', 'seeking adventure', 'finding peace'
  ]

  const plotElements = {
    adventure: [
      'discovers a hidden map', 'meets a mysterious guide', 'faces dangerous obstacles', 'finds ancient treasure',
      'encounters hostile creatures', 'solves ancient puzzles', 'crosses treacherous terrain', 'uncovers secrets'
    ],
    romance: [
      'meets by chance', 'misunderstands intentions', 'faces family opposition', 'overcomes obstacles together',
      'realizes true feelings', 'makes difficult choices', 'proves their love', 'finds happiness'
    ],
    mystery: [
      'discovers a clue', 'investigates suspicious behavior', 'uncovers hidden motives', 'follows a trail',
      'interrogates suspects', 'pieces together evidence', 'reveals the truth', 'solves the case'
    ],
    fantasy: [
      'discovers magical powers', 'meets mythical creatures', 'finds ancient artifacts', 'battles dark forces',
      'learns magical spells', 'explores enchanted realms', 'fulfills prophecies', 'saves the kingdom'
    ]
  }

  const generateCharacter = (): Character => {
    const nameType = Math.random() < 0.4 ? 'male' : Math.random() < 0.7 ? 'female' : 'neutral'
    const names = characterNames[nameType]
    
    return {
      name: names[Math.floor(Math.random() * names.length)],
      role: characterRoles[Math.floor(Math.random() * characterRoles.length)],
      trait: characterTraits[Math.floor(Math.random() * characterTraits.length)],
      motivation: motivations[Math.floor(Math.random() * motivations.length)]
    }
  }

  const generatePlot = (genre: string, characters: Character[]): string => {
    const elements = plotElements[genre as keyof typeof plotElements] || plotElements.adventure
    const selectedElements = Array.from({length: 3}, () => 
      elements[Math.floor(Math.random() * elements.length)]
    )
    
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    
    return `${protagonist.name} ${selectedElements.join(', then ')}. Through this journey, they ${protagonist.motivation} while staying true to their ${protagonist.trait} nature.`
  }

  const generateStoryContent = (
    title: string, 
    characters: Character[], 
    plot: string, 
    setting: string, 
    mood: string,
    genre: string
  ): { content: string; wordCount: number } => {
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0]
    const supporting = characters.filter(c => c !== protagonist)
    
    let content = `# ${title}\n\n`
    
    // Opening
    const openings = {
      mysterious: `The ${setting} held secrets that ${protagonist.name} was about to uncover.`,
      cheerful: `It was a beautiful day in the ${setting} when ${protagonist.name} began their journey.`,
      dark: `Shadows loomed over the ${setting} as ${protagonist.name} ventured forth.`,
      adventurous: `The ${setting} beckoned with promises of adventure for ${protagonist.name}.`,
      romantic: `In the enchanting ${setting}, ${protagonist.name}'s heart was about to change forever.`,
      suspenseful: `Something was terribly wrong in the ${setting}, and ${protagonist.name} could feel it.`
    }
    
    content += `${openings[mood as keyof typeof openings] || openings.mysterious}\n\n`
    
    // Character introduction
    content += `${protagonist.name}, a ${protagonist.trait} ${protagonist.role}, had always been driven by ${protagonist.motivation}. `
    
    if (supporting.length > 0) {
      const companion = supporting[0]
      content += `Alongside ${companion.name}, a ${companion.trait} ${companion.role}, they formed an unlikely partnership.\n\n`
    } else {
      content += `This journey would test everything they believed in.\n\n`
    }
    
    // Main plot
    content += `${plot}\n\n`
    
    // Dialogue section (if enabled)
    if (config.includeDialogue && supporting.length > 0) {
      const companion = supporting[0]
      content += `"Are you sure about this?" ${companion.name} asked, their voice filled with concern.\n\n`
      content += `${protagonist.name} nodded firmly. "We've come too far to turn back now. ${protagonist.motivation.charAt(0).toUpperCase() + protagonist.motivation.slice(1)} is worth any risk."\n\n`
    }
    
    // Conflict (if enabled)
    if (config.includeConflict) {
      const conflicts = {
        adventure: 'faced their greatest challenge yet',
        romance: 'confronted their deepest fears about love',
        mystery: 'uncovered a shocking truth',
        fantasy: 'battled against overwhelming magical forces',
        horror: 'encountered their worst nightmare',
        comedy: 'found themselves in an absurd situation',
        drama: 'was forced to make an impossible choice',
        scifi: 'discovered technology beyond their understanding'
      }
      
      content += `When ${protagonist.name} ${conflicts[genre as keyof typeof conflicts] || conflicts.adventure}, their ${protagonist.trait} nature was put to the ultimate test.\n\n`
    }
    
    // Resolution (if enabled)
    if (config.includeResolution) {
      const resolutions = {
        cheerful: 'everything worked out better than they could have imagined',
        dark: 'they found peace in unexpected places',
        mysterious: 'the truth was finally revealed',
        adventurous: 'their courage led them to victory',
        romantic: 'love conquered all obstacles',
        suspenseful: 'justice was finally served'
      }
      
      content += `In the end, ${resolutions[mood as keyof typeof resolutions] || resolutions.cheerful}. ${protagonist.name} had not only achieved their goal but had grown in ways they never expected.\n\n`
    }
    
    // Epilogue
    content += `The ${setting} would never look the same to ${protagonist.name}, for they had discovered that ${protagonist.motivation} was just the beginning of a much greater journey.`
    
    const wordCount = content.split(' ').length
    
    return { content, wordCount }
  }

  const generateStory = async () => {
    setIsGenerating(true)
    
    try {
      // Generate characters
      const characters: Character[] = []
      for (let i = 0; i < config.characters; i++) {
        characters.push(generateCharacter())
      }
      
      // Ensure at least one protagonist
      if (!characters.some(c => c.role === 'protagonist')) {
        characters[0].role = 'protagonist'
      }
      
      const selectedGenre = config.genre[Math.floor(Math.random() * config.genre.length)]
      const selectedSetting = config.setting[Math.floor(Math.random() * config.setting.length)]
      const selectedMood = config.mood[Math.floor(Math.random() * config.mood.length)]
      
      const plot = generatePlot(selectedGenre, characters)
      
      // Generate title
      const titlePrefixes = {
        adventure: ['The Quest for', 'Journey to', 'The Adventures of', 'Quest of'],
        romance: ['Love in', 'Hearts of', 'The Romance of', 'Passion in'],
        mystery: ['The Mystery of', 'Secret of', 'The Case of', 'Murder in'],
        fantasy: ['The Magic of', 'Realm of', 'The Wizard of', 'Chronicles of'],
        scifi: ['The Future of', 'Stars of', 'The Galaxy of', 'Mission to'],
        horror: ['The Horror of', 'Nightmare in', 'The Haunting of', 'Terror in'],
        comedy: ['The Comedy of', 'Laughs in', 'The Funny Side of', 'Humor in'],
        drama: ['The Story of', 'Life in', 'The Drama of', 'Tales from']
      }
      
      const prefix = titlePrefixes[selectedGenre as keyof typeof titlePrefixes] || titlePrefixes.adventure
      const title = `${prefix[Math.floor(Math.random() * prefix.length)]} ${selectedSetting.charAt(0).toUpperCase() + selectedSetting.slice(1)}`
      
      const { content, wordCount } = generateStoryContent(
        title, characters, plot, selectedSetting, selectedMood, selectedGenre
      )
      
      const story: GeneratedStory = {
        title,
        genre: selectedGenre,
        setting: selectedSetting,
        characters,
        plot,
        content,
        wordCount,
        mood: selectedMood,
        timestamp: new Date(),
        id: `story_${Date.now()}`
      }
      
      setGeneratedStories([story, ...generatedStories.slice(0, 4)]) // Keep only last 5 stories
      
    } catch (error) {
      console.error('Error generating story:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyStory = (story: GeneratedStory) => {
    navigator.clipboard.writeText(story.content)
  }

  const downloadStory = (story: GeneratedStory) => {
    const blob = new Blob([story.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${story.title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const toggleGenre = (genre: string) => {
    setConfig(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }))
  }

  const toggleSetting = (setting: string) => {
    setConfig(prev => ({
      ...prev,
      setting: prev.setting.includes(setting)
        ? prev.setting.filter(s => s !== setting)
        : [...prev.setting, setting]
    }))
  }

  const toggleMood = (mood: string) => {
    setConfig(prev => ({
      ...prev,
      mood: prev.mood.includes(mood)
        ? prev.mood.filter(m => m !== mood)
        : [...prev.mood, mood]
    }))
  }

  const loadPreset = (preset: 'fantasy' | 'romance' | 'adventure' | 'mystery') => {
    switch (preset) {
      case 'fantasy':
        setConfig(prev => ({
          ...prev,
          genre: ['fantasy'],
          setting: ['medieval', 'forest'],
          mood: ['mysterious', 'adventurous'],
          characters: 3,
          length: 'long'
        }))
        break
      case 'romance':
        setConfig(prev => ({
          ...prev,
          genre: ['romance'],
          setting: ['modern', 'school'],
          mood: ['romantic', 'cheerful'],
          characters: 2,
          length: 'medium'
        }))
        break
      case 'adventure':
        setConfig(prev => ({
          ...prev,
          genre: ['adventure'],
          setting: ['island', 'forest'],
          mood: ['adventurous', 'mysterious'],
          characters: 2,
          length: 'medium'
        }))
        break
      case 'mystery':
        setConfig(prev => ({
          ...prev,
          genre: ['mystery'],
          setting: ['modern', 'school'],
          mood: ['mysterious', 'suspenseful'],
          characters: 3,
          length: 'medium'
        }))
        break
    }
  }

  const getMoodColor = (mood: string) => {
    const colors = {
      mysterious: 'text-purple-400',
      cheerful: 'text-yellow-400',
      dark: 'text-gray-400',
      adventurous: 'text-orange-400',
      romantic: 'text-pink-400',
      suspenseful: 'text-red-400',
      whimsical: 'text-green-400',
      melancholic: 'text-blue-400'
    }
    return colors[mood as keyof typeof colors] || 'text-gray-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Story Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Create unique, engaging stories with customizable characters, settings, and plots. Perfect for writers, educators, and creative minds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：故事配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5" />
                  Story Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your story generation options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 故事类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Genres ({config.genre.length} selected)</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {genres.map(genre => (
                      <button
                        key={genre.key}
                        onClick={() => toggleGenre(genre.key)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.genre.includes(genre.key)
                            ? 'bg-violet-500/20 border-violet-400 text-violet-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{genre.icon}</span>
                          <span className="font-medium">{genre.name}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {genre.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 设定背景 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Settings ({config.setting.length} selected)</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {settings.map(setting => (
                      <button
                        key={setting.key}
                        onClick={() => toggleSetting(setting.key)}
                        className={`w-full p-2 rounded text-xs text-left transition-colors ${
                          config.setting.includes(setting.key)
                            ? 'bg-violet-500/20 border border-violet-400 text-violet-300'
                            : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium">{setting.name}</div>
                        <div className="text-slate-400">{setting.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 故事氛围 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Moods ({config.mood.length} selected)</Label>
                  <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                    {moods.map(mood => (
                      <button
                        key={mood.key}
                        onClick={() => toggleMood(mood.key)}
                        className={`p-2 rounded text-xs text-center transition-colors ${
                          config.mood.includes(mood.key)
                            ? 'bg-violet-500/20 border border-violet-400 text-violet-300'
                            : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {mood.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 角色数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Characters</Label>
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    value={config.characters}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      characters: Math.max(1, Math.min(6, parseInt(e.target.value) || 2))
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* 故事长度 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Story Length</Label>
                  <select
                    value={config.length}
                    onChange={(e) => setConfig(prev => ({ ...prev, length: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="short" className="bg-slate-800">Short (~200 words)</option>
                    <option value="medium" className="bg-slate-800">Medium (~400 words)</option>
                    <option value="long" className="bg-slate-800">Long (~600 words)</option>
                  </select>
                </div>

                {/* 叙述视角 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Perspective</Label>
                  <select
                    value={config.perspective}
                    onChange={(e) => setConfig(prev => ({ ...prev, perspective: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="first" className="bg-slate-800">First Person (I/We)</option>
                    <option value="third" className="bg-slate-800">Third Person (He/She/They)</option>
                    <option value="mixed" className="bg-slate-800">Mixed</option>
                  </select>
                </div>

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Story Elements</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeDialogue}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeDialogue: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include dialogue</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeConflict}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeConflict: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include conflict</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeResolution}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeResolution: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include resolution</span>
                    </label>
                  </div>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('fantasy')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Fantasy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('romance')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Romance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('adventure')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Adventure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('mystery')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <User className="h-3 w-3 mr-1" />
                      Mystery
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateStory}
                  disabled={isGenerating || config.genre.length === 0 || config.setting.length === 0 || config.mood.length === 0}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating Story...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Generate Story
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的故事 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedStories.length > 0 ? (
              generatedStories.map((story, index) => (
                <Card key={story.id} className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-violet-400" />
                          {story.title}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {story.genre} • {story.setting} • {story.wordCount} words • 
                          <span className={`ml-1 ${getMoodColor(story.mood)}`}>{story.mood}</span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyStory(story)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadStory(story)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* 角色信息 */}
                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Characters:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {story.characters.map((character, charIndex) => (
                          <div key={charIndex} className="text-sm">
                            <span className="text-violet-400 font-medium">{character.name}</span>
                            <span className="text-slate-300"> - {character.trait} {character.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 故事内容 */}
                    <div className="bg-slate-900 border border-white/20 rounded p-4 mb-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-white whitespace-pre-wrap font-sans">
                        {story.content}
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Generated {story.timestamp.toLocaleString()}</span>
                      <span>Story #{index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to create your story?</p>
                  <p>Configure your settings and click "Generate Story"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Story Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Genre Selection</h4>
                    <p className="text-sm">Choose from 8 different genres including adventure, romance, mystery, fantasy, sci-fi, horror, comedy, and drama.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Character Development</h4>
                    <p className="text-sm">Control the number of characters and their traits. Each character gets unique motivations and personality traits.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Story Elements</h4>
                    <p className="text-sm">Include dialogue, conflict, and resolution to create well-structured narratives with proper story arcs.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Creative writing</li>
                      <li>Writing prompts</li>
                      <li>Educational content</li>
                      <li>Story inspiration</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Character development</li>
                      <li>Plot brainstorming</li>
                      <li>Writing exercises</li>
                      <li>Entertainment</li>
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