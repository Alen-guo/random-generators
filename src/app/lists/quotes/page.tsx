"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Quote, RefreshCw, Copy, Heart, Star, BookOpen, Lightbulb } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface QuoteItem {
  text: string
  author: string
  category: string
  id: number
}

interface GeneratedQuote extends QuoteItem {
  timestamp: Date
  liked: boolean
}

export default function QuotesPage() {
  const containerRef = useTranslationProtection()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['motivational'])
  const [currentQuote, setCurrentQuote] = useState<QuoteItem | null>(null)
  const [quoteHistory, setQuoteHistory] = useState<GeneratedQuote[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [customQuotes, setCustomQuotes] = useState<QuoteItem[]>([])
  const [newQuoteText, setNewQuoteText] = useState('')
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('')

  const categories = [
    'motivational', 'wisdom', 'success', 'life', 'love', 'happiness',
    'friendship', 'leadership', 'creativity', 'perseverance', 'faith', 'humor'
  ]

  const predefinedQuotes: QuoteItem[] = [
    // Motivational
    { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivational" },
    { id: 2, text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "motivational" },
    { id: 3, text: "Your limitation—it's only your imagination.", author: "Unknown", category: "motivational" },
    { id: 4, text: "Great things never come from comfort zones.", author: "Unknown", category: "motivational" },
    { id: 5, text: "Dream it. Wish it. Do it.", author: "Unknown", category: "motivational" },
    
    // Wisdom
    { id: 6, text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom" },
    { id: 7, text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "wisdom" },
    { id: 8, text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "wisdom" },
    { id: 9, text: "Yesterday is history, tomorrow is a mystery, today is a gift.", author: "Eleanor Roosevelt", category: "wisdom" },
    
    // Success
    { id: 10, text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
    { id: 11, text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis", category: "success" },
    { id: 12, text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "success" },
    
    // Life
    { id: 13, text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "life" },
    { id: 14, text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "life" },
    { id: 15, text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "life" },
    
    // Love
    { id: 16, text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu", category: "love" },
    { id: 17, text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", category: "love" },
    
    // Happiness
    { id: 18, text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "happiness" },
    { id: 19, text: "The most important thing is to enjoy your life—to be happy—it's all that matters.", author: "Steve Jobs", category: "happiness" },
    
    // Leadership
    { id: 20, text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell", category: "leadership" },
    { id: 21, text: "The greatest leader is not necessarily the one who does the greatest things.", author: "Ronald Reagan", category: "leadership" },
    
    // Creativity
    { id: 22, text: "Creativity is intelligence having fun.", author: "Albert Einstein", category: "creativity" },
    { id: 23, text: "The creative adult is the child who survived.", author: "Ursula K. Le Guin", category: "creativity" },
    
    // Humor
    { id: 24, text: "I'm not arguing, I'm just explaining why I'm right.", author: "Unknown", category: "humor" },
    { id: 25, text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", author: "Unknown", category: "humor" }
  ]

  const generateQuote = async () => {
    setIsGenerating(true)
    
    try {
      // Filter quotes by selected categories
      const allQuotes = [...predefinedQuotes, ...customQuotes]
      const filteredQuotes = allQuotes.filter(quote => 
        selectedCategories.length === 0 || selectedCategories.includes(quote.category)
      )
      
      if (filteredQuotes.length === 0) {
        setIsGenerating(false)
        return
      }
      
      // Animation effect for better UX
      for (let i = 0; i < 3; i++) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]
        setCurrentQuote(randomQuote)
        await new Promise(resolve => setTimeout(resolve, 150))
      }
      
      // Final selection
      const finalQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]
      setCurrentQuote(finalQuote)
      
      const generatedQuote: GeneratedQuote = {
        ...finalQuote,
        timestamp: new Date(),
        liked: false
      }
      
      setQuoteHistory(prev => [generatedQuote, ...prev.slice(0, 19)]) // Keep last 20
      
    } catch (error) {
      console.error('Error generating quote:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const addCustomQuote = () => {
    if (!newQuoteText.trim() || !newQuoteAuthor.trim()) return
    
    const newQuote: QuoteItem = {
      id: Date.now(),
      text: newQuoteText.trim(),
      author: newQuoteAuthor.trim(),
      category: 'custom'
    }
    
    setCustomQuotes(prev => [...prev, newQuote])
    setNewQuoteText('')
    setNewQuoteAuthor('')
  }

  const toggleLike = (index: number) => {
    setQuoteHistory(prev => prev.map((quote, i) => 
      i === index ? { ...quote, liked: !quote.liked } : quote
    ))
  }

  const copyQuote = (quote: QuoteItem) => {
    const text = `"${quote.text}" - ${quote.author}`
    navigator.clipboard.writeText(text)
  }

  const loadPreset = (preset: 'inspiration' | 'wisdom' | 'success' | 'life') => {
    switch (preset) {
      case 'inspiration':
        setSelectedCategories(['motivational', 'creativity'])
        break
      case 'wisdom':
        setSelectedCategories(['wisdom', 'life'])
        break
      case 'success':
        setSelectedCategories(['success', 'leadership'])
        break
      case 'life':
        setSelectedCategories(['life', 'happiness', 'love'])
        break
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'motivational': return '🚀'
      case 'wisdom': return '🧠'
      case 'success': return '🏆'
      case 'life': return '🌱'
      case 'love': return '❤️'
      case 'happiness': return '😊'
      case 'friendship': return '🤝'
      case 'leadership': return '👑'
      case 'creativity': return '🎨'
      case 'perseverance': return '💪'
      case 'faith': return '🙏'
      case 'humor': return '😄'
      case 'custom': return '✨'
      default: return '💭'
    }
  }

  const getFilteredQuotesCount = () => {
    const allQuotes = [...predefinedQuotes, ...customQuotes]
    return allQuotes.filter(quote => 
      selectedCategories.length === 0 || selectedCategories.includes(quote.category)
    ).length
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
              <Quote className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Quote Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Discover inspiring quotes from great minds. Generate random quotes by category or add your own favorites.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：类别选择 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quote Categories</CardTitle>
                <CardDescription className="text-slate-300">
                  Select categories to generate from ({getFilteredQuotesCount()} quotes available)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`p-3 rounded-lg border transition-colors text-sm ${
                        selectedCategories.includes(category)
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg mb-1">{getCategoryIcon(category)}</div>
                      <div className="capitalize">{category}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('inspiration')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Inspiration
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('wisdom')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Wisdom
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('success')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Success
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('life')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Life & Love
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateQuote}
                  disabled={isGenerating || getFilteredQuotesCount() === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Quote className="h-5 w-5 mr-2" />
                      Generate Quote
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 添加自定义名言 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Add Custom Quote</CardTitle>
                <CardDescription className="text-slate-300">
                  Add your favorite quotes to the collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Quote Text</Label>
                  <Input
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    placeholder="Enter the quote..."
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Author</Label>
                  <Input
                    value={newQuoteAuthor}
                    onChange={(e) => setNewQuoteAuthor(e.target.value)}
                    placeholder="Author name..."
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Button
                  onClick={addCustomQuote}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                >
                  Add Quote
                </Button>
                {customQuotes.length > 0 && (
                  <p className="text-slate-400 text-sm text-center">
                    {customQuotes.length} custom quote{customQuotes.length !== 1 ? 's' : ''} added
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 中间：当前名言显示 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Today's Quote</CardTitle>
                  {currentQuote && (
                    <Button
                      onClick={() => copyQuote(currentQuote)}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {currentQuote ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl text-purple-400 mb-4">"</div>
                      <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-6">
                        {currentQuote.text}
                      </blockquote>
                      <div className="text-slate-300 text-lg">
                        — {currentQuote.author}
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="text-2xl">{getCategoryIcon(currentQuote.category)}</span>
                        <span className="text-slate-400 capitalize">{currentQuote.category}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Quote className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready for inspiration?</p>
                    <p>Select categories and generate your first quote!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 名言历史 */}
            {quoteHistory.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Quote History</CardTitle>
                  <CardDescription className="text-slate-300">
                    {quoteHistory.length} recent quotes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {quoteHistory.map((quote, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white font-medium mb-1">"{quote.text}"</p>
                            <p className="text-slate-400 text-sm">— {quote.author}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              onClick={() => toggleLike(index)}
                              size="sm"
                              variant="ghost"
                              className={`${
                                quote.liked 
                                  ? 'text-red-400 hover:text-red-300' 
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${quote.liked ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              onClick={() => copyQuote(quote)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span>{getCategoryIcon(quote.category)}</span>
                            <span className="capitalize">{quote.category}</span>
                          </span>
                          <span>{quote.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">About Quote Generator</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Categories</h4>
                    <p className="text-sm">Filter quotes by topic to find exactly what inspires you.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Custom Quotes</h4>
                    <p className="text-sm">Add your own favorite quotes to personalize your collection.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">History & Favorites</h4>
                    <p className="text-sm">Keep track of generated quotes and mark your favorites with hearts.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Daily motivation</li>
                      <li>Social media posts</li>
                      <li>Presentations</li>
                      <li>Writing inspiration</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Personal reflection</li>
                      <li>Team meetings</li>
                      <li>Educational content</li>
                      <li>Journaling prompts</li>
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