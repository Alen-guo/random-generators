"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/common/Navigation'
import { Copy, Download, RefreshCw, FileText, Type, AlignLeft, Hash, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

// Lorem ipsum 基础文本库
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos', 'accusamus', 'accusantium',
  'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt',
  'explicabo', 'nemo', 'enim', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
  'odit', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione',
  'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'est', 'qui', 'dolorem', 'adipisci',
  'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'aliquam', 'quaerat', 'voluptatem'
]

const CLASSIC_LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

interface LoremConfig {
  type: 'words' | 'sentences' | 'paragraphs'
  count: number
  startWithLorem: boolean
  capitalize: boolean
  addPunctuation: boolean
  includeHtml: boolean
  htmlTag: string
  wordsPerSentence: [number, number]
  sentencesPerParagraph: [number, number]
}

interface GeneratedText {
  content: string
  wordCount: number
  characterCount: number
  paragraphCount: number
  sentenceCount: number
}

const presets = [
  {
    name: 'Short Text',
    description: '2-3 sentences for brief content',
    config: { type: 'sentences' as const, count: 3, startWithLorem: true, capitalize: true, addPunctuation: true, includeHtml: false, htmlTag: 'p', wordsPerSentence: [8, 15] as [number, number], sentencesPerParagraph: [3, 6] as [number, number] }
  },
  {
    name: 'Paragraph',
    description: 'Single paragraph for content blocks',
    config: { type: 'paragraphs' as const, count: 1, startWithLorem: true, capitalize: true, addPunctuation: true, includeHtml: false, htmlTag: 'p', wordsPerSentence: [10, 20] as [number, number], sentencesPerParagraph: [4, 8] as [number, number] }
  },
  {
    name: 'Article Content',
    description: 'Multiple paragraphs for articles',
    config: { type: 'paragraphs' as const, count: 5, startWithLorem: true, capitalize: true, addPunctuation: true, includeHtml: true, htmlTag: 'p', wordsPerSentence: [12, 25] as [number, number], sentencesPerParagraph: [4, 7] as [number, number] }
  },
  {
    name: 'Keywords',
    description: 'List of words for SEO/tags',
    config: { type: 'words' as const, count: 20, startWithLorem: false, capitalize: false, addPunctuation: false, includeHtml: false, htmlTag: 'span', wordsPerSentence: [8, 15] as [number, number], sentencesPerParagraph: [3, 6] as [number, number] }
  },
  {
    name: 'Classic Lorem',
    description: 'Traditional Lorem Ipsum text',
    config: { type: 'paragraphs' as const, count: 3, startWithLorem: true, capitalize: true, addPunctuation: true, includeHtml: false, htmlTag: 'p', wordsPerSentence: [15, 25] as [number, number], sentencesPerParagraph: [5, 8] as [number, number] }
  }
]

