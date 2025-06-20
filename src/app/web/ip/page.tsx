"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Globe, RefreshCw, Copy, Download, Network, Wifi, Shield } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface IPConfig {
  type: 'ipv4' | 'ipv6' | 'private' | 'public' | 'local'
  count: number
  format: 'standard' | 'cidr' | 'binary' | 'decimal'
  subnet?: string
}

interface GeneratedIP {
  address: string
  type: string
  format: string
  binary?: string
  decimal?: number
  subnet?: string
  timestamp: Date
  id: string
}

export default function IPPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<IPConfig>({
    type: 'ipv4',
    count: 10,
    format: 'standard'
  })
  const [generatedIPs, setGeneratedIPs] = useState<GeneratedIP[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const ipTypes = [
    { 
      key: 'ipv4', 
      name: 'IPv4 Public', 
      description: 'Standard IPv4 addresses',
      example: '192.168.1.1',
      icon: '🌐'
    },
    { 
      key: 'private', 
      name: 'IPv4 Private', 
      description: 'Private network addresses',
      example: '10.0.0.1, 172.16.0.1, 192.168.0.1',
      icon: '🏠'
    },
    { 
      key: 'local', 
      name: 'IPv4 Local', 
      description: 'Localhost and loopback',
      example: '127.0.0.1',
      icon: '💻'
    },
    { 
      key: 'ipv6', 
      name: 'IPv6', 
      description: 'IPv6 addresses',
      example: '2001:db8::1',
      icon: '🌍'
    }
  ]

  const formats = [
    { key: 'standard', name: 'Standard', description: 'Dotted decimal notation' },
    { key: 'cidr', name: 'CIDR', description: 'With subnet mask' },
    { key: 'binary', name: 'Binary', description: 'Binary representation' },
    { key: 'decimal', name: 'Decimal', description: 'Single decimal number' }
  ]

  const privateRanges = [
    { start: [10, 0, 0, 0], end: [10, 255, 255, 255], name: 'Class A Private' },
    { start: [172, 16, 0, 0], end: [172, 31, 255, 255], name: 'Class B Private' },
    { start: [192, 168, 0, 0], end: [192, 168, 255, 255], name: 'Class C Private' }
  ]

  const generateRandomOctet = (): number => Math.floor(Math.random() * 256)

  const generateIPv4 = (type: string): string => {
    let octets: number[] = []

    switch (type) {
      case 'private':
        const range = privateRanges[Math.floor(Math.random() * privateRanges.length)]
        octets = [
          Math.floor(Math.random() * (range.end[0] - range.start[0] + 1)) + range.start[0],
          Math.floor(Math.random() * (range.end[1] - range.start[1] + 1)) + range.start[1],
          Math.floor(Math.random() * (range.end[2] - range.start[2] + 1)) + range.start[2],
          Math.floor(Math.random() * (range.end[3] - range.start[3] + 1)) + range.start[3]
        ]
        break
      
      case 'local':
        octets = [127, 0, 0, Math.floor(Math.random() * 254) + 1]
        break
      
      case 'ipv4':
      default:
        // Avoid private and reserved ranges
        do {
          octets = [generateRandomOctet(), generateRandomOctet(), generateRandomOctet(), generateRandomOctet()]
        } while (
          (octets[0] === 10) ||
          (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
          (octets[0] === 192 && octets[1] === 168) ||
          (octets[0] === 127) ||
          (octets[0] === 0) ||
          (octets[0] >= 224)
        )
        break
    }

    return octets.join('.')
  }

  const generateIPv6 = (): string => {
    const segments = []
    for (let i = 0; i < 8; i++) {
      segments.push(Math.floor(Math.random() * 65536).toString(16).padStart(4, '0'))
    }
    return segments.join(':')
  }

  const ipToBinary = (ip: string): string => {
    return ip.split('.').map(octet => 
      parseInt(octet).toString(2).padStart(8, '0')
    ).join('.')
  }

  const ipToDecimal = (ip: string): number => {
    const octets = ip.split('.').map(Number)
    return (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3]
  }

  const formatIP = (ip: string, format: string, type: string): string => {
    if (type === 'ipv6') return ip

    switch (format) {
      case 'cidr':
        const subnet = Math.floor(Math.random() * 9) + 24 // /24 to /32
        return `${ip}/${subnet}`
      
      case 'binary':
        return ipToBinary(ip)
      
      case 'decimal':
        return ipToDecimal(ip).toString()
      
      case 'standard':
      default:
        return ip
    }
  }

  const generateIPs = async () => {
    setIsGenerating(true)
    
    try {
      const ips: GeneratedIP[] = []
      
      for (let i = 0; i < config.count; i++) {
        let baseIP: string
        
        if (config.type === 'ipv6') {
          baseIP = generateIPv6()
        } else {
          baseIP = generateIPv4(config.type)
        }
        
        const formattedIP = formatIP(baseIP, config.format, config.type)
        
        const generatedIP: GeneratedIP = {
          address: formattedIP,
          type: config.type,
          format: config.format,
          timestamp: new Date(),
          id: `ip_${Date.now()}_${i}`
        }

        // Add extra info for IPv4
        if (config.type !== 'ipv6') {
          if (config.format !== 'binary') {
            generatedIP.binary = ipToBinary(baseIP)
          }
          if (config.format !== 'decimal') {
            generatedIP.decimal = ipToDecimal(baseIP)
          }
        }
        
        ips.push(generatedIP)
        
        // Add delay for animation
        if (i % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      setGeneratedIPs(ips)
    } catch (error) {
      console.error('Error generating IPs:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyIP = (ip: string) => {
    navigator.clipboard.writeText(ip)
  }

  const copyAllIPs = () => {
    const allIPs = generatedIPs.map(ip => ip.address).join('\n')
    navigator.clipboard.writeText(allIPs)
  }

  const downloadIPs = () => {
    const content = generatedIPs.map(ip => 
      `${ip.address}\t${ip.type}\t${ip.format}\t${ip.binary || ''}\t${ip.decimal || ''}`
    ).join('\n')
    
    const header = 'IP Address\tType\tFormat\tBinary\tDecimal\n'
    const blob = new Blob([header + content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-ips-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'testing' | 'network' | 'security' | 'development') => {
    switch (preset) {
      case 'testing':
        setConfig({ type: 'private', count: 20, format: 'standard' })
        break
      case 'network':
        setConfig({ type: 'ipv4', count: 15, format: 'cidr' })
        break
      case 'security':
        setConfig({ type: 'ipv4', count: 10, format: 'decimal' })
        break
      case 'development':
        setConfig({ type: 'local', count: 5, format: 'standard' })
        break
    }
  }

  const getTypeIcon = (type: string) => {
    const typeInfo = ipTypes.find(t => t.key === type)
    return typeInfo?.icon || '🌐'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ipv4': return 'text-blue-400'
      case 'private': return 'text-green-400'
      case 'local': return 'text-purple-400'
      case 'ipv6': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  const validateIPRange = (type: string): boolean => {
    // Basic validation logic
    return true
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">IP Address Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate random IP addresses for testing, development, and network simulation. Supports IPv4, IPv6, and various formats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：IP配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Network className="h-5 w-5" />
                  IP Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure IP address generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* IP类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">IP Type</Label>
                  <div className="space-y-2">
                    {ipTypes.map(type => (
                      <button
                        key={type.key}
                        onClick={() => setConfig(prev => ({ ...prev, type: type.key as any }))}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.type === type.key
                            ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-1">
                          {type.description}
                        </div>
                        <div className="text-xs text-slate-500">
                          Example: {type.example}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 格式选择 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Format</Label>
                  <select
                    value={config.format}
                    onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                    disabled={config.type === 'ipv6'}
                  >
                    {formats.map(format => (
                      <option key={format.key} value={format.key} className="bg-slate-800">
                        {format.name} - {format.description}
                      </option>
                    ))}
                  </select>
                  {config.type === 'ipv6' && (
                    <div className="text-slate-400 text-xs">
                      IPv6 only supports standard format
                    </div>
                  )}
                </div>

                {/* 生成数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of IPs</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      count: Math.max(1, Math.min(100, parseInt(e.target.value) || 10))
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('testing')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Testing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('network')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Network className="h-3 w-3 mr-1" />
                      Network
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('security')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      Security
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('development')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Wifi className="h-3 w-3 mr-1" />
                      Dev
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateIPs}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold notranslate"
                >
                  translate="no"
                  data-interactive="true"
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Generate IPs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的IP */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated IP Addresses</CardTitle>
                    <CardDescription className="text-slate-300">
                      {generatedIPs.length > 0 ? `${generatedIPs.length} IP addresses generated` : 'No IP addresses generated yet'}
                    </CardDescription>
                  </div>
                  {generatedIPs.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={copyAllIPs}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy All
                      </Button>
                      <Button
                        onClick={downloadIPs}
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
                {generatedIPs.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {generatedIPs.map((ip, index) => (
                        <div
                          key={ip.id}
                          className="p-4 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(ip.type)}</span>
                              <span className="text-white font-mono text-lg">
                                {ip.address}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${getTypeColor(ip.type)} bg-white/10`}>
                                {ip.type.toUpperCase()}
                              </span>
                            </div>
                            <Button
                              onClick={() => copyIP(ip.address)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Additional formats for IPv4 */}
                          {ip.type !== 'ipv6' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {ip.binary && (
                                <div>
                                  <div className="text-slate-400 text-xs">Binary:</div>
                                  <div className="text-slate-300 font-mono">{ip.binary}</div>
                                </div>
                              )}
                              {ip.decimal && (
                                <div>
                                  <div className="text-slate-400 text-xs">Decimal:</div>
                                  <div className="text-slate-300 font-mono">{ip.decimal.toLocaleString()}</div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                            <span>Format: {ip.format}</span>
                            <span>#{index + 1} • {ip.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate IP addresses?</p>
                    <p>Configure your settings and click "Generate IPs"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">IP Address Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">IP Types</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Public IPv4:</strong> Internet-routable addresses</div>
                      <div><strong>Private IPv4:</strong> Internal network addresses (RFC 1918)</div>
                      <div><strong>Local IPv4:</strong> Localhost and loopback addresses</div>
                      <div><strong>IPv6:</strong> Next-generation internet addresses</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Output Formats</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Standard:</strong> Traditional dotted decimal notation</div>
                      <div><strong>CIDR:</strong> Includes subnet mask for network planning</div>
                      <div><strong>Binary:</strong> Binary representation for analysis</div>
                      <div><strong>Decimal:</strong> Single number representation</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Network testing</li>
                      <li>Security analysis</li>
                      <li>Database seeding</li>
                      <li>Load balancing</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Firewall rules</li>
                      <li>API testing</li>
                      <li>Network simulation</li>
                      <li>Development data</li>
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