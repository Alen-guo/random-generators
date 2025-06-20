"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Code, RefreshCw, Copy, Download, Hash, Info, Braces, FileText } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface UUIDResult {
  uuid: string
  version: number
  timestamp: Date
}

export default function UUIDGeneratorPage() {
  const containerRef = useTranslationProtection()
  const [uuidCount, setUuidCount] = useState(10)
  const [uuidVersion, setUuidVersion] = useState<4 | 1>(4)
  const [results, setResults] = useState<UUIDResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [uppercaseFormat, setUppercaseFormat] = useState(false)
  const [removeDashes, setRemoveDashes] = useState(false)

  const generateUUIDs = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newResults: UUIDResult[] = []
    
    for (let i = 0; i < uuidCount; i++) {
      let uuid: string
      
      if (uuidVersion === 4) {
        // Generate UUID v4 (random)
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      } else {
        // Generate UUID v1 (timestamp-based simulation)
        const timestamp = Date.now()
        const random = Math.random().toString(16).substring(2, 15)
        uuid = `${timestamp.toString(16).padStart(8, '0').substring(0, 8)}-${random.substring(0, 4)}-1${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11, 23)}`
      }
      
      // Apply formatting options
      if (removeDashes) {
        uuid = uuid.replace(/-/g, '')
      }
      if (uppercaseFormat) {
        uuid = uuid.toUpperCase()
      }
      
      newResults.push({
        uuid,
        version: uuidVersion,
        timestamp: new Date()
      })
    }
    
    setResults(newResults)
    setIsGenerating(false)
  }

  const copyResults = (format: 'list' | 'array' | 'json' | 'csv' | 'sql') => {
    const uuids = results.map(r => r.uuid)
    let text = ''
    
    switch (format) {
      case 'list':
        text = uuids.join('\n')
        break
      case 'array':
        text = `[${uuids.map(uuid => `"${uuid}"`).join(', ')}]`
        break
      case 'json':
        text = JSON.stringify(uuids, null, 2)
        break
      case 'csv':
        text = 'UUID,Version,Generated\n' + 
               results.map(r => `"${r.uuid}",${r.version},"${r.timestamp.toISOString()}"`).join('\n')
        break
      case 'sql':
        text = uuids.map(uuid => `INSERT INTO table_name (id) VALUES ('${uuid}');`).join('\n')
        break
    }
    
    navigator.clipboard.writeText(text)
  }

  const downloadResults = () => {
    const text = results.map(r => r.uuid).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'uuids.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyProgrammingExample = (language: 'javascript' | 'python' | 'java' | 'csharp') => {
    const examples = {
      javascript: `// JavaScript UUID Generation
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const uuid = generateUUID();
console.log(uuid);`,
      
      python: `# Python UUID Generation
import uuid

# Generate UUID v4
uuid_v4 = str(uuid.uuid4())
print(uuid_v4)

# Generate UUID v1
uuid_v1 = str(uuid.uuid1())
print(uuid_v1)`,
      
      java: `// Java UUID Generation
import java.util.UUID;

public class UUIDGenerator {
    public static void main(String[] args) {
        // Generate random UUID
        UUID uuid = UUID.randomUUID();
        System.out.println(uuid.toString());
    }
}`,
      
      csharp: `// C# UUID Generation
using System;

class Program {
    static void Main() {
        // Generate new GUID (UUID)
        Guid uuid = Guid.NewGuid();
        Console.WriteLine(uuid.ToString());
    }
}`
    }
    
    navigator.clipboard.writeText(examples[language])
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">UUID Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate universally unique identifiers (UUIDs) for your applications. Perfect for database keys, session IDs, and unique references.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：设置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Hash className="h-5 w-5" />
                  UUID Options
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your UUID generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of UUIDs</Label>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    value={uuidCount}
                    onChange={(e) => setUuidCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 10)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-slate-400">1 to 1,000 UUIDs</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">UUID Version</Label>
                  <select
                    value={uuidVersion}
                    onChange={(e) => setUuidVersion(parseInt(e.target.value) as 4 | 1)}
                    className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-white focus:border-cyan-400 focus:ring-cyan-400/20 focus:outline-none"
                  >
                    <option value={4} className="bg-slate-800">Version 4 (Random)</option>
                    <option value={1} className="bg-slate-800">Version 1 (Timestamp)</option>
                  </select>
                  <p className="text-xs text-slate-400">
                    {uuidVersion === 4 ? 'Completely random UUIDs' : 'Time-based UUIDs'}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-300">Format Options</Label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={uppercaseFormat}
                      onChange={(e) => setUppercaseFormat(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-white">Uppercase letters</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={removeDashes}
                      onChange={(e) => setRemoveDashes(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-white">Remove dashes</span>
                  </label>
                </div>

                <Button 
                  onClick={generateUUIDs}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Code className="h-5 w-5 mr-2" />
                      Generate UUIDs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Info className="h-5 w-5" />
                  UUID Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Version 4 (Random)</h4>
                  <p className="text-xs">
                    Completely random 128-bit identifiers. Most commonly used version.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Version 1 (Timestamp)</h4>
                  <p className="text-xs">
                    Based on timestamp and MAC address. Ensures uniqueness across time.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Format</h4>
                  <p className="text-xs font-mono bg-black/20 p-2 rounded">
                    xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
                  </p>
                  <p className="text-xs">
                    M = version, N = variant bits
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Programming Examples</CardTitle>
                <CardDescription className="text-slate-300">
                  Click to copy code examples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => copyProgrammingExample('javascript')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Braces className="h-4 w-4 mr-2" />
                  JavaScript
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyProgrammingExample('python')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Braces className="h-4 w-4 mr-2" />
                  Python
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyProgrammingExample('java')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Braces className="h-4 w-4 mr-2" />
                  Java
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyProgrammingExample('csharp')}
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Braces className="h-4 w-4 mr-2" />
                  C#
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果显示 */}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 && (
              <>
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Generated UUIDs</CardTitle>
                        <CardDescription className="text-slate-300">
                          {results.length} UUID v{uuidVersion} identifiers
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResults('list')}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadResults}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer font-mono"
                          onClick={() => navigator.clipboard.writeText(result.uuid)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 text-white text-sm break-all">
                            {result.uuid}
                          </div>
                          <div className="text-xs text-slate-400">
                            v{result.version}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 导出选项 */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Export Formats</CardTitle>
                    <CardDescription className="text-slate-300">
                      Copy UUIDs in different programming formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => copyResults('list')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Plain List
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('array')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Braces className="h-4 w-4 mr-2" />
                        Array
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('json')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Code className="h-4 w-4 mr-2" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('csv')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyResults('sql')}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Hash className="h-4 w-4 mr-2" />
                        SQL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Applications & Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  UUIDs (Universally Unique Identifiers) provide a standardized way to generate unique identifiers 
                  that are virtually guaranteed to be unique across time and space without requiring a central authority.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Database Applications:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Primary keys for distributed databases</li>
                      <li>Foreign key references</li>
                      <li>Record identifiers across systems</li>
                      <li>Database migration utilities</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Web Development:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Session identifiers</li>
                      <li>API request tracking</li>
                      <li>File upload naming</li>
                      <li>Cache keys</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">System Integration:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Message queue identifiers</li>
                      <li>Distributed system coordination</li>
                      <li>Service-to-service communication</li>
                      <li>Event tracking</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Software Development:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Object instance identifiers</li>
                      <li>Configuration keys</li>
                      <li>Test data generation</li>
                      <li>Temporary file naming</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <h4 className="font-medium text-cyan-300 mb-2">Why Use UUIDs?</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-cyan-100">
                    <li>No central authority required for generation</li>
                    <li>Virtually guaranteed uniqueness</li>
                    <li>Can be generated offline</li>
                    <li>Suitable for distributed systems</li>
                    <li>Standardized format (RFC 4122)</li>
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