export default function LoremGenerator() {
  const [config, setConfig] = useState<LoremConfig>({
    type: 'paragraphs',
    count: 3,
    startWithLorem: true,
    capitalize: true,
    addPunctuation: true,
    includeHtml: false,
    htmlTag: 'p',
    wordsPerSentence: [10, 20],
    sentencesPerParagraph: [4, 7]
  })
  
  const [generatedText, setGeneratedText] = useState<GeneratedText | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 生成随机单词
  const generateWords = (count: number): string[] => {
    const words: string[] = []
    const availableWords = [...LOREM_WORDS]
    
    for (let i = 0; i < count; i++) {
      if (availableWords.length === 0) {
        availableWords.push(...LOREM_WORDS)
      }
      
      const randomIndex = Math.floor(Math.random() * availableWords.length)
      words.push(availableWords.splice(randomIndex, 1)[0])
    }
    
    return words
  }

  // 生成句子
  const generateSentence = (wordCount?: number): string => {
    const min = wordCount || config.wordsPerSentence[0]
    const max = wordCount || config.wordsPerSentence[1]
    const count = Math.floor(Math.random() * (max - min + 1)) + min
    
    let words = generateWords(count)
    
    if (config.capitalize) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    }
    
    let sentence = words.join(' ')
    
    if (config.addPunctuation) {
      const punctuation = Math.random() < 0.1 ? (Math.random() < 0.5 ? '!' : '?') : '.'
      sentence += punctuation
    }
    
    return sentence
  }

  // 生成段落
  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(
      Math.random() * (config.sentencesPerParagraph[1] - config.sentencesPerParagraph[0] + 1)
    ) + config.sentencesPerParagraph[0]
    
    const sentences: string[] = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    
    return sentences.join(' ')
  }

  // 统计文本信息
  const analyzeText = (text: string): Omit<GeneratedText, 'content'> => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    
    return {
      wordCount: words.length,
      characterCount: text.length,
      sentenceCount: sentences.length,
      paragraphCount: Math.max(paragraphs.length, 1)
    }
  }

  // 生成文本
  const generateText = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      let content = ''
      
      if (config.type === 'words') {
        const words = generateWords(config.count)
        if (config.capitalize) {
          content = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        } else {
          content = words.join(' ')
        }
        
        if (config.addPunctuation && config.type === 'words') {
          content = content.replace(/\s/g, ', ').replace(/,\s$/, '.')
        }
        
      } else if (config.type === 'sentences') {
        const sentences: string[] = []
        
        for (let i = 0; i < config.count; i++) {
          if (i === 0 && config.startWithLorem) {
            sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
          } else {
            sentences.push(generateSentence())
          }
        }
        
        content = sentences.join(' ')
        
      } else if (config.type === 'paragraphs') {
        const paragraphs: string[] = []
        
        for (let i = 0; i < config.count; i++) {
          if (i === 0 && config.startWithLorem) {
            paragraphs.push(CLASSIC_LOREM)
          } else {
            paragraphs.push(generateParagraph())
          }
        }
        
        if (config.includeHtml) {
          content = paragraphs
            .map(p => `<${config.htmlTag}>${p}</${config.htmlTag}>`)
            .join('\n\n')
        } else {
          content = paragraphs.join('\n\n')
        }
      }
      
      const analysis = analyzeText(content)
      
      setGeneratedText({
        content,
        ...analysis
      })
      
      setIsGenerating(false)
    }, 300)
  }

  // 复制到剪贴板
  const copyToClipboard = async () => {
    if (generatedText?.content) {
      await navigator.clipboard.writeText(generatedText.content)
    }
  }

  // 下载文件
  const downloadText = () => {
    if (!generatedText?.content) return
    
    const blob = new Blob([generatedText.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lorem-ipsum-${config.type}-${config.count}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 应用预设
  const applyPreset = (preset: typeof presets[0]) => {
    setConfig(preset.config)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-2xl mb-4">
              <FileText className="h-8 w-8 text-orange-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Lorem Ipsum Generator</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Generate placeholder text for your designs, mockups, and development projects. 
              Create words, sentences, or paragraphs with customizable formatting options.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 配置面板 */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 border-white/20 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Text Configuration
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Customize your Lorem Ipsum generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 预设选择 */}
                  <div className="space-y-3">
                    <Label className="text-white">Quick Presets</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {presets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          className="bg-white/5 border-white/20 text-white hover:bg-white/20 justify-start h-auto p-3"
                          onClick={() => applyPreset(preset)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-slate-400">{preset.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 生成类型 */}
                  <div className="space-y-3">
                    <Label className="text-white">Generate</Label>
                    <Select value={config.type} onValueChange={(value: 'words' | 'sentences' | 'paragraphs') => setConfig({ ...config, type: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="words">Words</SelectItem>
                        <SelectItem value="sentences">Sentences</SelectItem>
                        <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 数量 */}
                  <div className="space-y-3">
                    <Label className="text-white">
                      Number of {config.type}
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max={config.type === 'words' ? "1000" : config.type === 'sentences' ? "100" : "50"}
                      value={config.count}
                      onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) || 1 })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  {/* 文本选项 */}
                  <div className="space-y-4">
                    <Label className="text-white">Text Options</Label>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-slate-300">Start with "Lorem ipsum"</Label>
                      <Switch
                        checked={config.startWithLorem}
                        onCheckedChange={(checked) => setConfig({ ...config, startWithLorem: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-slate-300">Capitalize sentences</Label>
                      <Switch
                        checked={config.capitalize}
                        onCheckedChange={(checked) => setConfig({ ...config, capitalize: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-slate-300">Add punctuation</Label>
                      <Switch
                        checked={config.addPunctuation}
                        onCheckedChange={(checked) => setConfig({ ...config, addPunctuation: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-slate-300">Include HTML tags</Label>
                      <Switch
                        checked={config.includeHtml}
                        onCheckedChange={(checked) => setConfig({ ...config, includeHtml: checked })}
                      />
                    </div>

                    {config.includeHtml && (
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-300">HTML Tag</Label>
                        <Select value={config.htmlTag} onValueChange={(value) => setConfig({ ...config, htmlTag: value })}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="p">Paragraph (&lt;p&gt;)</SelectItem>
                            <SelectItem value="div">Division (&lt;div&gt;)</SelectItem>
                            <SelectItem value="span">Span (&lt;span&gt;)</SelectItem>
                            <SelectItem value="article">Article (&lt;article&gt;)</SelectItem>
                            <SelectItem value="section">Section (&lt;section&gt;)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* 高级选项 */}
                  {config.type !== 'words' && (
                    <div className="space-y-4">
                      <Label className="text-white">Advanced Options</Label>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-300">Words per sentence</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            min="3"
                            max="50"
                            value={config.wordsPerSentence[0]}
                            onChange={(e) => setConfig({
                              ...config,
                              wordsPerSentence: [parseInt(e.target.value) || 3, config.wordsPerSentence[1]]
                            })}
                            className="bg-white/10 border-white/20 text-white text-sm"
                            placeholder="Min"
                          />
                          <Input
                            type="number"
                            min="3"
                            max="50"
                            value={config.wordsPerSentence[1]}
                            onChange={(e) => setConfig({
                              ...config,
                              wordsPerSentence: [config.wordsPerSentence[0], parseInt(e.target.value) || 20]
                            })}
                            className="bg-white/10 border-white/20 text-white text-sm"
                            placeholder="Max"
                          />
                        </div>
                      </div>

                      {config.type === 'paragraphs' && (
                        <div className="space-y-2">
                          <Label className="text-sm text-slate-300">Sentences per paragraph</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              min="2"
                              max="15"
                              value={config.sentencesPerParagraph[0]}
                              onChange={(e) => setConfig({
                                ...config,
                                sentencesPerParagraph: [parseInt(e.target.value) || 3, config.sentencesPerParagraph[1]]
                              })}
                              className="bg-white/10 border-white/20 text-white text-sm"
                              placeholder="Min"
                            />
                            <Input
                              type="number"
                              min="2"
                              max="15"
                              value={config.sentencesPerParagraph[1]}
                              onChange={(e) => setConfig({
                                ...config,
                                sentencesPerParagraph: [config.sentencesPerParagraph[0], parseInt(e.target.value) || 7]
                              })}
                              className="bg-white/10 border-white/20 text-white text-sm"
                              placeholder="Max"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 生成按钮 */}
                  <Button
                    onClick={generateText}
                    disabled={isGenerating}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Lorem Ipsum
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 结果展示 */}
            <div className="lg:col-span-2">
              {generatedText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* 统计信息 */}
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">{generatedText.wordCount}</div>
                          <div className="text-sm text-slate-400">Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{generatedText.characterCount}</div>
                          <div className="text-sm text-slate-400">Characters</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{generatedText.sentenceCount}</div>
                          <div className="text-sm text-slate-400">Sentences</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{generatedText.paragraphCount}</div>
                          <div className="text-sm text-slate-400">Paragraphs</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 生成的文本 */}
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <AlignLeft className="h-5 w-5" />
                          Generated Text
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadText}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        {config.includeHtml ? (
                          <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {generatedText.content}
                          </pre>
                        ) : (
                          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {generatedText.content}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {!generatedText && (
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate</h3>
                    <p className="text-slate-400">
                      Configure your settings and click "Generate Lorem Ipsum" to create placeholder text.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}