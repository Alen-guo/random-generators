"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Binary, ArrowLeftRight, Copy, RefreshCw, Hash, Calculator } from 'lucide-react'

interface ConversionResult {
  decimal: string
  binary: string
  hexadecimal: string
  octal: string
  ascii: string
}

export default function BinaryConverterPage() {
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<'decimal' | 'binary' | 'hex' | 'text'>('decimal')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<ConversionResult[]>([])

  const convert = () => {
    setError('')
    
    try {
      let decimalValue: number
      
      switch (inputType) {
        case 'decimal':
          decimalValue = parseInt(input)
          if (isNaN(decimalValue) || decimalValue < 0) {
            throw new Error('Please enter a valid positive number')
          }
          break
          
        case 'binary':
          if (!/^[01]+$/.test(input)) {
            throw new Error('Binary numbers can only contain 0 and 1')
          }
          decimalValue = parseInt(input, 2)
          break
          
        case 'hex':
          const hexInput = input.replace(/^0x/i, '')
          if (!/^[0-9A-Fa-f]+$/.test(hexInput)) {
            throw new Error('Hexadecimal numbers can only contain 0-9 and A-F')
          }
          decimalValue = parseInt(hexInput, 16)
          break
          
        case 'text':
          // Convert each character to its ASCII value, then to other formats
          const conversions = input.split('').map(char => {
            const ascii = char.charCodeAt(0)
            return {
              char,
              decimal: ascii.toString(),
              binary: ascii.toString(2).padStart(8, '0'),
              hex: ascii.toString(16).toUpperCase().padStart(2, '0'),
              octal: ascii.toString(8)
            }
          })
          
          const textResult: ConversionResult = {
            decimal: conversions.map(c => c.decimal).join(' '),
            binary: conversions.map(c => c.binary).join(' '),
            hexadecimal: conversions.map(c => c.hex).join(' '),
            octal: conversions.map(c => c.octal).join(' '),
            ascii: input
          }
          
          setResult(textResult)
          setHistory(prev => [textResult, ...prev.slice(0, 9)])
          return
      }
      
      if (decimalValue > Number.MAX_SAFE_INTEGER) {
        throw new Error('Number is too large')
      }
      
      const conversionResult: ConversionResult = {
        decimal: decimalValue.toString(),
        binary: decimalValue.toString(2),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
        octal: decimalValue.toString(8),
        ascii: decimalValue <= 127 ? String.fromCharCode(decimalValue) : 'N/A'
      }
      
      setResult(conversionResult)
      setHistory(prev => [conversionResult, ...prev.slice(0, 9)])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error')
    }
  }

  const generateRandom = () => {
    const randomNum = Math.floor(Math.random() * 1000) + 1
    setInput(randomNum.toString())
    setInputType('decimal')
  }

  const loadPreset = (preset: 'powers2' | 'ascii' | 'colors' | 'network') => {
    switch (preset) {
      case 'powers2':
        setInput('1024')
        setInputType('decimal')
        break
      case 'ascii':
        setInput('Hello')
        setInputType('text')
        break
      case 'colors':
        setInput('FF6B6B')
        setInputType('hex')
        break
      case 'network':
        setInput('192')
        setInputType('decimal')
        break
    }
  }

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatBinary = (binary: string) => {
    // Group binary digits in groups of 4 for better readability
    return binary.replace(/(.{4})/g, '$1 ').trim()
  }

  const getInputPlaceholder = () => {
    switch (inputType) {
      case 'decimal': return 'Enter decimal number (e.g., 255)'
      case 'binary': return 'Enter binary number (e.g., 11111111)'
      case 'hex': return 'Enter hex number (e.g., FF or 0xFF)'
      case 'text': return 'Enter text (e.g., Hello)'
    }
  }

  const getBitCount = (decimal: string) => {
    const num = parseInt(decimal)
    if (isNaN(num) || num === 0) return 0
    return Math.floor(Math.log2(num)) + 1
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
              <Binary className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Binary Converter</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Convert between decimal, binary, hexadecimal, octal, and ASCII. Perfect for programming, computer science, and digital systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：输入和控制 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ArrowLeftRight className="h-5 w-5" />
                  Input & Convert
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Enter value and select input type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Input Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInputType('decimal')}
                      className={`p-2 rounded text-sm transition-colors ${
                        inputType === 'decimal'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 border'
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10 border'
                      }`}
                    >
                      Decimal
                    </button>
                    <button
                      onClick={() => setInputType('binary')}
                      className={`p-2 rounded text-sm transition-colors ${
                        inputType === 'binary'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 border'
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10 border'
                      }`}
                    >
                      Binary
                    </button>
                    <button
                      onClick={() => setInputType('hex')}
                      className={`p-2 rounded text-sm transition-colors ${
                        inputType === 'hex'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 border'
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10 border'
                      }`}
                    >
                      Hex
                    </button>
                    <button
                      onClick={() => setInputType('text')}
                      className={`p-2 rounded text-sm transition-colors ${
                        inputType === 'text'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 border'
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10 border'
                      }`}
                    >
                      Text
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Input Value</Label>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getInputPlaceholder()}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={convert}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Convert
                  </Button>
                  <Button
                    onClick={generateRandom}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* 预设值 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Examples</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('powers2')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Powers of 2
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('ascii')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      ASCII Text
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('colors')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Color Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('network')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      IP Address
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 中间：转换结果 */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Conversion Results</CardTitle>
                  <CardDescription className="text-slate-300">
                    All number system representations
                    {result.decimal && ` • ${getBitCount(result.decimal)} bits required`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                      onClick={() => copyToClipboard(result.decimal, 'decimal')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-300 font-medium">Decimal (Base 10)</span>
                        <Copy className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="text-white font-mono text-lg break-all">{result.decimal}</div>
                    </div>

                    <div
                      className="p-4 bg-green-500/10 border border-green-400/30 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors"
                      onClick={() => copyToClipboard(result.binary, 'binary')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-300 font-medium">Binary (Base 2)</span>
                        <Copy className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="text-white font-mono text-sm break-all">
                        {formatBinary(result.binary)}
                      </div>
                    </div>

                    <div
                      className="p-4 bg-orange-500/10 border border-orange-400/30 rounded-lg cursor-pointer hover:bg-orange-500/20 transition-colors"
                      onClick={() => copyToClipboard(result.hexadecimal, 'hexadecimal')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-orange-300 font-medium">Hexadecimal (Base 16)</span>
                        <Copy className="h-4 w-4 text-orange-400" />
                      </div>
                      <div className="text-white font-mono text-lg break-all">0x{result.hexadecimal}</div>
                    </div>

                    <div
                      className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg cursor-pointer hover:bg-purple-500/20 transition-colors"
                      onClick={() => copyToClipboard(result.octal, 'octal')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-300 font-medium">Octal (Base 8)</span>
                        <Copy className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="text-white font-mono text-lg break-all">0{result.octal}</div>
                    </div>
                  </div>

                  {result.ascii && result.ascii !== 'N/A' && (
                    <div
                      className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-colors"
                      onClick={() => copyToClipboard(result.ascii, 'ascii')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-yellow-300 font-medium">ASCII Character</span>
                        <Copy className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="text-white font-mono text-lg">"{result.ascii}"</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 转换历史 */}
            {history.length > 0 && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Hash className="h-5 w-5" />
                    Conversion History
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Recent conversions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <div className="text-slate-400">Dec:</div>
                            <div className="text-white font-mono">{item.decimal}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Bin:</div>
                            <div className="text-white font-mono text-xs break-all">
                              {item.binary.length > 12 ? item.binary.substring(0, 12) + '...' : item.binary}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Hex:</div>
                            <div className="text-white font-mono">{item.hexadecimal}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Oct:</div>
                            <div className="text-white font-mono">{item.octal}</div>
                          </div>
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
                <CardTitle className="text-white">Number Systems Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-cyan-300">Decimal (Base 10)</h4>
                      <p className="text-sm">Uses digits 0-9. Most common number system for humans.</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-green-300">Binary (Base 2)</h4>
                      <p className="text-sm">Uses only 0 and 1. Foundation of all computer systems.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-orange-300">Hexadecimal (Base 16)</h4>
                      <p className="text-sm">Uses 0-9 and A-F. Common in programming and color codes.</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-purple-300">Octal (Base 8)</h4>
                      <p className="text-sm">Uses digits 0-7. Historical use in computer systems.</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Applications:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Computer programming</li>
                      <li>Digital electronics</li>
                      <li>Network addressing</li>
                      <li>Color code conversion</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Memory addressing</li>
                      <li>Data encoding</li>
                      <li>Cryptography</li>
                      <li>Computer science education</li>
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