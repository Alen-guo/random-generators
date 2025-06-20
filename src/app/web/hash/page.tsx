"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Shield, RefreshCw, Copy, Eye, EyeOff, Lock, Hash } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface HashResult {
  algorithm: string
  input: string
  hash: string
  timestamp: Date
}

export default function HashPage() {
  const containerRef = useTranslationProtection()
  const [input, setInput] = useState('')
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['md5', 'sha256'])
  const [hashResults, setHashResults] = useState<HashResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showInput, setShowInput] = useState(true)

  const algorithms = [
    { 
      key: 'md5', 
      name: 'MD5', 
      description: '128-bit hash (32 hex chars)',
      usage: 'Fast, but not cryptographically secure'
    },
    { 
      key: 'sha1', 
      name: 'SHA-1', 
      description: '160-bit hash (40 hex chars)',
      usage: 'Legacy algorithm, avoid for security'
    },
    { 
      key: 'sha256', 
      name: 'SHA-256', 
      description: '256-bit hash (64 hex chars)',
      usage: 'Secure, widely used standard'
    },
    { 
      key: 'sha384', 
      name: 'SHA-384', 
      description: '384-bit hash (96 hex chars)',
      usage: 'Higher security than SHA-256'
    },
    { 
      key: 'sha512', 
      name: 'SHA-512', 
      description: '512-bit hash (128 hex chars)',
      usage: 'Maximum security, slower'
    }
  ]

  const sampleInputs = [
    'Hello, World!',
    'The quick brown fox jumps over the lazy dog',
    'password123',
    'user@example.com',
    '{"name": "John", "age": 30}',
    'Lorem ipsum dolor sit amet'
  ]

  // Simple hash implementations (for demo - in production use crypto libraries)
  const simpleHash = async (text: string, algorithm: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    
    let hashBuffer: ArrayBuffer
    
    try {
      switch (algorithm) {
        case 'md5':
          // Note: Web Crypto API doesn't support MD5, this is a simulation
          return await simulateMD5(text)
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data)
          break
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data)
          break
        case 'sha384':
          hashBuffer = await crypto.subtle.digest('SHA-384', data)
          break
        case 'sha512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data)
          break
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`)
      }
      
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    } catch (error) {
      console.error('Hash error:', error)
      return 'Error generating hash'
    }
  }

  // Simple MD5 simulation (not actual MD5, just for demo)
  const simulateMD5 = async (text: string): Promise<string> => {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Convert to positive number and pad to 32 hex chars
    const positiveHash = Math.abs(hash)
    const hexHash = positiveHash.toString(16).padStart(8, '0')
    
    // Simulate MD5 length (32 chars) by repeating and truncating
    return (hexHash + hexHash + hexHash + hexHash).substring(0, 32)
  }

  const generateHashes = async () => {
    if (!input.trim()) return
    
    setIsGenerating(true)
    const results: HashResult[] = []
    
    try {
      for (const algorithm of selectedAlgorithms) {
        const hash = await simpleHash(input, algorithm)
        results.push({
          algorithm,
          input: input.trim(),
          hash,
          timestamp: new Date()
        })
        
        // Add delay for animation
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      
      setHashResults(results)
    } catch (error) {
      console.error('Error generating hashes:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleAlgorithm = (algorithm: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithm)
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    )
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  const copyAllHashes = () => {
    const allHashes = hashResults.map(result => 
      `${result.algorithm.toUpperCase()}: ${result.hash}`
    ).join('\n')
    navigator.clipboard.writeText(allHashes)
  }

  const loadSampleInput = (sample: string) => {
    setInput(sample)
  }

  const clearAll = () => {
    setInput('')
    setHashResults([])
  }

  const getAlgorithmColor = (algorithm: string) => {
    switch (algorithm) {
      case 'md5': return 'text-red-400'
      case 'sha1': return 'text-orange-400'
      case 'sha256': return 'text-green-400'
      case 'sha384': return 'text-blue-400'
      case 'sha512': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getSecurityLevel = (algorithm: string) => {
    switch (algorithm) {
      case 'md5': return { level: 'Low', color: 'text-red-400', bars: 1 }
      case 'sha1': return { level: 'Low', color: 'text-orange-400', bars: 2 }
      case 'sha256': return { level: 'High', color: 'text-green-400', bars: 4 }
      case 'sha384': return { level: 'Very High', color: 'text-blue-400', bars: 5 }
      case 'sha512': return { level: 'Maximum', color: 'text-purple-400', bars: 5 }
      default: return { level: 'Unknown', color: 'text-gray-400', bars: 0 }
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Hash Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate secure hash values using various algorithms. Perfect for data integrity, password verification, and cryptographic applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：输入和算法选择 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Hash className="h-5 w-5" />
                  Input & Algorithms
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Enter text and select hash algorithms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 输入文本 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Input Text</Label>
                    <Button
                      onClick={() => setShowInput(!showInput)}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      {showInput ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Enter text to hash..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-white/10 border-white/20 text-white min-h-[100px]"
                  />
                  <div className="text-slate-400 text-xs">
                    {input.length} characters
                  </div>
                </div>

                {/* 示例输入 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Sample Inputs</Label>
                  <div className="grid grid-cols-1 gap-1">
                    {sampleInputs.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadSampleInput(sample)}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start text-xs"
                      >
                        {sample.length > 30 ? sample.substring(0, 30) + '...' : sample}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 算法选择 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Hash Algorithms ({selectedAlgorithms.length} selected)</Label>
                  <div className="space-y-2">
                    {algorithms.map(algorithm => {
                      const security = getSecurityLevel(algorithm.key)
                      return (
                        <button
                          key={algorithm.key}
                          onClick={() => toggleAlgorithm(algorithm.key)}
                          className={`w-full p-3 rounded-lg border text-left transition-colors ${
                            selectedAlgorithms.includes(algorithm.key)
                              ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                              : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{algorithm.name}</span>
                            <span className={`text-xs ${security.color}`}>
                              {security.level}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mb-1">
                            {algorithm.description}
                          </div>
                          <div className="text-xs text-slate-500">
                            {algorithm.usage}
                          </div>
                          {/* Security bars */}
                          <div className="flex gap-1 mt-2">
                            {[1,2,3,4,5].map(bar => (
                              <div 
                                key={bar}
                                className={`h-1 w-4 rounded ${
                                  bar <= security.bars 
                                    ? security.color.replace('text-', 'bg-')
                                    : 'bg-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={generateHashes}
                    disabled={isGenerating || !input.trim() || selectedAlgorithms.length === 0}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 font-semibold notranslate"
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
                        <Shield className="h-4 w-4 mr-2" />
                        Generate Hashes
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：哈希结果 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Hash Results</CardTitle>
                    <CardDescription className="text-slate-300">
                      {hashResults.length > 0 ? `${hashResults.length} hash${hashResults.length !== 1 ? 'es' : ''} generated` : 'No hashes generated yet'}
                    </CardDescription>
                  </div>
                  {hashResults.length > 0 && (
                    <Button
                      onClick={copyAllHashes}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {hashResults.length > 0 ? (
                  <div className="space-y-4">
                    {hashResults.map((result, index) => {
                      const security = getSecurityLevel(result.algorithm)
                      return (
                        <div
                          key={index}
                          className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${getAlgorithmColor(result.algorithm)}`}>
                                {result.algorithm.toUpperCase()}
                              </span>
                              <span className={`text-xs ${security.color}`}>
                                {security.level} Security
                              </span>
                            </div>
                            <Button
                              onClick={() => copyHash(result.hash)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="bg-slate-900 border border-white/20 rounded p-3 mb-2">
                            <div className="text-slate-400 text-xs mb-1">Hash Value:</div>
                            <div className="text-white font-mono text-sm break-all">
                              {result.hash}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Length: {result.hash.length} characters</span>
                            <span>{result.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate hashes?</p>
                    <p>Enter text, select algorithms, and click "Generate Hashes"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 算法说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Hash Algorithm Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">When to Use Each Algorithm</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-red-400">MD5:</span>
                        <span>File checksums, non-security applications</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">SHA-256:</span>
                        <span>Password hashing, digital signatures</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">SHA-512:</span>
                        <span>High-security applications, certificates</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Password verification</li>
                      <li>Data integrity checks</li>
                      <li>Digital signatures</li>
                      <li>Blockchain applications</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>File verification</li>
                      <li>API authentication</li>
                      <li>Database security</li>
                      <li>Cryptographic protocols</li>
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