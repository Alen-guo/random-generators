"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Database, RefreshCw, Copy, Download, Code, Users, ShoppingCart } from 'lucide-react'

interface DataField {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'date' | 'url' | 'uuid' | 'array'
  options?: string[]
}

interface GeneratedData {
  data: any[]
  schema: DataField[]
  timestamp: Date
  count: number
}

export default function JsonPage() {
  const [schema, setSchema] = useState<DataField[]>([
    { id: '1', name: 'id', type: 'number' },
    { id: '2', name: 'name', type: 'string' },
    { id: '3', name: 'email', type: 'email' },
    { id: '4', name: 'active', type: 'boolean' }
  ])
  const [recordCount, setRecordCount] = useState(10)
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldType, setNewFieldType] = useState<DataField['type']>('string')

  const fieldTypes = [
    { value: 'string', label: 'String', example: 'John Doe' },
    { value: 'number', label: 'Number', example: '123' },
    { value: 'boolean', label: 'Boolean', example: 'true/false' },
    { value: 'email', label: 'Email', example: 'user@example.com' },
    { value: 'phone', label: 'Phone', example: '+1-555-0123' },
    { value: 'date', label: 'Date', example: '2024-01-15' },
    { value: 'url', label: 'URL', example: 'https://example.com' },
    { value: 'uuid', label: 'UUID', example: 'abc123...' },
    { value: 'array', label: 'Array', example: '[1,2,3]' }
  ]

  const presetSchemas = {
    users: [
      { id: '1', name: 'id', type: 'number' as const },
      { id: '2', name: 'firstName', type: 'string' as const },
      { id: '3', name: 'lastName', type: 'string' as const },
      { id: '4', name: 'email', type: 'email' as const },
      { id: '5', name: 'phone', type: 'phone' as const },
      { id: '6', name: 'birthDate', type: 'date' as const },
      { id: '7', name: 'isActive', type: 'boolean' as const }
    ],
    products: [
      { id: '1', name: 'id', type: 'number' as const },
      { id: '2', name: 'name', type: 'string' as const },
      { id: '3', name: 'price', type: 'number' as const },
      { id: '4', name: 'category', type: 'string' as const },
      { id: '5', name: 'inStock', type: 'boolean' as const },
      { id: '6', name: 'url', type: 'url' as const },
      { id: '7', name: 'createdAt', type: 'date' as const }
    ],
    posts: [
      { id: '1', name: 'id', type: 'uuid' as const },
      { id: '2', name: 'title', type: 'string' as const },
      { id: '3', name: 'content', type: 'string' as const },
      { id: '4', name: 'authorEmail', type: 'email' as const },
      { id: '5', name: 'publishedAt', type: 'date' as const },
      { id: '6', name: 'tags', type: 'array' as const },
      { id: '7', name: 'isPublished', type: 'boolean' as const }
    ]
  }

  const generateValue = (field: DataField, index: number): any => {
    switch (field.type) {
      case 'number':
        if (field.name.toLowerCase().includes('id')) return index + 1
        if (field.name.toLowerCase().includes('price')) return Math.floor(Math.random() * 1000) + 10
        return Math.floor(Math.random() * 100)
        
      case 'string':
        if (field.name.toLowerCase().includes('name') || field.name.toLowerCase().includes('title')) {
          const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Davis']
          return names[Math.floor(Math.random() * names.length)]
        }
        if (field.name.toLowerCase().includes('category')) {
          const categories = ['Electronics', 'Clothing', 'Books', 'Sports', 'Home', 'Beauty']
          return categories[Math.floor(Math.random() * categories.length)]
        }
        if (field.name.toLowerCase().includes('content')) {
          const content = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.'
          ]
          return content[Math.floor(Math.random() * content.length)]
        }
        return `Sample ${field.name} ${index + 1}`
        
      case 'boolean':
        return Math.random() > 0.5
        
      case 'email':
        const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'example.com']
        const usernames = ['user', 'test', 'demo', 'sample', 'john', 'jane']
        return `${usernames[Math.floor(Math.random() * usernames.length)]}${index + 1}@${domains[Math.floor(Math.random() * domains.length)]}`
        
      case 'phone':
        return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
        
      case 'date':
        const start = new Date(2020, 0, 1)
        const end = new Date()
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
        return randomDate.toISOString().split('T')[0]
        
      case 'url':
        const sites = ['example.com', 'test.com', 'demo.org', 'sample.net']
        return `https://${sites[Math.floor(Math.random() * sites.length)]}/page${index + 1}`
        
      case 'uuid':
        return crypto.randomUUID ? crypto.randomUUID() : `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
      case 'array':
        const arraySize = Math.floor(Math.random() * 5) + 1
        if (field.name.toLowerCase().includes('tag')) {
          const tags = ['tech', 'design', 'business', 'health', 'travel', 'food', 'sports', 'music']
          return Array.from({ length: arraySize }, () => tags[Math.floor(Math.random() * tags.length)])
        }
        return Array.from({ length: arraySize }, (_, i) => i + 1)
        
      default:
        return `value_${index + 1}`
    }
  }

  const generateData = async () => {
    setIsGenerating(true)
    
    try {
      const data: any[] = []
      
      for (let i = 0; i < recordCount; i++) {
        const record: any = {}
        
        schema.forEach(field => {
          record[field.name] = generateValue(field, i)
        })
        
        data.push(record)
        
        // Add small delay for animation
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }
      
      const result: GeneratedData = {
        data,
        schema: [...schema],
        timestamp: new Date(),
        count: recordCount
      }
      
      setGeneratedData(result)
    } catch (error) {
      console.error('Error generating data:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addField = () => {
    if (!newFieldName.trim()) return
    
    const newField: DataField = {
      id: Date.now().toString(),
      name: newFieldName.trim(),
      type: newFieldType
    }
    
    setSchema(prev => [...prev, newField])
    setNewFieldName('')
  }

  const removeField = (id: string) => {
    setSchema(prev => prev.filter(field => field.id !== id))
  }

  const updateField = (id: string, updates: Partial<DataField>) => {
    setSchema(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const loadPreset = (presetKey: keyof typeof presetSchemas) => {
    setSchema(presetSchemas[presetKey])
  }

  const copyJson = () => {
    if (!generatedData) return
    const jsonString = JSON.stringify(generatedData.data, null, 2)
    navigator.clipboard.writeText(jsonString)
  }

  const downloadJson = () => {
    if (!generatedData) return
    
    const jsonString = JSON.stringify(generatedData.data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `generated-data-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const copySchema = () => {
    const schemaString = JSON.stringify(schema, null, 2)
    navigator.clipboard.writeText(schemaString)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">JSON Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate realistic JSON data for testing, development, and prototyping. Create custom schemas or use presets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：Schema配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Code className="h-5 w-5" />
                  Data Schema
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Define the structure of your JSON data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 预设Schema */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('users')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                    >
                      <Users className="h-3 w-3 mr-2" />
                      User Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('products')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                    >
                      <ShoppingCart className="h-3 w-3 mr-2" />
                      Product Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('posts')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                    >
                      <Database className="h-3 w-3 mr-2" />
                      Blog Posts
                    </Button>
                  </div>
                </div>

                {/* 添加字段 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Add Field</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Field name"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="flex-1 bg-white/10 border-white/20 text-white"
                    />
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as DataField['type'])}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value} className="bg-slate-800">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={addField}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                  >
                    Add Field
                  </Button>
                </div>

                {/* 当前Schema */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Current Schema ({schema.length} fields)</Label>
                    <Button
                      onClick={copySchema}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {schema.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 p-2 bg-white/5 border border-white/20 rounded"
                      >
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          className="flex-1 bg-white/10 border-white/20 text-white text-sm"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value as DataField['type'] })}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs"
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value} className="bg-slate-800">
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          onClick={() => removeField(field.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 生成设置 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Record Count</Label>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    value={recordCount}
                    onChange={(e) => setRecordCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 10)))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <Button
                  onClick={generateData}
                  disabled={isGenerating || schema.length === 0}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Generate JSON
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的数据 */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated JSON Data</CardTitle>
                    <CardDescription className="text-slate-300">
                      {generatedData ? `${generatedData.count} records generated` : 'No data generated yet'}
                    </CardDescription>
                  </div>
                  {generatedData && (
                    <div className="flex gap-2">
                      <Button
                        onClick={copyJson}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadJson}
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
                {generatedData ? (
                  <div className="space-y-4">
                    <div className="bg-slate-900 border border-white/20 rounded-lg p-4 max-h-96 overflow-auto">
                      <pre className="text-sm text-white whitespace-pre-wrap">
                        {JSON.stringify(generatedData.data, null, 2)}
                      </pre>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-slate-400 text-sm">Records</div>
                        <div className="text-white font-bold text-lg">{generatedData.count}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-slate-400 text-sm">Fields</div>
                        <div className="text-white font-bold text-lg">{generatedData.schema.length}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-slate-400 text-sm">Size</div>
                        <div className="text-white font-bold text-lg">
                          {(JSON.stringify(generatedData.data).length / 1024).toFixed(1)}KB
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-slate-400 text-sm">Generated</div>
                        <div className="text-white font-bold text-sm">
                          {generatedData.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ready to generate JSON data?</p>
                    <p>Configure your schema and click "Generate JSON"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 字段类型说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Field Types Reference</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fieldTypes.map(type => (
                    <div key={type.value} className="space-y-1">
                      <h4 className="font-medium text-white">{type.label}</h4>
                      <p className="text-sm text-slate-400">Example: {type.example}</p>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>API testing</li>
                      <li>Database seeding</li>
                      <li>Frontend prototyping</li>
                      <li>Mock data generation</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Unit testing</li>
                      <li>Performance testing</li>
                      <li>Demo applications</li>
                      <li>Development workflows</li>
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