"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { NameGenerator as NameGen } from '@/lib/generators/name'
import { User, RefreshCw, Copy, Users, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

interface NameConfig {
  gender: 'male' | 'female' | 'mixed'
  origin: string
  includeMiddleName: boolean
  format: 'full' | 'first' | 'last'
}

interface Props {
  className?: string
}

interface GeneratedName {
  first: string
  last: string
  full: string
  gender: 'male' | 'female'
  origin: string
}

export function NameGenerator({ className = '' }: Props) {
  const [config, setConfig] = useState<NameConfig>({
    gender: 'mixed',
    origin: 'mixed',
    includeMiddleName: false,
    format: 'full'
  })
  
  const [names, setNames] = useState<GeneratedName[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [count, setCount] = useState(10)

  const generateNames = async () => {
    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const generated = Array.from({ length: count }, () => {
        const nameGenConfig = {
          gender: config.gender === 'mixed' ? 'any' as const : config.gender,
          origin: config.origin === 'mixed' ? 'global' as const : 'american' as const,
          includeLastName: true,
          count: 1
        }
        const result = NameGen.generate(nameGenConfig)
        
        const fullName = Array.isArray(result) ? result[0] : result
        const parts = fullName.split(' ')
        const first = parts[0] || 'John'
        const last = parts[1] || 'Doe'
        
        return {
          first,
          last,
          full: fullName,
          gender: config.gender === 'mixed' ? (Math.random() > 0.5 ? 'male' : 'female') : config.gender,
          origin: config.origin
        }
      })
      setNames(generated)
    } catch (error) {
      console.error('Error generating names:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyNames = (format: 'full' | 'first' | 'last' | 'list') => {
    let text = ''
    
    switch (format) {
      case 'full':
        text = names.map(name => name.full).join('\n')
        break
      case 'first':
        text = names.map(name => name.first).join('\n')
        break
      case 'last':
        text = names.map(name => name.last).join('\n')
        break
      case 'list':
        text = names.map((name, index) => `${index + 1}. ${name.full}`).join('\n')
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const getGenderIcon = (gender: 'male' | 'female') => {
    return gender === 'male' ? '♂' : '♀'
  }

  const getGenderColor = (gender: 'male' | 'female') => {
    return gender === 'male' ? 'text-blue-400' : 'text-pink-400'
  }

  const origins = [
    { value: 'mixed', label: 'Mixed Origins' },
    { value: 'english', label: 'English' },
    { value: 'irish', label: 'Irish' },
    { value: 'scottish', label: 'Scottish' },
    { value: 'german', label: 'German' },
    { value: 'french', label: 'French' },
    { value: 'italian', label: 'Italian' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'scandinavian', label: 'Scandinavian' },
    { value: 'slavic', label: 'Slavic' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'indian', label: 'Indian' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'hebrew', label: 'Hebrew' }
  ]

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* 配置面板 */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Name Settings
          </CardTitle>
          <CardDescription className="text-slate-300">
            Configure your name generation preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 数量设置 */}
          <div className="space-y-2">
            <Label className="text-slate-300">Number of Names</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* 性别选择 */}
          <div className="space-y-2">
            <Label className="text-slate-300">Gender</Label>
            <Select
              value={config.gender}
              onValueChange={(value: 'male' | 'female' | 'mixed') => 
                setConfig(prev => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed (Male & Female)</SelectItem>
                <SelectItem value="male">Male Only</SelectItem>
                <SelectItem value="female">Female Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 地区选择 */}
          <div className="space-y-2">
            <Label className="text-slate-300">Origin</Label>
            <Select
              value={config.origin}
              onValueChange={(value: string) => 
                setConfig(prev => ({ ...prev, origin: value }))
              }
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {origins.map(origin => (
                  <SelectItem key={origin.value} value={origin.value}>
                    {origin.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 格式选项 */}
          <div className="space-y-4">
            <Label className="text-slate-300">Name Format</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.includeMiddleName}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeMiddleName: checked }))}
                />
                <Label className="text-white">Include Middle Name</Label>
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <Button 
            onClick={generateNames}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 font-semibold"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Generate Names
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 结果展示 */}
      {names.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5" />
                  Generated Names
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyNames('full')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Full Names
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyNames('list')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy List
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {names.map((name, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg ${getGenderColor(name.gender)}`}>
                          {getGenderIcon(name.gender)}
                        </span>
                        <span className="text-white font-medium">{name.full}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-400 capitalize">
                          {name.origin}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(name.full)}
                      className="text-slate-300 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {/* 统计信息 */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {names.filter(n => n.gender === 'male').length}
                    </div>
                    <div className="text-xs text-blue-400">Male Names</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {names.filter(n => n.gender === 'female').length}
                    </div>
                    <div className="text-xs text-pink-400">Female Names</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}