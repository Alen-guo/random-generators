"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Hash, Shuffle, Copy, Download } from 'lucide-react'
import { motion } from 'framer-motion'

interface SequenceConfig {
  type: 'arithmetic' | 'geometric' | 'fibonacci' | 'prime' | 'custom'
  start: number
  step: number
  ratio: number
  length: number
  min: number
  max: number
}

export default function SequencesPage() {
  const [config, setConfig] = useState<SequenceConfig>({
    type: 'arithmetic',
    start: 1,
    step: 1,
    ratio: 2,
    length: 10,
    min: 1,
    max: 100
  })
  
  const [sequences, setSequences] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSequence = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      let result: number[] = []
      
      switch (config.type) {
        case 'arithmetic':
          for (let i = 0; i < config.length; i++) {
            result.push(config.start + i * config.step)
          }
          break
          
        case 'geometric':
          for (let i = 0; i < config.length; i++) {
            result.push(config.start * Math.pow(config.ratio, i))
          }
          break
          
        case 'fibonacci':
          if (config.length >= 1) result.push(0)
          if (config.length >= 2) result.push(1)
          for (let i = 2; i < config.length; i++) {
            result.push(result[i-1] + result[i-2])
          }
          break
          
        case 'prime':
          const primes: number[] = []
          let num = 2
          while (primes.length < config.length) {
            let isPrime = true
            for (let i = 2; i <= Math.sqrt(num); i++) {
              if (num % i === 0) {
                isPrime = false
                break
              }
            }
            if (isPrime) primes.push(num)
            num++
          }
          result = primes
          break
          
        case 'custom':
          for (let i = 0; i < config.length; i++) {
            result.push(Math.floor(Math.random() * (config.max - config.min + 1)) + config.min)
          }
          break
      }
      
      setSequences(result)
      setIsGenerating(false)
    }, 500)
  }

  const copySequences = () => {
    navigator.clipboard.writeText(sequences.join(', '))
  }

  const downloadSequences = () => {
    const text = sequences.join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'number-sequences.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Number Sequences Generator
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Generate various mathematical number sequences including arithmetic, geometric, Fibonacci, and prime sequences.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-400" />
                Sequence Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Sequence Type</Label>
                  <Select value={config.type} onValueChange={(value: SequenceConfig['type']) => setConfig({...config, type: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arithmetic">Arithmetic</SelectItem>
                      <SelectItem value="geometric">Geometric</SelectItem>
                      <SelectItem value="fibonacci">Fibonacci</SelectItem>
                      <SelectItem value="prime">Prime Numbers</SelectItem>
                      <SelectItem value="custom">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length" className="text-white">Length</Label>
                  <Input
                    id="length"
                    type="number"
                    min="1"
                    max="100"
                    value={config.length}
                    onChange={(e) => setConfig({...config, length: parseInt(e.target.value) || 1})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {(config.type === 'arithmetic' || config.type === 'geometric') && (
                  <div className="space-y-2">
                    <Label htmlFor="start" className="text-white">Start Value</Label>
                    <Input
                      id="start"
                      type="number"
                      value={config.start}
                      onChange={(e) => setConfig({...config, start: parseInt(e.target.value) || 1})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                )}

                {config.type === 'arithmetic' && (
                  <div className="space-y-2">
                    <Label htmlFor="step" className="text-white">Step</Label>
                    <Input
                      id="step"
                      type="number"
                      value={config.step}
                      onChange={(e) => setConfig({...config, step: parseInt(e.target.value) || 1})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                )}

                {config.type === 'geometric' && (
                  <div className="space-y-2">
                    <Label htmlFor="ratio" className="text-white">Ratio</Label>
                    <Input
                      id="ratio"
                      type="number"
                      value={config.ratio}
                      onChange={(e) => setConfig({...config, ratio: parseInt(e.target.value) || 2})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                )}

                {config.type === 'custom' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="min" className="text-white">Min Value</Label>
                      <Input
                        id="min"
                        type="number"
                        value={config.min}
                        onChange={(e) => setConfig({...config, min: parseInt(e.target.value) || 1})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max" className="text-white">Max Value</Label>
                      <Input
                        id="max"
                        type="number"
                        value={config.max}
                        onChange={(e) => setConfig({...config, max: parseInt(e.target.value) || 100})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </>
                )}
              </div>

              <Button 
                onClick={generateSequence}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate Sequence
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {sequences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Generated Sequence</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copySequences}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadSequences}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {sequences.map((num, index) => (
                      <div
                        key={index}
                        className="bg-white/20 rounded-lg p-3 text-center text-white font-mono"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}