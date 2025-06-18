"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Hash, Shuffle } from 'lucide-react'

export default function PrimesPage() {
  const [count, setCount] = useState(20)
  const [min, setMin] = useState(2)
  const [max, setMax] = useState(1000)
  const [primes, setPrimes] = useState<number[]>([])

  const isPrime = (num: number) => {
    if (num < 2) return false
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false
    }
    return true
  }

  const generatePrimes = () => {
    const result: number[] = []
    let current = Math.max(2, min)
    
    while (result.length < count && current <= max) {
      if (isPrime(current)) {
        result.push(current)
      }
      current++
    }
    
    setPrimes(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Prime Numbers Generator</h1>
          <p className="text-xl text-red-200 max-w-2xl mx-auto">
            Generate prime numbers within specified ranges for mathematical and cryptographic applications.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Hash className="h-5 w-5 text-red-400" />
                Prime Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count" className="text-white">Count</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min" className="text-white">Min Value</Label>
                  <Input
                    id="min"
                    type="number"
                    min="2"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value) || 2)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max" className="text-white">Max Value</Label>
                  <Input
                    id="max"
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value) || 1000)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button onClick={generatePrimes} className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Primes
              </Button>
            </CardContent>
          </Card>

          {primes.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Generated Prime Numbers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {primes.map((prime, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-3 text-center text-white font-mono">
                      {prime}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 