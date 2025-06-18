"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HelpCircle, RefreshCw, Copy, Download, Brain, Star, CheckCircle, XCircle, Timer } from 'lucide-react'

interface QuestionConfig {
  type: string
  difficulty: string
  category: string
  includeAnswers: boolean
  includeExplanations: boolean
  questionCount: number
}

interface GeneratedQuestion {
  id: string
  type: string
  difficulty: string
  category: string
  question: string
  options?: string[]
  answer: string
  explanation: string
  points: number
  estimatedTime: number
  tags: string[]
  timestamp: Date
}

export default function QuestionsPage() {
  const [config, setConfig] = useState<QuestionConfig>({
    type: 'multiple_choice',
    difficulty: 'medium',
    category: 'general',
    includeAnswers: true,
    includeExplanations: false,
    questionCount: 5
  })
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({})
  const [showAnswers, setShowAnswers] = useState<{ [key: string]: boolean }>({})

  const questionTypes = [
    { key: 'multiple_choice', name: 'Multiple Choice', icon: '☑️', description: '4 options, 1 correct answer' },
    { key: 'true_false', name: 'True/False', icon: '✅', description: 'Simple yes/no questions' },
    { key: 'fill_blank', name: 'Fill in the Blank', icon: '📝', description: 'Complete the missing text' },
    { key: 'short_answer', name: 'Short Answer', icon: '💭', description: 'Brief explanatory answers' },
    { key: 'matching', name: 'Matching', icon: '🔗', description: 'Match items from two lists' },
    { key: 'ordering', name: 'Put in Order', icon: '📊', description: 'Arrange items in correct sequence' }
  ]

  const difficulties = [
    { key: 'easy', name: 'Easy', color: 'text-green-400', points: 1, time: 30 },
    { key: 'medium', name: 'Medium', color: 'text-yellow-400', points: 2, time: 60 },
    { key: 'hard', name: 'Hard', color: 'text-red-400', points: 3, time: 120 }
  ]

  const categories = [
    { key: 'general', name: 'General Knowledge', icon: '🧠', description: 'Mixed topics and common knowledge' },
    { key: 'science', name: 'Science', icon: '🔬', description: 'Physics, chemistry, biology' },
    { key: 'history', name: 'History', icon: '📚', description: 'World history and events' },
    { key: 'geography', name: 'Geography', icon: '🌍', description: 'Countries, capitals, landmarks' },
    { key: 'literature', name: 'Literature', icon: '📖', description: 'Books, authors, poetry' },
    { key: 'math', name: 'Mathematics', icon: '🔢', description: 'Numbers, equations, logic' },
    { key: 'technology', name: 'Technology', icon: '💻', description: 'Computers, internet, programming' },
    { key: 'sports', name: 'Sports', icon: '⚽', description: 'Games, athletes, records' },
    { key: 'entertainment', name: 'Entertainment', icon: '🎬', description: 'Movies, music, celebrities' },
    { key: 'food', name: 'Food & Cooking', icon: '🍳', description: 'Cuisine, recipes, nutrition' }
  ]

  const questionBank = {
    general: {
      easy: [
        {
          type: 'multiple_choice',
          question: 'What color do you get when you mix red and yellow?',
          options: ['Green', 'Orange', 'Purple', 'Blue'],
          answer: 'Orange',
          explanation: 'Red and yellow are primary colors that combine to create the secondary color orange.',
          tags: ['colors', 'art', 'basic']
        },
        {
          type: 'true_false',
          question: 'The Earth is flat.',
          answer: 'False',
          explanation: 'The Earth is spherical (technically an oblate spheroid), not flat. This has been scientifically proven.',
          tags: ['science', 'earth', 'geography']
        },
        {
          type: 'fill_blank',
          question: 'The capital of France is _____.',
          answer: 'Paris',
          explanation: 'Paris has been the capital of France since the 12th century.',
          tags: ['geography', 'europe', 'capitals']
        }
      ],
      medium: [
        {
          type: 'multiple_choice',
          question: 'Which planet is known as the "Red Planet"?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          answer: 'Mars',
          explanation: 'Mars appears red due to iron oxide (rust) on its surface, earning it the nickname "Red Planet".',
          tags: ['astronomy', 'planets', 'space']
        },
        {
          type: 'short_answer',
          question: 'What is the process by which plants make their own food using sunlight?',
          answer: 'Photosynthesis',
          explanation: 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.',
          tags: ['biology', 'plants', 'science']
        }
      ],
      hard: [
        {
          type: 'multiple_choice',
          question: 'Who wrote the novel "One Hundred Years of Solitude"?',
          options: ['Mario Vargas Llosa', 'Gabriel García Márquez', 'Jorge Luis Borges', 'Pablo Neruda'],
          answer: 'Gabriel García Márquez',
          explanation: 'Gabriel García Márquez wrote this masterpiece of magical realism, published in 1967.',
          tags: ['literature', 'latin-america', 'novels']
        }
      ]
    },
    science: {
      easy: [
        {
          type: 'true_false',
          question: 'Water boils at 100 degrees Celsius at sea level.',
          answer: 'True',
          explanation: 'At standard atmospheric pressure (sea level), water boils at exactly 100°C or 212°F.',
          tags: ['physics', 'temperature', 'water']
        },
        {
          type: 'multiple_choice',
          question: 'Which gas do plants absorb from the air during photosynthesis?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
          answer: 'Carbon Dioxide',
          explanation: 'Plants absorb CO₂ from the air and convert it into glucose using sunlight and water.',
          tags: ['biology', 'photosynthesis', 'gases']
        }
      ],
      medium: [
        {
          type: 'multiple_choice',
          question: 'What is the chemical symbol for gold?',
          options: ['Go', 'Gd', 'Au', 'Ag'],
          answer: 'Au',
          explanation: 'Au comes from the Latin word "aurum" meaning gold. Ag is silver, not gold.',
          tags: ['chemistry', 'elements', 'symbols']
        },
        {
          type: 'fill_blank',
          question: 'The speed of light in a vacuum is approximately _____ million meters per second.',
          answer: '300',
          explanation: 'Light travels at 299,792,458 meters per second in a vacuum, commonly rounded to 300 million m/s.',
          tags: ['physics', 'light', 'speed']
        }
      ],
      hard: [
        {
          type: 'short_answer',
          question: 'What is the name of the theoretical boundary around a black hole beyond which nothing can escape?',
          answer: 'Event Horizon',
          explanation: 'The event horizon is the point of no return around a black hole where the escape velocity exceeds the speed of light.',
          tags: ['astronomy', 'black-holes', 'physics']
        }
      ]
    },
    math: {
      easy: [
        {
          type: 'multiple_choice',
          question: 'What is 7 × 8?',
          options: ['54', '56', '48', '64'],
          answer: '56',
          explanation: '7 multiplied by 8 equals 56. This is a basic multiplication fact.',
          tags: ['arithmetic', 'multiplication', 'basic']
        },
        {
          type: 'fill_blank',
          question: 'A triangle has _____ sides.',
          answer: '3',
          explanation: 'By definition, a triangle is a polygon with exactly three sides and three angles.',
          tags: ['geometry', 'shapes', 'basic']
        }
      ],
      medium: [
        {
          type: 'multiple_choice',
          question: 'What is the value of π (pi) to two decimal places?',
          options: ['3.14', '3.16', '3.12', '3.18'],
          answer: '3.14',
          explanation: 'Pi (π) is approximately 3.14159..., which rounds to 3.14 to two decimal places.',
          tags: ['geometry', 'constants', 'decimals']
        },
        {
          type: 'short_answer',
          question: 'If a circle has a radius of 5 units, what is its diameter?',
          answer: '10',
          explanation: 'The diameter is twice the radius. Since radius = 5, diameter = 2 × 5 = 10 units.',
          tags: ['geometry', 'circles', 'radius']
        }
      ],
      hard: [
        {
          type: 'multiple_choice',
          question: 'What is the derivative of x² with respect to x?',
          options: ['x', '2x', 'x²', '2x²'],
          answer: '2x',
          explanation: 'Using the power rule for derivatives: d/dx(xⁿ) = n·xⁿ⁻¹, so d/dx(x²) = 2x¹ = 2x.',
          tags: ['calculus', 'derivatives', 'advanced']
        }
      ]
    },
    technology: {
      easy: [
        {
          type: 'true_false',
          question: 'HTML stands for HyperText Markup Language.',
          answer: 'True',
          explanation: 'HTML is indeed an acronym for HyperText Markup Language, used for creating web pages.',
          tags: ['web', 'html', 'acronyms']
        }
      ],
      medium: [
        {
          type: 'multiple_choice',
          question: 'Which company developed the Java programming language?',
          options: ['Microsoft', 'Apple', 'Sun Microsystems', 'Google'],
          answer: 'Sun Microsystems',
          explanation: 'Java was originally developed by Sun Microsystems in 1995. Oracle later acquired Sun Microsystems.',
          tags: ['programming', 'java', 'companies']
        }
      ],
      hard: [
        {
          type: 'short_answer',
          question: 'What does REST stand for in web API development?',
          answer: 'Representational State Transfer',
          explanation: 'REST is an architectural style for designing networked applications, emphasizing stateless communication.',
          tags: ['api', 'web-development', 'architecture']
        }
      ]
    }
  }

  const generateQuestions = async () => {
    setIsGenerating(true)
    
    try {
      const categoryBank = questionBank[config.category as keyof typeof questionBank] || questionBank.general
      const difficultyBank = categoryBank[config.difficulty as keyof typeof categoryBank] || []
      
      if (difficultyBank.length === 0) {
        // Generate placeholder questions if no bank available
        const placeholders = generatePlaceholderQuestions()
        setGeneratedQuestions(placeholders)
        return
      }
      
      const newQuestions: GeneratedQuestion[] = []
      
      for (let i = 0; i < config.questionCount; i++) {
        const randomQuestion = difficultyBank[Math.floor(Math.random() * difficultyBank.length)]
        const difficultyInfo = difficulties.find(d => d.key === config.difficulty)!
        
        // Filter questions by type if specified
        if (config.type !== 'mixed' && randomQuestion.type !== config.type) {
          // Try to find a question of the right type, otherwise use any
          const typeMatch = difficultyBank.find(q => q.type === config.type)
          if (typeMatch) {
            Object.assign(randomQuestion, typeMatch)
          }
        }
        
        const question: GeneratedQuestion = {
          id: `question_${Date.now()}_${i}`,
          type: randomQuestion.type,
          difficulty: config.difficulty,
          category: config.category,
          question: randomQuestion.question,
          options: (randomQuestion as any).options || undefined,
          answer: config.includeAnswers ? randomQuestion.answer : '',
          explanation: config.includeExplanations ? randomQuestion.explanation : '',
          points: difficultyInfo.points,
          estimatedTime: difficultyInfo.time,
          tags: randomQuestion.tags || [],
          timestamp: new Date()
        }
        
        newQuestions.push(question)
      }
      
      setGeneratedQuestions(newQuestions)
      setUserAnswers({})
      setShowAnswers({})
      
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePlaceholderQuestions = (): GeneratedQuestion[] => {
    const placeholders = []
    const difficultyInfo = difficulties.find(d => d.key === config.difficulty)!
    
    for (let i = 0; i < config.questionCount; i++) {
      placeholders.push({
        id: `placeholder_${Date.now()}_${i}`,
        type: config.type === 'mixed' ? 'multiple_choice' : config.type,
        difficulty: config.difficulty,
        category: config.category,
        question: `Sample ${config.category} question #${i + 1} (${config.difficulty} level)`,
        options: config.type === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
        answer: config.includeAnswers ? 'Sample Answer' : '',
        explanation: config.includeExplanations ? 'This is a sample explanation for the question.' : '',
        points: difficultyInfo.points,
        estimatedTime: difficultyInfo.time,
        tags: [config.category, config.difficulty, 'sample'],
        timestamp: new Date()
      })
    }
    
    return placeholders
  }

  const checkAnswer = (questionId: string) => {
    setShowAnswers(prev => ({ ...prev, [questionId]: true }))
  }

  const isCorrectAnswer = (questionId: string) => {
    const question = generatedQuestions.find(q => q.id === questionId)
    const userAnswer = userAnswers[questionId]
    return question && userAnswer && userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim()
  }

  const copyQuestions = () => {
    const content = generatedQuestions.map((q, index) => {
      let questionText = `Question ${index + 1}: ${q.question}\n`
      
      if (q.options) {
        q.options.forEach((option, i) => {
          questionText += `${String.fromCharCode(65 + i)}. ${option}\n`
        })
      }
      
      if (config.includeAnswers) {
        questionText += `Answer: ${q.answer}\n`
      }
      
      if (config.includeExplanations && q.explanation) {
        questionText += `Explanation: ${q.explanation}\n`
      }
      
      questionText += `Difficulty: ${q.difficulty} | Points: ${q.points} | Time: ${q.estimatedTime}s\n\n`
      
      return questionText
    }).join('')
    
    navigator.clipboard.writeText(content)
  }

  const downloadQuestions = () => {
    const content = `Quiz: ${config.category.charAt(0).toUpperCase() + config.category.slice(1)} Questions
Difficulty: ${config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)}
Generated: ${new Date().toLocaleString()}
Total Questions: ${generatedQuestions.length}
Estimated Time: ${generatedQuestions.reduce((sum, q) => sum + q.estimatedTime, 0)} seconds

${generatedQuestions.map((q, index) => {
  let questionText = `Question ${index + 1}: ${q.question}\n`
  
  if (q.options) {
    q.options.forEach((option, i) => {
      questionText += `${String.fromCharCode(65 + i)}. ${option}\n`
    })
  }
  
  if (config.includeAnswers) {
    questionText += `Answer: ${q.answer}\n`
  }
  
  if (config.includeExplanations && q.explanation) {
    questionText += `Explanation: ${q.explanation}\n`
  }
  
  questionText += `Difficulty: ${q.difficulty} | Points: ${q.points} | Time: ${q.estimatedTime}s | Tags: ${q.tags.join(', ')}\n\n`
  
  return questionText
}).join('')}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `quiz-${config.category}-${config.difficulty}-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'quick_quiz' | 'study_session' | 'exam_prep' | 'trivia_night') => {
    switch (preset) {
      case 'quick_quiz':
        setConfig({
          type: 'multiple_choice',
          difficulty: 'easy',
          category: 'general',
          includeAnswers: true,
          includeExplanations: false,
          questionCount: 5
        })
        break
      case 'study_session':
        setConfig({
          type: 'mixed',
          difficulty: 'medium',
          category: 'science',
          includeAnswers: true,
          includeExplanations: true,
          questionCount: 10
        })
        break
      case 'exam_prep':
        setConfig({
          type: 'short_answer',
          difficulty: 'hard',
          category: 'math',
          includeAnswers: false,
          includeExplanations: false,
          questionCount: 15
        })
        break
      case 'trivia_night':
        setConfig({
          type: 'multiple_choice',
          difficulty: 'medium',
          category: 'general',
          includeAnswers: true,
          includeExplanations: true,
          questionCount: 20
        })
        break
    }
  }

  const calculateScore = () => {
    const correctAnswers = generatedQuestions.filter(q => isCorrectAnswer(q.id)).length
    const totalQuestions = generatedQuestions.length
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    return { correct: correctAnswers, total: totalQuestions, percentage }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Question Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random questions for quizzes, study sessions, and trivia. Multiple question types and difficulty levels!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5" />
                  Question Configuration
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your question parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 题目类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Question Type</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {[{ key: 'mixed', name: 'Mixed Types', icon: '🎲', description: 'Random question types' }, ...questionTypes].map(type => (
                      <button
                        key={type.key}
                        onClick={() => setConfig(prev => ({ ...prev, type: type.key }))}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          config.type === type.key
                            ? 'bg-green-500/20 border-green-400 text-green-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{type.icon}</span>
                          <span className="text-xs font-medium">{type.name}</span>
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
                  <Label className="text-slate-300">Difficulty Level</Label>
                  <div className="space-y-2">
                    {difficulties.map(difficulty => (
                      <label
                        key={difficulty.key}
                        className="flex items-center gap-2 text-white cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          value={difficulty.key}
                          checked={config.difficulty === difficulty.key}
                          onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="rounded"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <span className={`text-sm font-medium ${difficulty.color}`}>{difficulty.name}</span>
                          <div className="flex gap-1">
                            {Array.from({ length: difficulty.points }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${difficulty.color}`} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-xs text-slate-400">~{difficulty.time}s</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 题目类别 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Category</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <button
                        key={category.key}
                        onClick={() => setConfig(prev => ({ ...prev, category: category.key }))}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          config.category === category.key
                            ? 'bg-green-500/20 border-green-400 text-green-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{category.icon}</span>
                          <span className="text-xs font-medium">{category.name}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {category.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 题目数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Questions</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={config.questionCount}
                    onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 5 }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeAnswers}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeAnswers: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include answers</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeExplanations}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeExplanations: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include explanations</span>
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
                      onClick={() => loadPreset('quick_quiz')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      ⚡ Quick Quiz
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('study_session')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📚 Study
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('exam_prep')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🎓 Exam Prep
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('trivia_night')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🎉 Trivia
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateQuestions}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 得分统计 */}
            {generatedQuestions.length > 0 && Object.keys(userAnswers).length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Star className="h-5 w-5" />
                    Quiz Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const score = calculateScore()
                    return (
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-1">
                            {score.percentage}%
                          </div>
                          <div className="text-slate-300 text-sm">
                            {score.correct} / {score.total} correct
                          </div>
                        </div>
                        
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${score.percentage}%` }}
                          />
                        </div>
                        
                        <div className="text-xs text-slate-400 text-center">
                          Total Points: {generatedQuestions.filter(q => isCorrectAnswer(q.id)).reduce((sum, q) => sum + q.points, 0)} / {generatedQuestions.reduce((sum, q) => sum + q.points, 0)}
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：生成的题目 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedQuestions.length > 0 ? (
              <>
                {/* 题目操作按钮 */}
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-white font-medium">
                          {generatedQuestions.length} Questions Generated
                        </span>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Timer className="h-4 w-4" />
                          <span className="text-sm">
                            ~{generatedQuestions.reduce((sum, q) => sum + q.estimatedTime, 0)} seconds
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={copyQuestions}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy All
                        </Button>
                        <Button
                          onClick={downloadQuestions}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 题目列表 */}
                {generatedQuestions.map((question, index) => (
                  <Card key={question.id} className="bg-white/10 border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-green-400" />
                            Question {index + 1}
                          </CardTitle>
                          <CardDescription className="text-slate-300">
                            {question.type.replace('_', ' ')} • {question.difficulty} • {question.points} pts • ~{question.estimatedTime}s
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {showAnswers[question.id] && userAnswers[question.id] && (
                            isCorrectAnswer(question.id) ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400" />
                            )
                          )}
                          <Button
                            onClick={() => checkAnswer(question.id)}
                            disabled={!userAnswers[question.id] || showAnswers[question.id]}
                            size="sm"
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            Check Answer
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* 题目 */}
                      <div className="mb-4">
                        <p className="text-white text-lg mb-3">{question.question}</p>
                        
                        {/* 选择题选项 */}
                        {question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, i) => (
                              <label
                                key={i}
                                className="flex items-center gap-2 text-white cursor-pointer p-2 rounded hover:bg-white/5"
                              >
                                <input
                                  type="radio"
                                  name={`question_${question.id}`}
                                  value={option}
                                  checked={userAnswers[question.id] === option}
                                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                                  className="rounded"
                                />
                                <span className="text-sm">
                                  {String.fromCharCode(65 + i)}. {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {/* 其他题目类型的输入 */}
                        {!question.options && (
                          <Input
                            value={userAnswers[question.id] || ''}
                            onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                            placeholder="Enter your answer..."
                            className="bg-white/10 border-white/20 text-white"
                          />
                        )}
                      </div>

                      {/* 答案和解释 */}
                      {showAnswers[question.id] && (
                        <div className="bg-slate-800 border border-white/20 rounded p-4 space-y-3">
                          {question.answer && (
                            <div>
                              <h4 className="text-green-400 font-medium mb-1">Correct Answer:</h4>
                              <p className="text-white">{question.answer}</p>
                            </div>
                          )}
                          
                          {question.explanation && (
                            <div>
                              <h4 className="text-blue-400 font-medium mb-1">Explanation:</h4>
                              <p className="text-slate-300">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 标签 */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                        <div className="flex flex-wrap gap-1">
                          {question.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">
                          Generated {question.timestamp.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate questions?</p>
                  <p>Configure your preferences and click "Generate Questions"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Question Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">6 Question Types</h4>
                    <p className="text-sm">Multiple choice, true/false, fill-in-the-blank, short answer, matching, and ordering questions.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">10 Subject Categories</h4>
                    <p className="text-sm">From general knowledge to specific subjects like science, math, history, technology, and more.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">3 Difficulty Levels</h4>
                    <p className="text-sm">Easy, medium, and hard questions with different point values and time estimates.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Quiz creation</li>
                      <li>Study sessions</li>
                      <li>Exam preparation</li>
                      <li>Educational content</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Trivia nights</li>
                      <li>Classroom activities</li>
                      <li>Self-assessment</li>
                      <li>Knowledge testing</li>
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