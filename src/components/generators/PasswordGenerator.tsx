"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { PasswordGenerator as PasswordGen } from '@/lib/generators/password'
import { PasswordConfig } from '@/types'
import { Lock, RefreshCw, Copy, Eye, EyeOff, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  className?: string
}

export function PasswordGenerator({ className = '' }: Props) {
  const [config, setConfig] = useState<PasswordConfig>({
    length: 12,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  })
  
  const [passwords, setPasswords] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPasswords, setShowPasswords] = useState(true)
  const [count, setCount] = useState(5)

  const generatePasswords = async () => {
    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const generated = Array.from({ length: count }, () => 
        PasswordGen.generate(config)
      )
      setPasswords(generated)
    } catch (error) {
      console.error('Error generating passwords:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getStrengthScore = (password: string) => {
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return score
  }

  const getStrengthLabel = (score: number) => {
    if (score <= 2) return { label: 'Weak', color: 'text-red-400' }
    if (score <= 4) return { label: 'Medium', color: 'text-yellow-400' }
    return { label: 'Strong', color: 'text-green-400' }
  }

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password)
  }

  const copyAllPasswords = () => {
    navigator.clipboard.writeText(passwords.join('\n'))
  }

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* 配置面板 */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5" />
            Password Settings
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure your password generation options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 长度设置 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Password Length</Label>
              <span className="text-white font-mono text-sm bg-white/10 px-2 py-1 rounded">
                {config.length}
              </span>
            </div>
            <Slider
              value={[config.length]}
              onValueChange={(value) => setConfig(prev => ({ ...prev, length: value[0] }))}
              min={4}
              max={128}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* 数量设置 */}
          <div className="space-y-2">
            <Label className="text-slate-300">Number of Passwords</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* 字符集选项 */}
          <div className="space-y-4">
            <Label className="text-slate-300">Character Sets</Label>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.includeLowercase}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeLowercase: checked }))}
                  />
                  <Label className="text-white">Lowercase (a-z)</Label>
                </div>
                <span className="text-slate-400 font-mono text-sm">abcdefg...</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.includeUppercase}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeUppercase: checked }))}
                  />
                  <Label className="text-white">Uppercase (A-Z)</Label>
                </div>
                <span className="text-slate-400 font-mono text-sm">ABCDEFG...</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.includeNumbers}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeNumbers: checked }))}
                  />
                  <Label className="text-white">Numbers (0-9)</Label>
                </div>
                <span className="text-slate-400 font-mono text-sm">0123456...</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.includeSymbols}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeSymbols: checked }))}
                  />
                  <Label className="text-white">Symbols</Label>
                </div>
                <span className="text-slate-400 font-mono text-sm">!@#$%^&...</span>
              </div>
            </div>
          </div>

          {/* 高级选项 */}
          <div className="space-y-4">
            <Label className="text-slate-300">Advanced Options</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.excludeSimilar}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, excludeSimilar: checked }))}
                />
                <div className="flex-1">
                  <Label className="text-white">Exclude Similar Characters</Label>
                  <p className="text-xs text-slate-400">Excludes: i, l, 1, L, o, 0, O</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.excludeAmbiguous}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, excludeAmbiguous: checked }))}
                />
                <div className="flex-1">
                  <Label className="text-white">Exclude Ambiguous Characters</Label>
                  <p className="text-xs text-slate-400">Excludes: {`{}, [], (), /, \\, ', ", ~, ;, .<>`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <Button 
            onClick={generatePasswords}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 font-semibold"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Generate Passwords
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 结果展示 */}
      {passwords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Generated Passwords
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllPasswords}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {passwords.map((password, index) => {
                const strength = getStrengthScore(password)
                const strengthInfo = getStrengthLabel(strength)
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-white text-sm break-all">
                        {showPasswords ? password : '•'.repeat(password.length)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium ${strengthInfo.color}`}>
                          {strengthInfo.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {password.length} characters
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPassword(password)}
                      className="text-slate-300 hover:text-white hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}