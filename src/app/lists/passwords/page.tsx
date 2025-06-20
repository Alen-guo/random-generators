"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, RefreshCw, Copy, Eye, EyeOff, Shield, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface PasswordConfig {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  count: number
}

interface PasswordResult {
  password: string
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number
}

export default function PasswordGeneratorPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<PasswordConfig>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    count: 1
  })
  
  const [results, setResults] = useState<PasswordResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPasswords, setShowPasswords] = useState(true)

  const generatePasswords = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const characters = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
      similar: 'il1Lo0O'
    }
    
    let charset = ''
    if (config.includeUppercase) charset += characters.uppercase
    if (config.includeLowercase) charset += characters.lowercase
    if (config.includeNumbers) charset += characters.numbers
    if (config.includeSymbols) charset += characters.symbols
    
    if (config.excludeSimilar) {
      charset = charset.split('').filter(char => !characters.similar.includes(char)).join('')
    }
    
    if (charset === '') {
      alert('Please select at least one character type')
      setIsGenerating(false)
      return
    }
    
    const newResults: PasswordResult[] = []
    
    for (let i = 0; i < config.count; i++) {
      let password = ''
      for (let j = 0; j < config.length; j++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length))
      }
      
      const strength = calculateStrength(password)
      newResults.push({
        password,
        strength: strength.level,
        score: strength.score
      })
    }
    
    setResults(newResults)
    setIsGenerating(false)
  }

  const calculateStrength = (password: string) => {
    let score = 0
    
    // Length score
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    // Additional complexity
    if (password.length >= 20) score += 1
    
    let level: 'weak' | 'medium' | 'strong' | 'very-strong'
    if (score <= 2) level = 'weak'
    else if (score <= 4) level = 'medium'
    else if (score <= 6) level = 'strong'
    else level = 'very-strong'
    
    return { score, level }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'strong': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'very-strong': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Password Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate strong, secure passwords with customizable options. Keep your accounts safe with truly random passwords.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Password Options</CardTitle>
                <CardDescription className="text-slate-300">
                  Customize your password requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 长度设置 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Password Length</Label>
                  <Input
                    type="number"
                    min={4}
                    max={128}
                    value={config.length}
                    onChange={(e) => setConfig(prev => ({ ...prev, length: Math.max(4, Math.min(128, parseInt(e.target.value) || 12)) }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">4 to 128 characters</p>
                </div>

                {/* 数量设置 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Passwords</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ ...prev, count: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 20 passwords</p>
                </div>

                {/* 字符选项 */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Include Characters</Label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.includeUppercase}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeUppercase: e.target.checked }))}
                      className="rounded accent-green-500"
                    />
                    <span className="text-white">Uppercase (A-Z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.includeLowercase}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeLowercase: e.target.checked }))}
                      className="rounded accent-green-500"
                    />
                    <span className="text-white">Lowercase (a-z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.includeNumbers}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                      className="rounded accent-green-500"
                    />
                    <span className="text-white">Numbers (0-9)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.includeSymbols}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeSymbols: e.target.checked }))}
                      className="rounded accent-green-500"
                    />
                    <span className="text-white">Symbols (!@#$%^&*)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.excludeSimilar}
                      onChange={(e) => setConfig(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                      className="rounded accent-green-500"
                    />
                    <span className="text-white">Exclude Similar (i,l,1,L,o,0,O)</span>
                  </label>
                </div>

                <Button 
                  onClick={generatePasswords}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 font-semibold notranslate"
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
                      <Lock className="h-5 w-5 mr-2" />
                      Generate Passwords
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="h-5 w-5" />
                  Password Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Use at least 12 characters</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Include mixed case letters, numbers, and symbols</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Use unique passwords for each account</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Never share or write down passwords</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Consider using a password manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果显示 */}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Generated Passwords</CardTitle>
                      <CardDescription className="text-slate-300">
                        {results.length} password{results.length > 1 ? 's' : ''} generated
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-400">Password #{index + 1}</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStrengthColor(result.strength)}`}>
                              {result.strength.replace('-', ' ')}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyPassword(result.password)}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="font-mono text-lg text-white bg-black/20 p-3 rounded border">
                          {showPasswords ? result.password : '•'.repeat(result.password.length)}
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Length: {result.password.length} characters • Strength Score: {result.score}/8
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
                <CardTitle className="text-white">How to Use Generated Passwords</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Our password generator creates cryptographically secure random passwords that are virtually 
                  impossible to crack. Each password is generated using true randomness, not predictable algorithms.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Best Practices:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Copy passwords immediately after generation</li>
                    <li>Store passwords in a secure password manager</li>
                    <li>Enable two-factor authentication when available</li>
                    <li>Change passwords regularly for sensitive accounts</li>
                    <li>Never reuse passwords across different sites</li>
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