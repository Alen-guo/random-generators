"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, RefreshCw, Copy, Download, AtSign, Building, User, CheckCircle } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface EmailConfig {
  domains: string[]
  formats: string[]
  count: number
  includeNumbers: boolean
  includeDots: boolean
  includeUnderscore: boolean
  minLength: number
  maxLength: number
  emailType: 'personal' | 'business' | 'temporary' | 'mixed'
}

interface GeneratedEmail {
  email: string
  username: string
  domain: string
  format: string
  type: string
  isValid: boolean
  timestamp: Date
  id: string
}

export default function EmailPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<EmailConfig>({
    domains: ['gmail.com', 'yahoo.com', 'outlook.com'],
    formats: ['firstname.lastname', 'firstnamelastname', 'firstname_lastname'],
    count: 15,
    includeNumbers: true,
    includeDots: true,
    includeUnderscore: false,
    minLength: 5,
    maxLength: 20,
    emailType: 'mixed'
  })
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const availableDomains = [
    { category: 'Popular', domains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com'] },
    { category: 'Business', domains: ['company.com', 'corp.com', 'business.com', 'enterprise.com', 'office.com'] },
    { category: 'Tech', domains: ['tech.com', 'dev.com', 'code.com', 'software.com', 'digital.com'] },
    { category: 'Education', domains: ['university.edu', 'college.edu', 'school.edu', 'academy.edu'] },
    { category: 'International', domains: ['mail.com', 'email.com', 'post.com', 'web.de', 'yandex.com'] },
    { category: 'Temporary', domains: ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'throwaway.email'] }
  ]

  const nameFormats = [
    { key: 'firstname.lastname', name: 'First.Last', example: 'john.doe' },
    { key: 'firstnamelastname', name: 'FirstLast', example: 'johndoe' },
    { key: 'firstname_lastname', name: 'First_Last', example: 'john_doe' },
    { key: 'firstinitial.lastname', name: 'F.Last', example: 'j.doe' },
    { key: 'firstname.lastinitial', name: 'First.L', example: 'john.d' },
    { key: 'firstinitiallastname', name: 'FLast', example: 'jdoe' },
    { key: 'lastnamefirstname', name: 'LastFirst', example: 'doejohn' },
    { key: 'random', name: 'Random', example: 'user123' }
  ]

  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Emily', 'Robert', 'Ashley',
    'William', 'Jessica', 'Christopher', 'Amanda', 'Matthew', 'Jennifer', 'Joshua', 'Melissa',
    'Daniel', 'Michelle', 'Anthony', 'Kimberly', 'Mark', 'Amy', 'Donald', 'Laura', 'Steven',
    'Elizabeth', 'Paul', 'Helen', 'Andrew', 'Maria', 'Kenneth', 'Nancy', 'Ryan', 'Dorothy'
  ]

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
    'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
    'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez',
    'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright'
  ]

  const generateUsername = (format: string): string => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()
    
    let username = ''
    
    switch (format) {
      case 'firstname.lastname':
        username = `${firstName}.${lastName}`
        break
      case 'firstnamelastname':
        username = `${firstName}${lastName}`
        break
      case 'firstname_lastname':
        username = `${firstName}_${lastName}`
        break
      case 'firstinitial.lastname':
        username = `${firstName[0]}.${lastName}`
        break
      case 'firstname.lastinitial':
        username = `${firstName}.${lastName[0]}`
        break
      case 'firstinitiallastname':
        username = `${firstName[0]}${lastName}`
        break
      case 'lastnamefirstname':
        username = `${lastName}${firstName}`
        break
      case 'random':
        const randomWord = Math.random().toString(36).substring(2, 8)
        username = `user${randomWord}`
        break
      default:
        username = `${firstName}.${lastName}`
    }

    // Add numbers if enabled
    if (config.includeNumbers && Math.random() > 0.6) {
      const numbers = Math.floor(Math.random() * 999) + 1
      username += numbers
    }

    // Ensure length constraints
    if (username.length < config.minLength) {
      const padding = Math.random().toString(36).substring(2, config.minLength - username.length + 2)
      username += padding
    }
    
    if (username.length > config.maxLength) {
      username = username.substring(0, config.maxLength)
    }

    return username
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getEmailType = (domain: string): string => {
    if (['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(domain)) return 'Personal'
    if (domain.includes('.edu')) return 'Education'
    if (domain.includes('temp') || domain.includes('throw')) return 'Temporary'
    if (['company.com', 'corp.com', 'business.com'].includes(domain)) return 'Business'
    return 'Other'
  }

  const generateEmails = async () => {
    setIsGenerating(true)
    
    try {
      const emails: GeneratedEmail[] = []
      
      for (let i = 0; i < config.count; i++) {
        const format = config.formats[Math.floor(Math.random() * config.formats.length)]
        const domain = config.domains[Math.floor(Math.random() * config.domains.length)]
        const username = generateUsername(format)
        const email = `${username}@${domain}`
        
        const generatedEmail: GeneratedEmail = {
          email,
          username,
          domain,
          format,
          type: getEmailType(domain),
          isValid: validateEmail(email),
          timestamp: new Date(),
          id: `email_${Date.now()}_${i}`
        }
        
        emails.push(generatedEmail)
        
        // Add delay for animation
        if (i % 4 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      setGeneratedEmails(emails)
    } catch (error) {
      console.error('Error generating emails:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
  }

  const copyAllEmails = () => {
    const allEmails = generatedEmails.map(email => email.email).join('\n')
    navigator.clipboard.writeText(allEmails)
  }

  const downloadEmails = () => {
    const content = generatedEmails.map(email => 
      `${email.email}\t${email.username}\t${email.domain}\t${email.format}\t${email.type}\t${email.isValid ? 'Valid' : 'Invalid'}`
    ).join('\n')
    
    const header = 'Email\tUsername\tDomain\tFormat\tType\tValid\n'
    const blob = new Blob([header + content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-emails-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const toggleDomain = (domain: string) => {
    setConfig(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }))
  }

  const toggleFormat = (format: string) => {
    setConfig(prev => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter(f => f !== format)
        : [...prev.formats, format]
    }))
  }

  const loadPreset = (preset: 'personal' | 'business' | 'testing' | 'temporary') => {
    switch (preset) {
      case 'personal':
        setConfig(prev => ({
          ...prev,
          domains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'],
          formats: ['firstname.lastname', 'firstnamelastname', 'firstname_lastname'],
          emailType: 'personal',
          count: 20
        }))
        break
      case 'business':
        setConfig(prev => ({
          ...prev,
          domains: ['company.com', 'corp.com', 'business.com', 'enterprise.com'],
          formats: ['firstname.lastname', 'firstinitial.lastname'],
          emailType: 'business',
          count: 15
        }))
        break
      case 'testing':
        setConfig(prev => ({
          ...prev,
          domains: ['test.com', 'example.com', 'demo.com'],
          formats: ['random', 'firstnamelastname'],
          emailType: 'mixed',
          count: 25
        }))
        break
      case 'temporary':
        setConfig(prev => ({
          ...prev,
          domains: ['tempmail.com', '10minutemail.com', 'throwaway.email'],
          formats: ['random', 'firstnamelastname'],
          emailType: 'temporary',
          count: 10
        }))
        break
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Personal': return 'text-blue-400'
      case 'Business': return 'text-green-400'
      case 'Education': return 'text-purple-400'
      case 'Temporary': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const stats = {
    valid: generatedEmails.filter(e => e.isValid).length,
    invalid: generatedEmails.filter(e => e.isValid === false).length,
    personal: generatedEmails.filter(e => e.type === 'Personal').length,
    business: generatedEmails.filter(e => e.type === 'Business').length
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Email Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate realistic email addresses for testing, development, and prototyping. Choose from various domains and username formats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：邮箱配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AtSign className="h-5 w-5" />
                  Email Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure email generation options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 域名选择 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Domains ({config.domains.length} selected)</Label>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {availableDomains.map(category => (
                      <div key={category.category}>
                        <div className="text-xs text-slate-400 mb-1">{category.category}</div>
                        <div className="grid grid-cols-1 gap-1">
                          {category.domains.map(domain => (
                            <button
                              key={domain}
                              onClick={() => toggleDomain(domain)}
                              className={`p-2 rounded text-xs text-left transition-colors ${
                                config.domains.includes(domain)
                                  ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                                  : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                              }`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 用户名格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Username Formats ({config.formats.length} selected)</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {nameFormats.map(format => (
                      <button
                        key={format.key}
                        onClick={() => toggleFormat(format.key)}
                        className={`w-full p-2 rounded text-xs text-left transition-colors ${
                          config.formats.includes(format.key)
                            ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                            : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="font-medium">{format.name}</div>
                        <div className="text-slate-400">{format.example}@domain.com</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 生成数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Emails</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      count: Math.max(1, Math.min(100, parseInt(e.target.value) || 15))
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* 长度限制 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-slate-300 text-xs">Min Length</Label>
                    <Input
                      type="number"
                      min={3}
                      max={15}
                      value={config.minLength}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        minLength: Math.max(3, Math.min(15, parseInt(e.target.value) || 5))
                      }))}
                      className="bg-white/10 border-white/20 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-300 text-xs">Max Length</Label>
                    <Input
                      type="number"
                      min={5}
                      max={30}
                      value={config.maxLength}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        maxLength: Math.max(5, Math.min(30, parseInt(e.target.value) || 20))
                      }))}
                      className="bg-white/10 border-white/20 text-white text-sm"
                    />
                  </div>
                </div>

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeNumbers}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include numbers</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeDots}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeDots: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include dots</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeUnderscore}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeUnderscore: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include underscores</span>
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
                      onClick={() => loadPreset('personal')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <User className="h-3 w-3 mr-1" />
                      Personal
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('business')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Building className="h-3 w-3 mr-1" />
                      Business
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('testing')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Testing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('temporary')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Temp
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateEmails}
                  disabled={isGenerating || config.domains.length === 0 || config.formats.length === 0}
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
                      <Mail className="h-4 w-4 mr-2" />
                      Generate Emails
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的邮箱 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated Email Addresses</CardTitle>
                    <CardDescription className="text-slate-300">
                      {generatedEmails.length > 0 ? `${generatedEmails.length} email addresses generated` : 'No email addresses generated yet'}
                    </CardDescription>
                  </div>
                  {generatedEmails.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllEmails}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy All
                      </Button>
                      <Button
                        onClick={downloadEmails}
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
                {generatedEmails.length > 0 ? (
                  <div className="space-y-4">
                    {/* 统计信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.valid}</div>
                        <div className="text-xs text-slate-400">Valid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{stats.invalid}</div>
                        <div className="text-xs text-slate-400">Invalid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{stats.personal}</div>
                        <div className="text-xs text-slate-400">Personal</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.business}</div>
                        <div className="text-xs text-slate-400">Business</div>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {generatedEmails.map((email, index) => (
                        <div
                          key={email.id}
                          className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-emerald-400" />
                              <span className="text-white font-mono">
                                {email.email}
                              </span>
                              {email.isValid ? (
                                <CheckCircle className="h-3 w-3 text-green-400" />
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                              )}
                            </div>
                            <Button
                              onClick={() => copyEmail(email.email)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-slate-400 text-xs">Username:</div>
                              <div className="text-slate-300 font-mono">{email.username}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">Domain:</div>
                              <div className="text-slate-300 font-mono">{email.domain}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">Format:</div>
                              <div className="text-slate-300">{email.format}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">Type:</div>
                              <span className={`text-xs px-2 py-1 rounded ${getTypeColor(email.type)} bg-white/10`}>
                                {email.type}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                            <span>Generated at {email.timestamp.toLocaleTimeString()}</span>
                            <span>#{index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate email addresses?</p>
                    <p>Configure your settings and click "Generate Emails"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Email Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Domain Categories</h4>
                    <p className="text-sm">Choose from popular email providers, business domains, educational institutions, or temporary email services.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Username Formats</h4>
                    <p className="text-sm">Select from various naming conventions like first.last, firstlast, or random patterns to match your needs.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Customization Options</h4>
                    <p className="text-sm">Control username length, include numbers, dots, and underscores for realistic email generation.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Testing applications</li>
                      <li>Database seeding</li>
                      <li>Form validation</li>
                      <li>User simulation</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>API testing</li>
                      <li>Development data</li>
                      <li>Placeholder content</li>
                      <li>Demo accounts</li>
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