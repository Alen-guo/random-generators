"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Zap, RefreshCw, Copy, Download, TestTube, Eye, CheckCircle, XCircle } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface RegexConfig {
  type: string
  customPattern: string
  flags: string[]
  includeExplanation: boolean
  includeExamples: boolean
}

interface GeneratedRegex {
  id: string
  pattern: string
  flags: string
  description: string
  explanation: string
  examples: { valid: string[]; invalid: string[] }
  type: string
  timestamp: Date
}

export default function RegexPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<RegexConfig>({
    type: 'email',
    customPattern: '',
    flags: ['g'],
    includeExplanation: true,
    includeExamples: true
  })
  const [generatedRegexes, setGeneratedRegexes] = useState<GeneratedRegex[]>([])
  const [testString, setTestString] = useState('')
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const regexTypes = [
    {
      key: 'email',
      name: 'Email Address',
      icon: '📧',
      description: 'Email validation patterns'
    },
    {
      key: 'phone',
      name: 'Phone Number',
      icon: '📱',
      description: 'Phone number formats'
    },
    {
      key: 'url',
      name: 'URL/URI',
      icon: '🔗',
      description: 'Web address patterns'
    },
    {
      key: 'password',
      name: 'Password',
      icon: '🔒',
      description: 'Password strength validation'
    },
    {
      key: 'date',
      name: 'Date Format',
      icon: '📅',
      description: 'Date and time patterns'
    },
    {
      key: 'number',
      name: 'Numbers',
      icon: '🔢',
      description: 'Numeric patterns'
    },
    {
      key: 'text',
      name: 'Text Patterns',
      icon: '📝',
      description: 'Text matching patterns'
    },
    {
      key: 'ip',
      name: 'IP Address',
      icon: '🌐',
      description: 'IP address validation'
    },
    {
      key: 'credit_card',
      name: 'Credit Card',
      icon: '💳',
      description: 'Credit card number patterns'
    },
    {
      key: 'custom',
      name: 'Custom Pattern',
      icon: '⚙️',
      description: 'Build your own regex'
    }
  ]

  const regexLibrary = {
    email: [
      {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        description: 'Standard email validation',
        explanation: '^ - Start of string, [a-zA-Z0-9._%+-]+ - One or more alphanumeric characters or special chars, @ - Literal @ symbol, [a-zA-Z0-9.-]+ - Domain name, \\. - Literal dot, [a-zA-Z]{2,} - 2 or more letters for TLD, $ - End of string',
        examples: {
          valid: ['user@example.com', 'test.email+tag@domain.co.uk', 'name_123@test-site.org'],
          invalid: ['plainaddress', '@missingdomain.com', 'missing@.com', 'spaces @domain.com']
        }
      },
      {
        pattern: '^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$',
        description: 'Strict email validation',
        explanation: '^ - Start, [\\w\\.-]+ - Word chars, dots, hyphens, @ - At symbol, ([\\w\\-]+\\.)+ - Domain parts with dots, [A-Z]{2,4} - 2-4 letter TLD, $ - End',
        examples: {
          valid: ['user@domain.com', 'test@example.org', 'name@site.info'],
          invalid: ['user@domain', 'test@.com', '@domain.com']
        }
      }
    ],
    phone: [
      {
        pattern: '^\\+?1?[-. ]?\\(?[0-9]{3}\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$',
        description: 'US phone number format',
        explanation: '^\\+?1? - Optional +1 country code, [-. ]? - Optional separator, \\(? - Optional opening paren, [0-9]{3} - 3-digit area code, \\)? - Optional closing paren, [-. ]? - Optional separator, [0-9]{3} - 3-digit exchange, [-. ]? - Optional separator, [0-9]{4} - 4-digit number, $ - End',
        examples: {
          valid: ['(555) 123-4567', '555-123-4567', '555.123.4567', '+1 555 123 4567'],
          invalid: ['555-12-4567', '(555 123-4567', '555-123-456']
        }
      },
      {
        pattern: '^\\d{3}-\\d{3}-\\d{4}$',
        description: 'Simple US phone format',
        explanation: '^\\d{3} - 3 digits, - - Literal hyphen, \\d{3} - 3 digits, - - Literal hyphen, \\d{4} - 4 digits, $ - End',
        examples: {
          valid: ['555-123-4567', '800-555-1234', '123-456-7890'],
          invalid: ['555.123.4567', '(555) 123-4567', '555-123-456']
        }
      }
    ],
    url: [
      {
        pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
        description: 'HTTP/HTTPS URL validation',
        explanation: '^https? - http or https, :\\/\\/ - Literal ://, (www\\.)? - Optional www., [-a-zA-Z0-9@:%._\\+~#=]{1,256} - Domain chars, \\.[a-zA-Z0-9()]{1,6} - TLD, \\b - Word boundary, ([-a-zA-Z0-9()@:%_\\+.~#?&//=]*) - Optional path/query, $ - End',
        examples: {
          valid: ['https://example.com', 'http://www.test.org/path', 'https://site.com/page?id=123'],
          invalid: ['ftp://example.com', 'https://', 'www.example.com']
        }
      },
      {
        pattern: '^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$',
        description: 'General URL validation',
        explanation: '^(https?|ftp) - Protocol, :\\/\\/ - Literal ://, [^\\s/$.?#] - First char restrictions, [^\\s]* - No whitespace allowed, $ - End',
        examples: {
          valid: ['https://example.com', 'ftp://files.domain.org', 'http://localhost:8080'],
          invalid: ['https:// example.com', 'not-a-url', 'https://']
        }
      }
    ],
    password: [
      {
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        description: 'Strong password (8+ chars, upper, lower, number, special)',
        explanation: '^(?=.*[a-z]) - Contains lowercase, (?=.*[A-Z]) - Contains uppercase, (?=.*\\d) - Contains digit, (?=.*[@$!%*?&]) - Contains special char, [A-Za-z\\d@$!%*?&]{8,} - 8+ allowed chars, $ - End',
        examples: {
          valid: ['Password123!', 'MyStr0ng@Pass', 'Secure#456'],
          invalid: ['password', 'PASSWORD123', 'Pass123', 'Password!']
        }
      },
      {
        pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$',
        description: 'Medium password (6+ chars, letter and number)',
        explanation: '^(?=.*[A-Za-z]) - Contains letter, (?=.*\\d) - Contains digit, [A-Za-z\\d]{6,} - 6+ alphanumeric chars, $ - End',
        examples: {
          valid: ['pass123', 'MyPass1', 'test456'],
          invalid: ['password', '123456', 'pass', 'PASSWORD']
        }
      }
    ],
    date: [
      {
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        description: 'ISO date format (YYYY-MM-DD)',
        explanation: '^\\d{4} - 4 digits for year, - - Literal hyphen, \\d{2} - 2 digits for month, - - Literal hyphen, \\d{2} - 2 digits for day, $ - End',
        examples: {
          valid: ['2023-12-25', '2024-01-01', '2022-06-15'],
          invalid: ['2023/12/25', '23-12-25', '2023-1-1']
        }
      },
      {
        pattern: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/\\d{4}$',
        description: 'US date format (MM/DD/YYYY)',
        explanation: '^(0[1-9]|1[0-2]) - Month 01-12, \\/ - Literal slash, (0[1-9]|[12][0-9]|3[01]) - Day 01-31, \\/ - Literal slash, \\d{4} - 4-digit year, $ - End',
        examples: {
          valid: ['12/25/2023', '01/01/2024', '06/15/2022'],
          invalid: ['25/12/2023', '1/1/2024', '13/01/2023']
        }
      },
      {
        pattern: '^\\d{1,2}:\\d{2}(:\\d{2})?(\\s?(AM|PM))?$',
        description: 'Time format (12/24 hour)',
        explanation: '^\\d{1,2} - 1-2 digit hour, : - Colon, \\d{2} - 2-digit minute, (:\\d{2})? - Optional seconds, (\\s?(AM|PM))? - Optional AM/PM, $ - End',
        examples: {
          valid: ['14:30', '2:30 PM', '09:15:30', '11:45 AM'],
          invalid: ['25:30', '2:60', '14:30 PM', '2:3']
        }
      }
    ],
    number: [
      {
        pattern: '^\\d+$',
        description: 'Positive integers',
        explanation: '^\\d+ - One or more digits, $ - End of string',
        examples: {
          valid: ['123', '0', '999999'],
          invalid: ['-123', '12.3', 'abc', '']
        }
      },
      {
        pattern: '^-?\\d*\\.?\\d+$',
        description: 'Decimal numbers (positive/negative)',
        explanation: '^-? - Optional minus sign, \\d* - Zero or more digits before decimal, \\.? - Optional decimal point, \\d+ - One or more digits after decimal, $ - End',
        examples: {
          valid: ['123.45', '-67.89', '0.5', '42'],
          invalid: ['abc', '12.', '.', '12.34.56']
        }
      },
      {
        pattern: '^\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?$',
        description: 'Currency format',
        explanation: '^\\$? - Optional dollar sign, \\d{1,3} - 1-3 digits, (,\\d{3})* - Zero or more comma-separated groups of 3 digits, (\\.\\d{2})? - Optional cents, $ - End',
        examples: {
          valid: ['$1,234.56', '999', '$12', '1,000,000.00'],
          invalid: ['$1,23.45', '12,34', '$', '1,2345']
        }
      }
    ],
    text: [
      {
        pattern: '^[A-Za-z]+$',
        description: 'Letters only',
        explanation: '^[A-Za-z]+ - One or more uppercase or lowercase letters, $ - End',
        examples: {
          valid: ['Hello', 'world', 'ABC'],
          invalid: ['Hello123', 'test-case', 'hello world']
        }
      },
      {
        pattern: '^[A-Za-z\\s]+$',
        description: 'Letters and spaces',
        explanation: '^[A-Za-z\\s]+ - One or more letters or spaces, $ - End',
        examples: {
          valid: ['Hello World', 'John Doe', 'Test Case'],
          invalid: ['Hello123', 'test-case', 'email@domain.com']
        }
      },
      {
        pattern: '^[A-Z][a-z]*$',
        description: 'Capitalized words',
        explanation: '^[A-Z] - Starts with uppercase letter, [a-z]* - Zero or more lowercase letters, $ - End',
        examples: {
          valid: ['Hello', 'World', 'A'],
          invalid: ['hello', 'HELLO', 'Hello123']
        }
      }
    ],
    ip: [
      {
        pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        description: 'IPv4 address validation',
        explanation: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.) - First 3 octets (0-255) with dots, {3} - Repeat 3 times, (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?) - Last octet (0-255), $ - End',
        examples: {
          valid: ['192.168.1.1', '10.0.0.1', '255.255.255.255'],
          invalid: ['256.1.1.1', '192.168.1', '192.168.1.1.1']
        }
      },
      {
        pattern: '^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$',
        description: 'IPv6 address (full format)',
        explanation: '^([0-9A-Fa-f]{1,4}:){7} - 7 groups of 1-4 hex digits with colons, [0-9A-Fa-f]{1,4} - Final group of 1-4 hex digits, $ - End',
        examples: {
          valid: ['2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'fe80:0000:0000:0000:0202:b3ff:fe1e:8329'],
          invalid: ['192.168.1.1', '2001:db8::1::2', 'invalid:ipv6']
        }
      }
    ],
    credit_card: [
      {
        pattern: '^4[0-9]{12}(?:[0-9]{3})?$',
        description: 'Visa card number',
        explanation: '^4 - Starts with 4, [0-9]{12} - 12 more digits, (?:[0-9]{3})? - Optional 3 more digits (13 or 16 total), $ - End',
        examples: {
          valid: ['4111111111111111', '4000000000000002'],
          invalid: ['5111111111111111', '411111111111111', '41111111111111111']
        }
      },
      {
        pattern: '^5[1-5][0-9]{14}$',
        description: 'MasterCard number',
        explanation: '^5[1-5] - Starts with 51-55, [0-9]{14} - 14 more digits (16 total), $ - End',
        examples: {
          valid: ['5555555555554444', '5105105105105100'],
          invalid: ['4555555555554444', '555555555555444', '55555555555544444']
        }
      }
    ]
  }

  const availableFlags = [
    { key: 'g', name: 'Global', description: 'Find all matches' },
    { key: 'i', name: 'Ignore Case', description: 'Case insensitive' },
    { key: 'm', name: 'Multiline', description: '^$ match line breaks' },
    { key: 's', name: 'Dot All', description: '. matches newlines' },
    { key: 'u', name: 'Unicode', description: 'Unicode support' },
    { key: 'y', name: 'Sticky', description: 'Match from lastIndex' }
  ]

  const generateRegex = async () => {
    setIsGenerating(true)
    
    try {
      let patterns: any[] = []
      
      if (config.type === 'custom' && config.customPattern) {
        patterns = [{
          pattern: config.customPattern,
          description: 'Custom pattern',
          explanation: 'User-defined regular expression pattern',
          examples: { valid: ['Sample text'], invalid: ['Invalid text'] }
        }]
      } else if (config.type !== 'custom') {
        patterns = regexLibrary[config.type as keyof typeof regexLibrary] || []
      }
      
      const newRegexes = patterns.map((patternData, index) => ({
        id: `regex_${Date.now()}_${index}`,
        pattern: patternData.pattern,
        flags: config.flags.join(''),
        description: patternData.description,
        explanation: config.includeExplanation ? patternData.explanation : '',
        examples: config.includeExamples ? patternData.examples : { valid: [], invalid: [] },
        type: config.type,
        timestamp: new Date()
      }))
      
      setGeneratedRegexes([...newRegexes, ...generatedRegexes.slice(0, 10)]) // Keep last 13 regexes
      
    } catch (error) {
      console.error('Error generating regex:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const testRegex = (pattern: string, flags: string) => {
    if (!testString.trim()) return
    
    try {
      const regex = new RegExp(pattern, flags)
      const matches = regex.test(testString)
      setTestResults(prev => ({ ...prev, [`${pattern}_${flags}`]: matches }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, [`${pattern}_${flags}`]: false }))
    }
  }

  const copyRegex = (regex: GeneratedRegex) => {
    const regexString = `/${regex.pattern}/${regex.flags}`
    navigator.clipboard.writeText(regexString)
  }

  const downloadRegex = (regex: GeneratedRegex) => {
    const content = `Regular Expression: /${regex.pattern}/${regex.flags}
Description: ${regex.description}
Type: ${regex.type}
Generated: ${regex.timestamp.toLocaleString()}

${regex.explanation ? `Explanation:
${regex.explanation}

` : ''}${regex.examples.valid.length > 0 ? `Valid Examples:
${regex.examples.valid.map(ex => `✓ ${ex}`).join('\n')}

` : ''}${regex.examples.invalid.length > 0 ? `Invalid Examples:
${regex.examples.invalid.map(ex => `✗ ${ex}`).join('\n')}` : ''}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `regex-${regex.type}-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const toggleFlag = (flag: string) => {
    setConfig(prev => ({
      ...prev,
      flags: prev.flags.includes(flag)
        ? prev.flags.filter(f => f !== flag)
        : [...prev.flags, flag]
    }))
  }

  const loadPreset = (preset: 'validation' | 'extraction' | 'formatting' | 'security') => {
    switch (preset) {
      case 'validation':
        setConfig({
          type: 'email',
          customPattern: '',
          flags: ['i'],
          includeExplanation: true,
          includeExamples: true
        })
        break
      case 'extraction':
        setConfig({
          type: 'url',
          customPattern: '',
          flags: ['g', 'i'],
          includeExplanation: true,
          includeExamples: true
        })
        break
      case 'formatting':
        setConfig({
          type: 'phone',
          customPattern: '',
          flags: ['g'],
          includeExplanation: false,
          includeExamples: true
        })
        break
      case 'security':
        setConfig({
          type: 'password',
          customPattern: '',
          flags: [],
          includeExplanation: true,
          includeExamples: true
        })
        break
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Regex Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate, test, and understand regular expressions for validation, extraction, and text processing. Includes explanations and examples!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5" />
                  Regex Configuration
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your regular expression parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 正则类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Pattern Type</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {regexTypes.map(type => (
                      <button
                        key={type.key}
                        onClick={() => setConfig(prev => ({ ...prev, type: type.key }))}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          config.type === type.key
                            ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
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

                {/* 自定义模式 */}
                {config.type === 'custom' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Custom Pattern</Label>
                    <Input
                      value={config.customPattern}
                      onChange={(e) => setConfig(prev => ({ ...prev, customPattern: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white font-mono"
                      placeholder="Enter your regex pattern"
                    />
                  </div>
                )}

                {/* 标志位 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Flags</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableFlags.map(flag => (
                      <label
                        key={flag.key}
                        className="flex items-center gap-2 text-white cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={config.flags.includes(flag.key)}
                          onChange={() => toggleFlag(flag.key)}
                          className="rounded scale-75"
                        />
                        <div>
                          <span className="text-sm font-mono">{flag.key}</span>
                          <div className="text-xs text-slate-400">{flag.name}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeExplanation}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeExplanation: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include detailed explanation</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeExamples}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeExamples: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include test examples</span>
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
                      onClick={() => loadPreset('validation')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      ✓ Validation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('extraction')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📤 Extraction
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('formatting')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📝 Formatting
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('security')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🔒 Security
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateRegex}
                  disabled={isGenerating || (config.type === 'custom' && !config.customPattern.trim())}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold notranslate"
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
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Regex
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 测试面板 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TestTube className="h-5 w-5" />
                  Test String
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Test your regex patterns against sample text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Input Text</Label>
                  <Textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter text to test against regex patterns"
                    rows={4}
                  />
                </div>
                <div className="text-xs text-slate-400">
                  Enter text and click the test button next to any regex to see if it matches.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的正则表达式 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedRegexes.length > 0 ? (
              generatedRegexes.map((regex, index) => (
                <Card key={regex.id} className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Zap className="h-5 w-5 text-orange-400" />
                          {regex.description}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          Type: {regex.type} • Flags: {regex.flags || 'none'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => testRegex(regex.pattern, regex.flags)}
                          disabled={!testString.trim()}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <TestTube className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                        <Button
                          onClick={() => copyRegex(regex)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadRegex(regex)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* 正则表达式 */}
                    <div className="bg-slate-900 border border-white/20 rounded p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-green-400 font-mono text-lg">
                          /{regex.pattern}/{regex.flags}
                        </code>
                        {testString && testResults[`${regex.pattern}_${regex.flags}`] !== undefined && (
                          <div className="flex items-center gap-1">
                            {testResults[`${regex.pattern}_${regex.flags}`] ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span className={`text-xs ${testResults[`${regex.pattern}_${regex.flags}`] ? 'text-green-400' : 'text-red-400'}`}>
                              {testResults[`${regex.pattern}_${regex.flags}`] ? 'Match' : 'No Match'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 解释 */}
                    {regex.explanation && (
                      <div className="mb-4">
                        <h4 className="text-white font-medium mb-2">Explanation:</h4>
                        <p className="text-slate-300 text-sm">{regex.explanation}</p>
                      </div>
                    )}

                    {/* 示例 */}
                    {(regex.examples.valid.length > 0 || regex.examples.invalid.length > 0) && (
                      <div className="space-y-3">
                        {regex.examples.valid.length > 0 && (
                          <div>
                            <h4 className="text-green-400 font-medium mb-2 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Valid Examples:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {regex.examples.valid.map((example, i) => (
                                <div key={i} className="text-green-300 text-sm font-mono bg-green-500/10 px-2 py-1 rounded">
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {regex.examples.invalid.length > 0 && (
                          <div>
                            <h4 className="text-red-400 font-medium mb-2 flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              Invalid Examples:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {regex.examples.invalid.map((example, i) => (
                                <div key={i} className="text-red-300 text-sm font-mono bg-red-500/10 px-2 py-1 rounded">
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-white/10">
                      <span>Generated {regex.timestamp.toLocaleString()}</span>
                      <span>Regex #{index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Zap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate regex patterns?</p>
                  <p>Select a pattern type and click "Generate Regex"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Regex Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">10 Pattern Types</h4>
                    <p className="text-sm">Generate patterns for emails, URLs, phone numbers, passwords, dates, and more with detailed explanations.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Interactive Testing</h4>
                    <p className="text-sm">Test your regex patterns against sample text in real-time to validate they work as expected.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Flag Configuration</h4>
                    <p className="text-sm">Customize regex behavior with flags like global, case-insensitive, multiline, and more.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Form validation</li>
                      <li>Data extraction</li>
                      <li>Text processing</li>
                      <li>Input sanitization</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Pattern matching</li>
                      <li>Search and replace</li>
                      <li>Data validation</li>
                      <li>Learning regex</li>
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