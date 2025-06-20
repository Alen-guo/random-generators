"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckSquare, RefreshCw, Copy, Download, Plus, Trash2, Clock, Target, Zap, Home } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface TaskConfig {
  types: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  timeFrame: '5min' | '15min' | '30min' | '1hour' | 'flexible' | 'mixed'
  category: 'personal' | 'creative' | 'physical' | 'social' | 'learning' | 'mixed'
  includeDescription: boolean
  includeTips: boolean
}

interface GeneratedTask {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  timeFrame: string
  tips: string[]
  isCompleted: boolean
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
}

export default function TasksPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<TaskConfig>({
    types: ['daily'],
    difficulty: 'mixed',
    timeFrame: 'mixed',
    category: 'mixed',
    includeDescription: true,
    includeTips: true
  })
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [customTask, setCustomTask] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const taskTypes = [
    { key: 'daily', name: 'Daily Tasks', icon: '📅', description: 'Regular daily activities' },
    { key: 'creative', name: 'Creative Tasks', icon: '🎨', description: 'Artistic and creative challenges' },
    { key: 'physical', name: 'Physical Tasks', icon: '💪', description: 'Exercise and movement activities' },
    { key: 'social', name: 'Social Tasks', icon: '👥', description: 'People and relationship activities' },
    { key: 'learning', name: 'Learning Tasks', icon: '📚', description: 'Educational and skill-building' },
    { key: 'mindful', name: 'Mindfulness', icon: '🧘', description: 'Mental health and awareness' },
    { key: 'productivity', name: 'Productivity', icon: '⚡', description: 'Efficiency and organization' },
    { key: 'adventure', name: 'Adventure', icon: '🗺️', description: 'Fun and exploratory activities' }
  ]

  // 任务数据库
  const taskDatabase = {
    daily: {
      easy: [
        { 
          title: "Make your bed", 
          description: "Start your day by making your bed neatly",
          tips: ["Smooth out wrinkles", "Arrange pillows nicely", "It takes only 2 minutes"],
          timeFrame: "5min",
          priority: "low"
        },
        { 
          title: "Water a plant", 
          description: "Check and water any plants that need care",
          tips: ["Check soil moisture first", "Water slowly and evenly", "Don't overwater"],
          timeFrame: "5min",
          priority: "medium"
        },
        { 
          title: "Organize your desk", 
          description: "Clean and organize your workspace",
          tips: ["Remove unnecessary items", "Group similar items together", "Clean the surface"],
          timeFrame: "15min",
          priority: "medium"
        }
      ],
      medium: [
        { 
          title: "Plan your week", 
          description: "Create a schedule and plan for the upcoming week",
          tips: ["Review your calendar", "Set priorities", "Block time for important tasks", "Include some buffer time"],
          timeFrame: "30min",
          priority: "high"
        },
        { 
          title: "Deep clean one room", 
          description: "Choose one room and give it a thorough cleaning",
          tips: ["Start from top to bottom", "Declutter first", "Use appropriate cleaning products", "Don't forget corners"],
          timeFrame: "1hour",
          priority: "medium"
        }
      ],
      hard: [
        { 
          title: "Create a monthly budget", 
          description: "Plan and organize your finances for the month",
          tips: ["Track all income sources", "List all expenses", "Set savings goals", "Use budgeting apps if helpful"],
          timeFrame: "1hour",
          priority: "high"
        }
      ]
    },
    creative: {
      easy: [
        { 
          title: "Draw something you see", 
          description: "Look around and sketch any object you find interesting",
          tips: ["Don't worry about perfection", "Focus on shapes and proportions", "Use any drawing tool you have"],
          timeFrame: "15min",
          priority: "low"
        },
        { 
          title: "Write a haiku", 
          description: "Compose a short three-line poem about your current mood",
          tips: ["Follow 5-7-5 syllable pattern", "Focus on nature or emotions", "Keep it simple and vivid"],
          timeFrame: "5min",
          priority: "low"
        }
      ],
      medium: [
        { 
          title: "Design a logo", 
          description: "Create a simple logo for an imaginary company",
          tips: ["Keep it simple", "Choose meaningful colors", "Make it scalable", "Think about the brand message"],
          timeFrame: "30min",
          priority: "medium"
        },
        { 
          title: "Write a short story", 
          description: "Create a 500-word story with an interesting twist",
          tips: ["Start with a compelling first line", "Develop characters quickly", "Build to a surprising ending"],
          timeFrame: "1hour",
          priority: "medium"
        }
      ],
      hard: [
        { 
          title: "Compose a song", 
          description: "Write lyrics and melody for a complete song",
          tips: ["Start with a theme or message", "Create a catchy hook", "Structure: verse-chorus-verse-chorus-bridge-chorus"],
          timeFrame: "1hour",
          priority: "high"
        }
      ]
    },
    physical: {
      easy: [
        { 
          title: "Take a 10-minute walk", 
          description: "Go for a relaxing walk around your neighborhood",
          tips: ["Maintain good posture", "Breathe deeply", "Notice your surroundings", "Walk at a comfortable pace"],
          timeFrame: "15min",
          priority: "medium"
        },
        { 
          title: "Do 10 push-ups", 
          description: "Complete 10 push-ups with proper form",
          tips: ["Keep your body straight", "Go at your own pace", "Modify on knees if needed", "Focus on form over speed"],
          timeFrame: "5min",
          priority: "low"
        }
      ],
      medium: [
        { 
          title: "Try a new yoga pose", 
          description: "Learn and practice a yoga pose you've never done",
          tips: ["Watch instructional videos", "Start slowly", "Don't force it", "Focus on breathing"],
          timeFrame: "15min",
          priority: "medium"
        },
        { 
          title: "Do a 20-minute workout", 
          description: "Complete a full-body workout routine",
          tips: ["Warm up first", "Include cardio and strength", "Cool down after", "Stay hydrated"],
          timeFrame: "30min",
          priority: "high"
        }
      ],
      hard: [
        { 
          title: "Run 5 kilometers", 
          description: "Complete a 5K run at your own pace",
          tips: ["Warm up properly", "Pace yourself", "Stay hydrated", "Cool down with stretching"],
          timeFrame: "1hour",
          priority: "high"
        }
      ]
    },
    social: {
      easy: [
        { 
          title: "Call a family member", 
          description: "Have a meaningful conversation with a family member",
          tips: ["Ask about their day", "Share something positive", "Listen actively", "Show genuine interest"],
          timeFrame: "15min",
          priority: "medium"
        },
        { 
          title: "Send a thank you message", 
          description: "Thank someone who has helped you recently",
          tips: ["Be specific about what you're thanking them for", "Keep it sincere", "Don't expect anything in return"],
          timeFrame: "5min",
          priority: "low"
        }
      ],
      medium: [
        { 
          title: "Plan a social gathering", 
          description: "Organize a small get-together with friends or family",
          tips: ["Choose a convenient date", "Plan activities", "Consider dietary restrictions", "Keep it simple"],
          timeFrame: "30min",
          priority: "medium"
        },
        { 
          title: "Volunteer for something", 
          description: "Find and sign up for a volunteer opportunity",
          tips: ["Choose something you care about", "Start small", "Consider your schedule", "Look for local opportunities"],
          timeFrame: "30min",
          priority: "high"
        }
      ],
      hard: [
        { 
          title: "Organize a community event", 
          description: "Plan and coordinate an event for your community",
          tips: ["Start with a clear goal", "Get necessary permissions", "Recruit helpers", "Promote effectively"],
          timeFrame: "flexible",
          priority: "high"
        }
      ]
    },
    learning: {
      easy: [
        { 
          title: "Learn 5 new words", 
          description: "Discover and memorize 5 words in your native or foreign language",
          tips: ["Use them in sentences", "Write them down", "Practice pronunciation", "Review later"],
          timeFrame: "15min",
          priority: "low"
        },
        { 
          title: "Watch an educational video", 
          description: "Find and watch a 10-minute educational video on a topic you're curious about",
          tips: ["Take notes", "Pause to reflect", "Look up unfamiliar terms", "Share what you learned"],
          timeFrame: "15min",
          priority: "low"
        }
      ],
      medium: [
        { 
          title: "Read a scientific article", 
          description: "Find and read a peer-reviewed article on a topic of interest",
          tips: ["Start with the abstract", "Look up unfamiliar terms", "Take notes on key points", "Consider the implications"],
          timeFrame: "30min",
          priority: "medium"
        },
        { 
          title: "Practice a new skill", 
          description: "Spend focused time practicing a skill you want to develop",
          tips: ["Set specific goals", "Practice deliberately", "Track your progress", "Be patient with yourself"],
          timeFrame: "30min",
          priority: "medium"
        }
      ],
      hard: [
        { 
          title: "Complete an online course module", 
          description: "Find and complete a full module of an online course",
          tips: ["Take comprehensive notes", "Complete all exercises", "Engage with community if available", "Apply what you learn"],
          timeFrame: "1hour",
          priority: "high"
        }
      ]
    },
    mindful: {
      easy: [
        { 
          title: "Practice 5-minute meditation", 
          description: "Sit quietly and focus on your breathing for 5 minutes",
          tips: ["Find a quiet space", "Sit comfortably", "Focus on your breath", "Don't judge your thoughts"],
          timeFrame: "5min",
          priority: "medium"
        },
        { 
          title: "Write in a gratitude journal", 
          description: "Write down 3 things you're grateful for today",
          tips: ["Be specific", "Include why you're grateful", "Notice small things", "Make it a habit"],
          timeFrame: "5min",
          priority: "low"
        }
      ],
      medium: [
        { 
          title: "Practice mindful eating", 
          description: "Eat a meal or snack with complete attention and awareness",
          tips: ["Eat slowly", "Notice textures and flavors", "Put down utensils between bites", "Avoid distractions"],
          timeFrame: "30min",
          priority: "medium"
        },
        { 
          title: "Do a body scan meditation", 
          description: "Practice a guided body scan meditation",
          tips: ["Lie down comfortably", "Start from your toes", "Notice sensations without judgment", "Take your time"],
          timeFrame: "15min",
          priority: "medium"
        }
      ],
      hard: [
        { 
          title: "Practice silent meditation", 
          description: "Meditate in silence for 30 minutes without guidance",
          tips: ["Set a timer", "Find a consistent posture", "Return to breath when mind wanders", "Be compassionate with yourself"],
          timeFrame: "30min",
          priority: "high"
        }
      ]
    },
    productivity: {
      easy: [
        { 
          title: "Clear your email inbox", 
          description: "Process and organize all emails in your inbox",
          tips: ["Delete unnecessary emails", "Respond to urgent ones", "File or archive others", "Unsubscribe from unwanted lists"],
          timeFrame: "15min",
          priority: "medium"
        },
        { 
          title: "Create tomorrow's to-do list", 
          description: "Plan and prioritize tasks for the next day",
          tips: ["Limit to 3-5 important tasks", "Estimate time for each", "Include one easy win", "Review your calendar"],
          timeFrame: "5min",
          priority: "low"
        }
      ],
      medium: [
        { 
          title: "Implement a new productivity system", 
          description: "Research and start using a new productivity method",
          tips: ["Choose something simple to start", "Read about best practices", "Give it at least a week", "Adjust as needed"],
          timeFrame: "30min",
          priority: "medium"
        },
        { 
          title: "Automate a repetitive task", 
          description: "Find a way to automate something you do regularly",
          tips: ["Identify the most time-consuming task", "Research automation tools", "Start with simple solutions", "Test thoroughly"],
          timeFrame: "1hour",
          priority: "high"
        }
      ],
      hard: [
        { 
          title: "Conduct a time audit", 
          description: "Track and analyze how you spend your time for a day",
          tips: ["Record every 15-30 minutes", "Be honest about time wasters", "Identify patterns", "Plan improvements"],
          timeFrame: "flexible",
          priority: "high"
        }
      ]
    },
    adventure: {
      easy: [
        { 
          title: "Explore a new neighborhood", 
          description: "Walk through an area of your city you've never visited",
          tips: ["Bring a camera", "Try a local café", "Talk to locals", "Notice unique architecture"],
          timeFrame: "1hour",
          priority: "low"
        },
        { 
          title: "Try a new cuisine", 
          description: "Order food from a cuisine you've never tried before",
          tips: ["Ask for recommendations", "Start with mild flavors", "Be adventurous", "Research the culture behind it"],
          timeFrame: "30min",
          priority: "low"
        }
      ],
      medium: [
        { 
          title: "Take a photography challenge", 
          description: "Take 20 photos following a specific theme",
          tips: ["Choose a theme (colors, patterns, people)", "Experiment with angles", "Don't delete anything yet", "Review and select the best"],
          timeFrame: "1hour",
          priority: "medium"
        },
        { 
          title: "Visit a local museum", 
          description: "Explore a museum or cultural site in your area",
          tips: ["Read about exhibits beforehand", "Take your time", "Ask questions to staff", "Reflect on what you learned"],
          timeFrame: "flexible",
          priority: "medium"
        }
      ],
      hard: [
        { 
          title: "Plan a micro-adventure", 
          description: "Design and execute a small adventure within 50 miles of home",
          tips: ["Research interesting locations", "Plan transportation", "Pack appropriately", "Document the experience"],
          timeFrame: "flexible",
          priority: "high"
        }
      ]
    }
  }

  const generateTasks = async () => {
    if (config.types.length === 0) return

    setIsGenerating(true)
    
    try {
      const tasks: GeneratedTask[] = []
      
      for (let i = 0; i < 3; i++) {
        const randomType = config.types[Math.floor(Math.random() * config.types.length)]
        const typeTasks = taskDatabase[randomType as keyof typeof taskDatabase]
        
        let difficulty = config.difficulty
        if (difficulty === 'mixed') {
          difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
        }
        
        const difficultyTasks = typeTasks[difficulty]
        if (difficultyTasks.length === 0) continue
        
        const randomTask = difficultyTasks[Math.floor(Math.random() * difficultyTasks.length)]
        
        let timeFrame = config.timeFrame
        if (timeFrame === 'mixed') {
          timeFrame = ['5min', '15min', '30min', '1hour', 'flexible'][Math.floor(Math.random() * 5)] as any
        }
        
        tasks.push({
          id: `task_${Date.now()}_${i}`,
          title: randomTask.title,
          description: config.includeDescription ? randomTask.description : '',
          category: randomType,
          difficulty,
          timeFrame: randomTask.timeFrame || timeFrame,
          tips: config.includeTips ? randomTask.tips : [],
          isCompleted: false,
          timestamp: new Date(),
          priority: randomTask.priority as 'low' | 'medium' | 'high'
        })
      }
      
      setGeneratedTasks([...tasks, ...generatedTasks.slice(0, 12)]) // Keep last 15 tasks
      
    } catch (error) {
      console.error('Error generating tasks:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addCustomTask = () => {
    if (!customTask.trim()) return
    
    const newTask: GeneratedTask = {
      id: `custom_${Date.now()}`,
      title: customTask.trim(),
      description: 'Custom task',
      category: 'custom',
      difficulty: 'medium',
      timeFrame: 'flexible',
      tips: [],
      isCompleted: false,
      timestamp: new Date(),
      priority: 'medium'
    }
    
    setGeneratedTasks([newTask, ...generatedTasks])
    setCustomTask('')
  }

  const toggleTaskCompletion = (taskId: string) => {
    setGeneratedTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    )
  }

  const removeTask = (taskId: string) => {
    setGeneratedTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const toggleTaskType = (type: string) => {
    setConfig(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }))
  }

  const copyTask = (task: GeneratedTask) => {
    const text = `${task.title}\n\n${task.description}\n\nDifficulty: ${task.difficulty}\nTime: ${task.timeFrame}\n\nTips:\n${task.tips.map(tip => `- ${tip}`).join('\n')}`
    navigator.clipboard.writeText(text)
  }

  const downloadTasks = () => {
    if (generatedTasks.length === 0) return
    
    const content = generatedTasks.map((task, index) => {
      const status = task.isCompleted ? '✓' : '○'
      const tips = task.tips.length > 0 ? `\nTips:\n${task.tips.map(tip => `- ${tip}`).join('\n')}` : ''
      return `${status} ${task.title}\n${task.description}\nCategory: ${task.category} | Difficulty: ${task.difficulty} | Time: ${task.timeFrame}${tips}\n`
    }).join('\n')
    
    const header = `Task List\nGenerated: ${new Date().toLocaleString()}\nTotal Tasks: ${generatedTasks.length}\nCompleted: ${generatedTasks.filter(t => t.isCompleted).length}\n\n`
    const blob = new Blob([header + content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `task-list-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'daily' | 'creative' | 'wellness' | 'productivity') => {
    switch (preset) {
      case 'daily':
        setConfig({
          types: ['daily', 'productivity'],
          difficulty: 'easy',
          timeFrame: '15min',
          category: 'personal',
          includeDescription: true,
          includeTips: true
        })
        break
      case 'creative':
        setConfig({
          types: ['creative', 'adventure'],
          difficulty: 'medium',
          timeFrame: '30min',
          category: 'creative',
          includeDescription: true,
          includeTips: true
        })
        break
      case 'wellness':
        setConfig({
          types: ['physical', 'mindful'],
          difficulty: 'easy',
          timeFrame: 'mixed',
          category: 'physical',
          includeDescription: true,
          includeTips: true
        })
        break
      case 'productivity':
        setConfig({
          types: ['productivity', 'learning'],
          difficulty: 'medium',
          timeFrame: '30min',
          category: 'personal',
          includeDescription: true,
          includeTips: true
        })
        break
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-red-400'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-400'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-400',
      medium: 'text-yellow-400',
      hard: 'text-red-400'
    }
    return colors[difficulty as keyof typeof colors] || 'text-gray-400'
  }

  const getCategoryIcon = (category: string) => {
    const type = taskTypes.find(t => t.key === category)
    return type ? type.icon : '📋'
  }

  const completedTasks = generatedTasks.filter(task => task.isCompleted).length
  const totalTasks = generatedTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <CheckSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Random Task Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate personalized tasks to boost productivity, creativity, and personal growth. Turn idle time into meaningful activities!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckSquare className="h-5 w-5" />
                  Task Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your task generation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 任务类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Task Types ({config.types.length} selected)</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {taskTypes.map(type => (
                      <button
                        key={type.key}
                        onClick={() => toggleTaskType(type.key)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.types.includes(type.key)
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {type.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 难度级别 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Difficulty</Label>
                  <select
                    value={config.difficulty}
                    onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="easy" className="bg-slate-800">Easy - Simple tasks</option>
                    <option value="medium" className="bg-slate-800">Medium - Moderate tasks</option>
                    <option value="hard" className="bg-slate-800">Hard - Challenging tasks</option>
                    <option value="mixed" className="bg-slate-800">Mixed - All levels</option>
                  </select>
                </div>

                {/* 时间框架 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Time Frame</Label>
                  <select
                    value={config.timeFrame}
                    onChange={(e) => setConfig(prev => ({ ...prev, timeFrame: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="5min" className="bg-slate-800">5 minutes</option>
                    <option value="15min" className="bg-slate-800">15 minutes</option>
                    <option value="30min" className="bg-slate-800">30 minutes</option>
                    <option value="1hour" className="bg-slate-800">1 hour</option>
                    <option value="flexible" className="bg-slate-800">Flexible</option>
                    <option value="mixed" className="bg-slate-800">Mixed</option>
                  </select>
                </div>

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeDescription}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeDescription: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include descriptions</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeTips}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeTips: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include helpful tips</span>
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
                      onClick={() => loadPreset('daily')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Home className="h-3 w-3 mr-1" />
                      Daily
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('creative')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Creative
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('wellness')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Wellness
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('productivity')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Productivity
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateTasks}
                  disabled={isGenerating || config.types.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Tasks...
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Generate Tasks
                    </>
                  )}
                </Button>

                {/* 添加自定义任务 */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <Label className="text-slate-300">Add Custom Task</Label>
                  <div className="flex gap-2">
                    <Input
                      value={customTask}
                      onChange={(e) => setCustomTask(e.target.value)}
                      placeholder="Enter custom task"
                      className="bg-white/10 border-white/20 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
                    />
                    <Button
                      onClick={addCustomTask}
                      disabled={!customTask.trim()}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 进度统计 */}
            {totalTasks > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Completed</span>
                      <span className="text-white">{completedTasks}/{totalTasks}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <div className="text-center text-lg font-bold text-emerald-400">
                      {completionRate}% Complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：任务列表 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedTasks.length > 0 ? (
              <>
                {/* 导出按钮 */}
                <div className="flex justify-end">
                  <Button
                    onClick={downloadTasks}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Tasks
                  </Button>
                </div>

                {/* 任务列表 */}
                <div className="space-y-4">
                  {generatedTasks.map((task, index) => (
                    <Card 
                      key={task.id} 
                      className={`border-white/20 transition-all ${
                        task.isCompleted ? 'bg-white/5 opacity-75' : 'bg-white/10'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                task.isCompleted
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-white/40 hover:border-emerald-400'
                              }`}
                            >
                              {task.isCompleted && <CheckSquare className="h-4 w-4" />}
                            </button>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{getCategoryIcon(task.category)}</span>
                                <h3 className={`text-lg font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                                  {task.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className={`px-2 py-1 rounded ${getDifficultyColor(task.difficulty)} bg-white/10`}>
                                  {task.difficulty}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-400">{task.timeFrame}</span>
                                <span className="text-slate-400">•</span>
                                <span className={`${getPriorityColor(task.priority)}`}>
                                  {task.priority} priority
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => copyTask(task)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => removeTask(task.id)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`mb-3 ${task.isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                            {task.description}
                          </p>
                        )}
                        
                        {task.tips.length > 0 && (
                          <div className="mb-3">
                            <h4 className={`font-medium mb-2 ${task.isCompleted ? 'text-slate-500' : 'text-white'}`}>
                              Tips:
                            </h4>
                            <ul className={`space-y-1 text-sm ${task.isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                              {task.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-2">
                                  <span className="text-emerald-400 mt-1">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/10">
                          <span>Generated {task.timestamp.toLocaleString()}</span>
                          <span>Task #{index + 1}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <CheckSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to be productive?</p>
                  <p>Select task types and click "Generate Tasks"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Task Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">8 Task Categories</h4>
                    <p className="text-sm">Choose from daily tasks, creative projects, physical activities, social interactions, learning, mindfulness, productivity, and adventures.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Smart Difficulty Matching</h4>
                    <p className="text-sm">Tasks are matched to your available time and energy level. Start easy and gradually increase difficulty.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Progress Tracking</h4>
                    <p className="text-sm">Check off completed tasks and track your productivity with completion rates and statistics.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Beating procrastination</li>
                      <li>Finding purposeful activities</li>
                      <li>Building new habits</li>
                      <li>Personal development</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Productivity challenges</li>
                      <li>Skill development</li>
                      <li>Creative inspiration</li>
                      <li>Goal achievement</li>
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