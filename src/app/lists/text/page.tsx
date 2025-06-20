"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, RefreshCw, Copy, Download, Type, BookOpen, Hash } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface TextConfig {
  type: 'lorem' | 'words' | 'sentences' | 'paragraphs' | 'placeholder'
  count: number
  startWithLorem: boolean
  customWords?: string[]
}

interface GeneratedText {
  content: string
  type: string
  count: number
  wordCount: number
  characterCount: number
  timestamp: Date
}

export default function TextPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<TextConfig>({
    type: 'paragraphs',
    count: 3,
    startWithLorem: true
  })
  const [generatedText, setGeneratedText] = useState<GeneratedText | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customWordList, setCustomWordList] = useState('')

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'beatae', 'vitae', 'dicta', 'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas',
    'aspernatur', 'aut', 'odit', 'fugit', 'consequuntur', 'magni', 'dolores',
    'ratione', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem',
    'adipisci', 'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam',
    'quaerat', 'voluptatem'
  ]

  const placeholderPhrases = [
    'Click here to start',
    'Enter your text here',
    'Type something amazing',
    'Your content goes here',
    'Add your message',
    'Write something interesting',
    'Insert your text',
    'Place your content here',
    'Start typing...',
    'Your story begins here',
    'Add your thoughts',
    'Express yourself',
    'Share your ideas',
    'Tell your story',
    'Create something beautiful'
  ]

  const generateRandomWord = (wordList: string[]) => {
    return wordList[Math.floor(Math.random() * wordList.length)]
  }

  const generateWords = (count: number, wordList: string[]): string => {
    const words: string[] = []
    
    if (config.startWithLorem && config.type !== 'placeholder' && wordList === loremWords) {
      words.push('Lorem', 'ipsum')
      count -= 2
    }
    
    for (let i = 0; i < count; i++) {
      words.push(generateRandomWord(wordList))
    }
    
    return words.join(' ')
  }

  const generateSentence = (wordList: string[]): string => {
    const minWords = 5
    const maxWords = 20
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
    const words = generateWords(wordCount, wordList).split(' ')
    
    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    
    return words.join(' ') + '.'
  }

  const generateParagraph = (wordList: string[]): string => {
    const minSentences = 3
    const maxSentences = 8
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences
    const sentences: string[] = []
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(wordList))
    }
    
    return sentences.join(' ')
  }

  const generateText = async () => {
    setIsGenerating(true)
    
    try {
      let content = ''
      const wordList = config.customWords && config.customWords.length > 0 
        ? config.customWords 
        : config.type === 'placeholder' 
          ? placeholderPhrases 
          : loremWords
      
      switch (config.type) {
        case 'words':
          content = generateWords(config.count, wordList)
          break
          
        case 'sentences':
          const sentences: string[] = []
          for (let i = 0; i < config.count; i++) {
            sentences.push(generateSentence(wordList))
            // Add delay for animation
            if (i % 2 === 0) {
              await new Promise(resolve => setTimeout(resolve, 100))
            }
          }
          content = sentences.join(' ')
          break
          
        case 'paragraphs':
        case 'lorem':
          const paragraphs: string[] = []
          for (let i = 0; i < config.count; i++) {
            paragraphs.push(generateParagraph(wordList))
            // Add delay for animation
            await new Promise(resolve => setTimeout(resolve, 200))
          }
          content = paragraphs.join('\n\n')
          break
          
        case 'placeholder':
          const placeholders: string[] = []
          for (let i = 0; i < config.count; i++) {
            placeholders.push(generateRandomWord(wordList))
          }
          content = placeholders.join('\n')
          break
      }
      
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
      const characterCount = content.length
      
      const result: GeneratedText = {
        content,
        type: config.type,
        count: config.count,
        wordCount,
        characterCount,
        timestamp: new Date()
      }
      
      setGeneratedText(result)
    } catch (error) {
      console.error('Error generating text:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyText = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText.content)
    }
  }

  const downloadText = () => {
    if (!generatedText) return
    
    const blob = new Blob([generatedText.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `generated-text-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'article' | 'short' | 'long' | 'placeholder') => {
    switch (preset) {
      case 'article':
        setConfig({ type: 'paragraphs', count: 5, startWithLorem: true })
        break
      case 'short':
        setConfig({ type: 'sentences', count: 3, startWithLorem: true })
        break
      case 'long':
        setConfig({ type: 'paragraphs', count: 10, startWithLorem: true })
        break
      case 'placeholder':
        setConfig({ type: 'placeholder', count: 5, startWithLorem: false })
        break
    }
  }

  const parseCustomWords = () => {
    if (!customWordList.trim()) {
      setConfig(prev => ({ ...prev, customWords: undefined }))
      return
    }
    
    const words = customWordList
      .split(/[,\n\s]+/)
      .map(word => word.trim())
      .filter(word => word.length > 0)
    
    setConfig(prev => ({ ...prev, customWords: words }))
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lorem': return 'Lorem Ipsum'
      case 'words': return 'Words'
      case 'sentences': return 'Sentences'
      case 'paragraphs': return 'Paragraphs'
      case 'placeholder': return 'Placeholders'
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Text Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random text for your designs, prototypes, and content creation. From Lorem Ipsum to custom placeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Type className="h-5 w-5" />
                  Text Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your text generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 文本类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Text Type</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'paragraphs', label: 'Paragraphs', icon: '📄' },
                      { key: 'sentences', label: 'Sentences', icon: '📝' },
                      { key: 'words', label: 'Words', icon: '🔤' },
                      { key: 'placeholder', label: 'Placeholders', icon: '📋' }
                    ].map(type => (
                      <button
                        key={type.key}
                        onClick={() => setConfig(prev => ({ ...prev, type: type.key as any }))}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          config.type === type.key
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 数量设置 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {config.type === 'words' ? 'Word Count' :
                     config.type === 'sentences' ? 'Sentence Count' :
                     config.type === 'paragraphs' ? 'Paragraph Count' :
                     'Item Count'}
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={config.type === 'words' ? 500 : config.type === 'sentences' ? 50 : 20}
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      count: Math.max(1, parseInt(e.target.value) || 1)
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* Lorem Ipsum选项 */}
                {config.type !== 'placeholder' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Options</Label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.startWithLorem}
                        onChange={(e) => setConfig(prev => ({ ...prev, startWithLorem: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Start with "Lorem ipsum"</span>
                    </label>
                  </div>
                )}

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('short')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Short
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('article')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Article
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('long')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      Long
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('placeholder')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Type className="h-3 w-3 mr-1" />
                      Placeholder
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateText}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 自定义词汇 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Custom Words</CardTitle>
                <CardDescription className="text-slate-300">
                  Use your own words instead of Lorem Ipsum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Word List</Label>
                  <Textarea
                    placeholder="Enter words separated by commas or new lines..."
                    value={customWordList}
                    onChange={(e) => setCustomWordList(e.target.value)}
                    className="bg-white/10 border-white/20 text-white min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={parseCustomWords}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                >
                  Apply Custom Words
                </Button>
                {config.customWords && (
                  <p className="text-slate-400 text-sm text-center">
                    {config.customWords.length} custom words loaded
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的文本 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated Text</CardTitle>
                    <CardDescription className="text-slate-300">
                      {generatedText ? `${getTypeLabel(generatedText.type)} • ${generatedText.wordCount} words • ${generatedText.characterCount} characters` : 'No text generated yet'}
                    </CardDescription>
                  </div>
                  {generatedText && (
                    <div className="flex gap-2">
                      <Button
                        onClick={copyText}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadText}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedText ? (
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/20 rounded-lg p-6 max-h-96 overflow-auto">
                      <div className="text-white leading-relaxed whitespace-pre-wrap">
                        {generatedText.content}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-slate-400 text-sm">Words</div>
                        <div className="text-white font-bold text-lg">{generatedText.wordCount}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-slate-400 text-sm">Characters</div>
                        <div className="text-white font-bold text-lg">{generatedText.characterCount}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-slate-400 text-sm">Generated</div>
                        <div className="text-white font-bold text-sm">
                          {generatedText.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate text?</p>
                    <p>Configure your settings and click "Generate Text"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">How to Use Text Generator</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Text Types</h4>
                    <p className="text-sm">Choose between paragraphs, sentences, words, or placeholder text.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Custom Words</h4>
                    <p className="text-sm">Replace Lorem Ipsum with your own vocabulary for themed content.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Quick Presets</h4>
                    <p className="text-sm">Use presets for common scenarios like articles, short content, or placeholders.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Website mockups</li>
                      <li>Design prototypes</li>
                      <li>Content placeholders</li>
                      <li>Typography testing</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Layout design</li>
                      <li>Print materials</li>
                      <li>Blog templates</li>
                      <li>Writing practice</li>
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