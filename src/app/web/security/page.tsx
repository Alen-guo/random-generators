"use client"

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle, Zap, RefreshCw, Copy } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface PasswordAnalysis {
  password: string
  score: number
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong'
  strengthColor: string
  checks: {
    length: { passed: boolean; requirement: string; description: string }
    lowercase: { passed: boolean; requirement: string; description: string }
    uppercase: { passed: boolean; requirement: string; description: string }
    numbers: { passed: boolean; requirement: string; description: string }
    symbols: { passed: boolean; requirement: string; description: string }
    patterns: { passed: boolean; requirement: string; description: string }
    common: { passed: boolean; requirement: string; description: string }
  }
  suggestions: string[]
  estimatedCrackTime: string
  entropy: number
}

interface GeneratedPassword {
  password: string
  strength: string
  score: number
  entropy: number
  timestamp: Date
  id: string
}

export default function SecurityPage() {
  const containerRef = useTranslationProtection()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)
  const [generatedPasswords, setGeneratedPasswords] = useState<GeneratedPassword[]>([])
  const [generateLength, setGenerateLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
    'princess', 'dragon', 'sunshine', 'master', 'login', 'football'
  ]

  const analyzePassword = (pwd: string): PasswordAnalysis => {
    let score = 0
    const checks = {
      length: {
        passed: pwd.length >= 12,
        requirement: 'At least 12 characters',
        description: 'Longer passwords are exponentially harder to crack'
      },
      lowercase: {
        passed: /[a-z]/.test(pwd),
        requirement: 'Contains lowercase letters',
        description: 'Mix of character types increases complexity'
      },
      uppercase: {
        passed: /[A-Z]/.test(pwd),
        requirement: 'Contains uppercase letters',
        description: 'Capital letters add to password strength'
      },
      numbers: {
        passed: /\d/.test(pwd),
        requirement: 'Contains numbers',
        description: 'Numbers make passwords less predictable'
      },
      symbols: {
        passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
        requirement: 'Contains special characters',
        description: 'Special characters significantly increase security'
      },
      patterns: {
        passed: !/(123|abc|qwe|asd|zxc|111|000|999)/i.test(pwd) && !/(.)\1{2,}/.test(pwd),
        requirement: 'No obvious patterns',
        description: 'Avoid sequential or repeating characters'
      },
      common: {
        passed: !commonPasswords.some(common => pwd.toLowerCase().includes(common.toLowerCase())),
        requirement: 'Not a common password',
        description: 'Avoid dictionary words and common passwords'
      }
    }

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check.passed) score += 1
    })

    // Length bonus
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 16) score += 1
    if (pwd.length >= 20) score += 1

    // Entropy calculation (simplified)
    let charset = 0
    if (/[a-z]/.test(pwd)) charset += 26
    if (/[A-Z]/.test(pwd)) charset += 26
    if (/\d/.test(pwd)) charset += 10
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) charset += 32

    const entropy = Math.log2(Math.pow(charset, pwd.length))

    // Determine strength
    let strength: PasswordAnalysis['strength']
    let strengthColor: string
    
    if (score <= 2) {
      strength = 'Very Weak'
      strengthColor = '#EF4444'
    } else if (score <= 4) {
      strength = 'Weak'
      strengthColor = '#F97316'
    } else if (score <= 6) {
      strength = 'Fair'
      strengthColor = '#EAB308'
    } else if (score <= 8) {
      strength = 'Good'
      strengthColor = '#22C55E'
    } else if (score <= 9) {
      strength = 'Strong'
      strengthColor = '#10B981'
    } else {
      strength = 'Very Strong'
      strengthColor = '#059669'
    }

    // Generate suggestions
    const suggestions: string[] = []
    if (!checks.length.passed) suggestions.push('Use at least 12 characters')
    if (!checks.uppercase.passed) suggestions.push('Add uppercase letters (A-Z)')
    if (!checks.lowercase.passed) suggestions.push('Add lowercase letters (a-z)')
    if (!checks.numbers.passed) suggestions.push('Include numbers (0-9)')
    if (!checks.symbols.passed) suggestions.push('Use special characters (!@#$%^&*)')
    if (!checks.patterns.passed) suggestions.push('Avoid sequential or repeating patterns')
    if (!checks.common.passed) suggestions.push('Avoid common words and passwords')
    
    if (suggestions.length === 0) {
      suggestions.push('Your password is strong! Consider using a password manager.')
    }

    // Estimate crack time
    let crackTime = ''
    if (entropy < 28) crackTime = 'Instant - Few seconds'
    else if (entropy < 35) crackTime = 'Few minutes - Few hours'
    else if (entropy < 44) crackTime = 'Few days - Few weeks'
    else if (entropy < 59) crackTime = 'Few months - Few years'
    else if (entropy < 65) crackTime = 'Few decades'
    else crackTime = 'Centuries or more'

    return {
      password: pwd,
      score,
      strength,
      strengthColor,
      checks,
      suggestions,
      estimatedCrackTime: crackTime,
      entropy: Math.round(entropy)
    }
  }

  const generateSecurePassword = async () => {
    setIsGenerating(true)
    
    // Add small delay for animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let charset = ''
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '')
    }

    if (charset.length === 0) return

    let password = ''
    for (let i = 0; i < generateLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    const analysis = analyzePassword(password)
    
    const generated: GeneratedPassword = {
      password,
      strength: analysis.strength,
      score: analysis.score,
      entropy: analysis.entropy,
      timestamp: new Date(),
      id: `pwd_${Date.now()}`
    }

    setGeneratedPasswords([generated, ...generatedPasswords.slice(0, 9)]) // Keep last 10
    setPassword(password)
    
    setIsGenerating(false)
  }

  const copyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd)
  }

  const getStrengthColor = (strength: string) => {
    const colors = {
      'Very Weak': 'text-red-500',
      'Weak': 'text-orange-500',
      'Fair': 'text-yellow-500',
      'Good': 'text-green-500',
      'Strong': 'text-emerald-500',
      'Very Strong': 'text-emerald-600'
    }
    return colors[strength as keyof typeof colors] || 'text-gray-500'
  }

  const getScorePercentage = (score: number) => {
    return Math.min((score / 10) * 100, 100)
  }

  useEffect(() => {
    if (password) {
      const analysis = analyzePassword(password)
      setAnalysis(analysis)
    } else {
      setAnalysis(null)
    }
  }, [password])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Password Security Checker</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Analyze password strength, generate secure passwords, and get expert security recommendations to protect your accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：密码分析 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 密码输入 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Password Analysis
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Enter a password to check its security strength
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to analyze"
                      className="bg-white/10 border-white/20 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {analysis && (
                  <div className="space-y-4">
                    {/* 强度指示器 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Strength</Label>
                        <span 
                          className={`font-bold ${getStrengthColor(analysis.strength)}`}
                        >
                          {analysis.strength}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${getScorePercentage(analysis.score)}%`,
                            backgroundColor: analysis.strengthColor
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Score: {analysis.score}/10</span>
                        <span>Entropy: {analysis.entropy} bits</span>
                      </div>
                    </div>

                    {/* 安全检查 */}
                    <div className="space-y-3">
                      <Label className="text-slate-300">Security Checks</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(analysis.checks).map(([key, check]) => (
                          <div key={key} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                            {check.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className={`text-sm font-medium ${check.passed ? 'text-green-300' : 'text-red-300'}`}>
                                {check.requirement}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {check.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 破解时间估算 */}
                    <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-white font-medium">Estimated Crack Time</span>
                      </div>
                      <p className="text-slate-300">{analysis.estimatedCrackTime}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Time estimate assumes offline brute force attack with modern hardware
                      </p>
                    </div>

                    {/* 改进建议 */}
                    <div className="space-y-2">
                      <Label className="text-slate-300">Recommendations</Label>
                      <div className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-300">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 生成的密码历史 */}
            {generatedPasswords.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Generated Passwords</CardTitle>
                  <CardDescription className="text-slate-300">
                    Recently generated secure passwords
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {generatedPasswords.map((pwd, index) => (
                      <div key={pwd.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-mono text-sm truncate">
                              {pwd.password}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getStrengthColor(pwd.strength)} bg-white/10`}>
                              {pwd.strength}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            Score: {pwd.score}/10 • Entropy: {pwd.entropy} bits
                          </div>
                        </div>
                        <Button
                          onClick={() => copyPassword(pwd.password)}
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white ml-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右侧：密码生成器 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5" />
                  Password Generator
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Create strong, secure passwords
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 长度设置 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Length: {generateLength}</Label>
                  <Input
                    type="range"
                    min="8"
                    max="64"
                    value={generateLength}
                    onChange={(e) => setGenerateLength(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>8</span>
                    <span>64</span>
                  </div>
                </div>

                {/* 字符类型选择 */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Character Types</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Symbols (!@#$%^&*)</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={excludeSimilar}
                        onChange={(e) => setExcludeSimilar(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Exclude similar (il1Lo0O)</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={generateSecurePassword}
                  disabled={isGenerating || (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-semibold notranslate"
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
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Password
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 安全提示 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Security Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-white text-sm">Best Practices</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Use unique passwords for each account</li>
                    <li>Enable two-factor authentication (2FA)</li>
                    <li>Use a reputable password manager</li>
                    <li>Never share passwords via email or text</li>
                    <li>Update passwords regularly for sensitive accounts</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white text-sm">What to Avoid</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Personal information (birthdays, names)</li>
                    <li>Dictionary words and common phrases</li>
                    <li>Simple patterns (123456, qwerty)</li>
                    <li>Reusing passwords across accounts</li>
                    <li>Storing passwords in plain text</li>
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