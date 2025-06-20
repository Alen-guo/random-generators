"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Type, RefreshCw, Copy, Download, Settings, Hash, Eye, EyeOff } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface StringResult {
  value: string
  length: number
  timestamp: Date
}

export default function StringGeneratorPage() {
  const containerRef = useTranslationProtection()
  const [stringLength, setStringLength] = useState(12)
  const [stringCount, setStringCount] = useState(10)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [customCharacters, setCustomCharacters] = useState('')
  const [useCustomOnly, setUseCustomOnly] = useState(false)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [results, setResults] = useState<StringResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(true)

  const generateStrings = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let charset = ''
    
    if (useCustomOnly && customCharacters) {
      charset = customCharacters
    } else {
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
      if (includeNumbers) charset += '0123456789'
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
      if (customCharacters && !useCustomOnly) charset += customCharacters
    }
    
    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '')
    }
    
    if (!charset) {
      setIsGenerating(false)
      return
    }
    
    const newResults: StringResult[] = []
    
    for (let i = 0; i < stringCount; i++) {
      let randomString = ''
      for (let j = 0; j < stringLength; j++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        randomString += charset[randomIndex]
      }
      
      newResults.push({
        value: randomString,
        length: randomString.length,
        timestamp: new Date()
      })
    }
    
    setResults(newResults)
    setIsGenerating(false)
  }

  const copyResults = (format: 'list' | 'csv' | 'json' | 'quoted') => {
    const values = results.map(r => r.value)
    let text = ''
    
    switch (format) {
      case 'list':
        text = values.join('\n')
        break
      case 'csv':
        text = 'String,Length,Generated\n' + 
               results.map(r => `"${r.value}",${r.length},"${r.timestamp.toISOString()}"`).join('\n')
        break
      case 'json':
        text = JSON.stringify(values, null, 2)
        break
      case 'quoted':
        text = values.map(v => `"${v}"`).join('\n')
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const text = results.map(r => r.value).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'random-strings.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'alphanumeric' | 'letters' | 'numbers' | 'hex' | 'base64' | 'filename') => {
    switch (preset) {
      case 'alphanumeric':
        setIncludeUppercase(true)
        setIncludeLowercase(true)
        setIncludeNumbers(true)
        setIncludeSymbols(false)
        setCustomCharacters('')
        setUseCustomOnly(false)
        setExcludeSimilar(true)
        setStringLength(8)
        break
      case 'letters':
        setIncludeUppercase(true)
        setIncludeLowercase(true)
        setIncludeNumbers(false)
        setIncludeSymbols(false)
        setCustomCharacters('')
        setUseCustomOnly(false)
        setExcludeSimilar(false)
        setStringLength(10)
        break
      case 'numbers':
        setIncludeUppercase(false)
        setIncludeLowercase(false)
        setIncludeNumbers(true)
        setIncludeSymbols(false)
        setCustomCharacters('')
        setUseCustomOnly(false)
        setExcludeSimilar(false)
        setStringLength(6)
        break
      case 'hex':
        setIncludeUppercase(false)
        setIncludeLowercase(false)
        setIncludeNumbers(false)
        setIncludeSymbols(false)
        setCustomCharacters('0123456789ABCDEF')
        setUseCustomOnly(true)
        setExcludeSimilar(false)
        setStringLength(16)
        break
      case 'base64':
        setIncludeUppercase(true)
        setIncludeLowercase(true)
        setIncludeNumbers(true)
        setIncludeSymbols(false)
        setCustomCharacters('+/')
        setUseCustomOnly(false)
        setExcludeSimilar(false)
        setStringLength(12)
        break
      case 'filename':
        setIncludeUppercase(true)
        setIncludeLowercase(true)
        setIncludeNumbers(true)
        setIncludeSymbols(false)
        setCustomCharacters('-_')
        setUseCustomOnly(false)
        setExcludeSimilar(true)
        setStringLength(16)
        break
    }
  }

  const getCharsetInfo = () => {
    let charset = ''
    if (useCustomOnly && customCharacters) {
      charset = customCharacters
    } else {
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
      if (includeNumbers) charset += '0123456789'
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
      if (customCharacters && !useCustomOnly) charset += customCharacters
    }
    
    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '')
    }
    
    return {
      length: charset.length,
      possibleCombinations: Math.pow(charset.length, stringLength)
    }
  }

  const charsetInfo = getCharsetInfo()

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
              <Type className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">String Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random strings with customizable character sets. Perfect for tokens, IDs, filenames, and testing data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  String Options
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure string generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Length</Label>
                    <Input
                      type="number"
                      min={1}
                      max={128}
                      value={stringLength}
                      onChange={(e) => setStringLength(Math.max(1, Math.min(128, parseInt(e.target.value) || 12)))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Count</Label>
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      value={stringCount}
                      onChange={(e) => setStringCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 10)))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-300">Character Sets</Label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="rounded accent-pink-500"
                      disabled={useCustomOnly}
                    />
                    <span className="text-white">Uppercase (A-Z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="rounded accent-pink-500"
                      disabled={useCustomOnly}
                    />
                    <span className="text-white">Lowercase (a-z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="rounded accent-pink-500"
                      disabled={useCustomOnly}
                    />
                    <span className="text-white">Numbers (0-9)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="rounded accent-pink-500"
                      disabled={useCustomOnly}
                    />
                    <span className="text-white">Symbols (!@#$...)</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Custom Characters</Label>
                  <Input
                    type="text"
                    value={customCharacters}
                    onChange={(e) => setCustomCharacters(e.target.value)}
                    placeholder="Enter custom characters..."
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={useCustomOnly}
                      onChange={(e) => setUseCustomOnly(e.target.checked)}
                      className="rounded accent-pink-500"
                    />
                    <span className="text-white text-sm">Use custom characters only</span>
                  </label>
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="rounded accent-pink-500"
                  />
                  <span className="text-white">Exclude similar (0, O, 1, l, I)</span>
                </label>

                <Button 
                  onClick={generateStrings}
                  disabled={isGenerating || charsetInfo.length === 0}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 font-semibold notranslate"
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
                      <Type className="h-5 w-5 mr-2" />
                      Generate Strings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 预设配置 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Presets</CardTitle>
                <CardDescription className="text-slate-300">
                  Common string generation scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => loadPreset('alphanumeric')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  Alphanumeric
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('letters')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  Letters Only
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('numbers')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  Numbers Only
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('hex')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  Hexadecimal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('base64')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  Base64-like
                </Button>
                <Button
                  variant="outline"
                  onClick={() => loadPreset('filename')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  Filename Safe
                </Button>
              </CardContent>
            </Card>

            {/* 字符集信息 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Hash className="h-5 w-5" />
                  Character Set Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Characters:</span>
                    <span className="text-white font-mono">{charsetInfo.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Length:</span>
                    <span className="text-white font-mono">{stringLength}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  <div>Possible combinations:</div>
                  <div className="font-mono text-white">
                    {charsetInfo.possibleCombinations.toExponential(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果显示 */}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 && (
              <>
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Generated Strings</CardTitle>
                        <CardDescription className="text-slate-300">
                          {results.length} random strings of {stringLength} characters
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowResults(!showResults)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          {showResults ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResults('list')}
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
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => navigator.clipboard.writeText(result.value)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 font-mono text-white break-all">
                            {showResults ? result.value : '•'.repeat(result.length)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {result.length} chars
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
                      Copy strings in different formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => copyResults('list')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Plain List
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('quoted')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Quoted
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('json')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        JSON Array
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
                  Generate random strings for various applications with fine-grained control over character sets, 
                  length, and formatting options.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Development & Testing:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>API tokens and keys</li>
                      <li>Session identifiers</li>
                      <li>Test data generation</li>
                      <li>Random database IDs</li>
                      <li>Temporary filenames</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Security & Privacy:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Secure tokens</li>
                      <li>Salt values</li>
                      <li>Random identifiers</li>
                      <li>Verification codes</li>
                      <li>Nonces</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Gaming & Entertainment:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Game room codes</li>
                      <li>Player identifiers</li>
                      <li>Random seeds</li>
                      <li>Challenge codes</li>
                      <li>Event tickets</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Business & Operations:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Order numbers</li>
                      <li>Product codes</li>
                      <li>Coupon codes</li>
                      <li>Reference numbers</li>
                      <li>Batch identifiers</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                  <h4 className="font-medium text-pink-300 mb-2">String Generation Features:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-pink-100">
                    <li>Highly customizable character sets</li>
                    <li>Exclude similar-looking characters</li>
                    <li>Custom character support</li>
                    <li>Multiple output formats</li>
                    <li>Cryptographically secure random generation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}