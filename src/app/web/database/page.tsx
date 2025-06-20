"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Database, RefreshCw, Copy, Download, Plus, Trash2, Settings, Table } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface FieldConfig {
  id: string
  name: string
  type: string
  options: any
  nullable: boolean
}

interface TableConfig {
  tableName: string
  fields: FieldConfig[]
  recordCount: number
  format: 'sql' | 'json' | 'csv' | 'xml'
  database: 'mysql' | 'postgresql' | 'sqlite' | 'mongodb'
}

interface GeneratedData {
  id: string
  tableName: string
  format: string
  database: string
  data: string
  recordCount: number
  timestamp: Date
  size: string
}

export default function DatabasePage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<TableConfig>({
    tableName: 'users',
    fields: [
      { id: '1', name: 'id', type: 'auto_increment', options: {}, nullable: false },
      { id: '2', name: 'name', type: 'name', options: {}, nullable: false },
      { id: '3', name: 'email', type: 'email', options: {}, nullable: false },
      { id: '4', name: 'created_at', type: 'datetime', options: {}, nullable: false }
    ],
    recordCount: 100,
    format: 'sql',
    database: 'mysql'
  })
  
  const [generatedData, setGeneratedData] = useState<GeneratedData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const fieldTypes = [
    { key: 'auto_increment', name: 'Auto Increment', description: 'Sequential numbers starting from 1' },
    { key: 'uuid', name: 'UUID', description: 'Universally unique identifier' },
    { key: 'name', name: 'Full Name', description: 'Random full names' },
    { key: 'first_name', name: 'First Name', description: 'Random first names' },
    { key: 'last_name', name: 'Last Name', description: 'Random last names' },
    { key: 'email', name: 'Email', description: 'Random email addresses' },
    { key: 'phone', name: 'Phone', description: 'Random phone numbers' },
    { key: 'address', name: 'Address', description: 'Random street addresses' },
    { key: 'city', name: 'City', description: 'Random city names' },
    { key: 'country', name: 'Country', description: 'Random country names' },
    { key: 'company', name: 'Company', description: 'Random company names' },
    { key: 'job_title', name: 'Job Title', description: 'Random job titles' },
    { key: 'text', name: 'Text', description: 'Random text content' },
    { key: 'paragraph', name: 'Paragraph', description: 'Random paragraphs' },
    { key: 'number', name: 'Number', description: 'Random numbers' },
    { key: 'decimal', name: 'Decimal', description: 'Random decimal numbers' },
    { key: 'boolean', name: 'Boolean', description: 'True/false values' },
    { key: 'date', name: 'Date', description: 'Random dates' },
    { key: 'datetime', name: 'DateTime', description: 'Random date and time' },
    { key: 'timestamp', name: 'Timestamp', description: 'Unix timestamps' },
    { key: 'url', name: 'URL', description: 'Random URLs' },
    { key: 'image_url', name: 'Image URL', description: 'Random image URLs' },
    { key: 'color', name: 'Color', description: 'Random color values' },
    { key: 'ip_address', name: 'IP Address', description: 'Random IP addresses' },
    { key: 'mac_address', name: 'MAC Address', description: 'Random MAC addresses' },
    { key: 'credit_card', name: 'Credit Card', description: 'Random credit card numbers' },
    { key: 'currency', name: 'Currency', description: 'Random currency amounts' },
    { key: 'custom', name: 'Custom List', description: 'Choose from custom values' }
  ]

  // 数据生成器
  const dataGenerators = {
    auto_increment: (index: number) => index + 1,
    uuid: () => `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`,
    name: () => {
      const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Tom', 'Anna', 'Mark', 'Emma', 'Alex', 'Sophia', 'Ryan', 'Olivia']
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas']
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
    },
    first_name: () => {
      const names = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Tom', 'Anna', 'Mark', 'Emma', 'Alex', 'Sophia', 'Ryan', 'Olivia']
      return names[Math.floor(Math.random() * names.length)]
    },
    last_name: () => {
      const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
      return names[Math.floor(Math.random() * names.length)]
    },
    email: () => {
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'example.org']
      const username = Math.random().toString(36).substr(2, 8)
      return `${username}@${domains[Math.floor(Math.random() * domains.length)]}`
    },
    phone: () => {
      const areaCode = Math.floor(Math.random() * 900) + 100
      const exchange = Math.floor(Math.random() * 900) + 100
      const number = Math.floor(Math.random() * 9000) + 1000
      return `(${areaCode}) ${exchange}-${number}`
    },
    address: () => {
      const numbers = Math.floor(Math.random() * 9999) + 1
      const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Cedar Ln', 'Maple Way', 'First St', 'Second Ave']
      return `${numbers} ${streets[Math.floor(Math.random() * streets.length)]}`
    },
    city: () => {
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
      return cities[Math.floor(Math.random() * cities.length)]
    },
    country: () => {
      const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Brazil', 'India', 'China']
      return countries[Math.floor(Math.random() * countries.length)]
    },
    company: () => {
      const prefixes = ['Tech', 'Global', 'Smart', 'Digital', 'Advanced', 'Modern', 'Future', 'Elite']
      const suffixes = ['Solutions', 'Systems', 'Corp', 'Inc', 'Industries', 'Group', 'Enterprises', 'Technologies']
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
    },
    job_title: () => {
      const titles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer', 'Marketing Manager', 'Sales Representative', 'Analyst', 'Developer', 'Consultant', 'Specialist']
      return titles[Math.floor(Math.random() * titles.length)]
    },
    text: () => {
      const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore']
      const length = Math.floor(Math.random() * 10) + 5
      return Array.from({length}, () => words[Math.floor(Math.random() * words.length)]).join(' ')
    },
    paragraph: () => {
      const sentences = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse.'
      ]
      const count = Math.floor(Math.random() * 3) + 2
      return Array.from({length: count}, () => sentences[Math.floor(Math.random() * sentences.length)]).join(' ')
    },
    number: () => Math.floor(Math.random() * 10000),
    decimal: () => (Math.random() * 1000).toFixed(2),
    boolean: () => Math.random() > 0.5,
    date: () => {
      const start = new Date(2020, 0, 1)
      const end = new Date()
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      return randomDate.toISOString().split('T')[0]
    },
    datetime: () => {
      const start = new Date(2020, 0, 1)
      const end = new Date()
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      return randomDate.toISOString().replace('T', ' ').split('.')[0]
    },
    timestamp: () => Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 31536000),
    url: () => {
      const protocols = ['https']
      const domains = ['example.com', 'test.org', 'demo.net', 'sample.io']
      const paths = ['', '/page', '/about', '/contact', '/products', '/services']
      return `${protocols[0]}://www.${domains[Math.floor(Math.random() * domains.length)]}${paths[Math.floor(Math.random() * paths.length)]}`
    },
    image_url: () => {
      const width = [200, 300, 400, 500][Math.floor(Math.random() * 4)]
      const height = [200, 300, 400, 500][Math.floor(Math.random() * 4)]
      return `https://picsum.photos/${width}/${height}`
    },
    color: () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
    ip_address: () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    mac_address: () => Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':'),
    credit_card: () => {
      const prefixes = ['4', '5', '3']
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      let card = prefix
      for (let i = 1; i < 16; i++) {
        card += Math.floor(Math.random() * 10)
      }
      return card.match(/.{1,4}/g)?.join('-') || card
    },
    currency: () => `$${(Math.random() * 10000).toFixed(2)}`,
    custom: (index: number, options: any) => {
      if (options.values && options.values.length > 0) {
        return options.values[Math.floor(Math.random() * options.values.length)]
      }
      return 'Custom Value'
    }
  }

  const generateData = async () => {
    setIsGenerating(true)
    
    try {
      const records = []
      
      // 生成记录
      for (let i = 0; i < config.recordCount; i++) {
        const record: any = {}
        
        for (const field of config.fields) {
          if (field.nullable && Math.random() < 0.1) {
            record[field.name] = null
          } else {
            const generator = dataGenerators[field.type as keyof typeof dataGenerators]
            if (generator) {
              record[field.name] = generator(i, field.options)
            } else {
              record[field.name] = 'Unknown'
            }
          }
        }
        
        records.push(record)
      }
      
      // 格式化输出
      let formattedData = ''
      let size = ''
      
      switch (config.format) {
        case 'sql':
          formattedData = generateSQL(records)
          break
        case 'json':
          formattedData = JSON.stringify(records, null, 2)
          break
        case 'csv':
          formattedData = generateCSV(records)
          break
        case 'xml':
          formattedData = generateXML(records)
          break
      }
      
      size = `${(new Blob([formattedData]).size / 1024).toFixed(1)} KB`
      
      const generated: GeneratedData = {
        id: `data_${Date.now()}`,
        tableName: config.tableName,
        format: config.format,
        database: config.database,
        data: formattedData,
        recordCount: config.recordCount,
        timestamp: new Date(),
        size
      }
      
      setGeneratedData([generated, ...generatedData.slice(0, 4)]) // Keep last 5
      
    } catch (error) {
      console.error('Error generating data:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSQL = (records: any[]) => {
    if (records.length === 0) return ''
    
    const fields = config.fields.map(f => f.name)
    let sql = ''
    
    // CREATE TABLE statement
    if (config.database !== 'mongodb') {
      sql += `-- ${config.database.toUpperCase()} Table Structure\n`
      sql += `CREATE TABLE ${config.tableName} (\n`
      
      const fieldDefinitions = config.fields.map(field => {
        let definition = `  ${field.name}`
        
        switch (field.type) {
          case 'auto_increment':
            definition += config.database === 'postgresql' ? ' SERIAL PRIMARY KEY' : ' INT AUTO_INCREMENT PRIMARY KEY'
            break
          case 'uuid':
            definition += ' VARCHAR(36)'
            break
          case 'email':
          case 'url':
          case 'name':
            definition += ' VARCHAR(255)'
            break
          case 'text':
          case 'paragraph':
            definition += ' TEXT'
            break
          case 'number':
            definition += ' INT'
            break
          case 'decimal':
          case 'currency':
            definition += ' DECIMAL(10,2)'
            break
          case 'boolean':
            definition += ' BOOLEAN'
            break
          case 'date':
            definition += ' DATE'
            break
          case 'datetime':
            definition += ' DATETIME'
            break
          case 'timestamp':
            definition += ' TIMESTAMP'
            break
          default:
            definition += ' VARCHAR(255)'
        }
        
        if (!field.nullable && field.type !== 'auto_increment') {
          definition += ' NOT NULL'
        }
        
        return definition
      })
      
      sql += fieldDefinitions.join(',\n') + '\n);\n\n'
    }
    
    // INSERT statements
    sql += `-- Sample Data (${records.length} records)\n`
    
    for (let i = 0; i < records.length; i += 100) {
      const batch = records.slice(i, i + 100)
      sql += `INSERT INTO ${config.tableName} (${fields.join(', ')}) VALUES\n`
      
      const values = batch.map(record => {
        const recordValues = fields.map(field => {
          const value = record[field]
          if (value === null) return 'NULL'
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
          if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
          return value
        })
        return `(${recordValues.join(', ')})`
      })
      
      sql += values.join(',\n') + ';\n\n'
    }
    
    return sql
  }

  const generateCSV = (records: any[]) => {
    if (records.length === 0) return ''
    
    const fields = config.fields.map(f => f.name)
    const header = fields.join(',')
    
    const rows = records.map(record => {
      return fields.map(field => {
        const value = record[field]
        if (value === null) return ''
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    })
    
    return [header, ...rows].join('\n')
  }

  const generateXML = (records: any[]) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += `<${config.tableName}>\n`
    
    for (const record of records) {
      xml += '  <record>\n'
      for (const [key, value] of Object.entries(record)) {
        if (value !== null) {
          xml += `    <${key}>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>\n`
        } else {
          xml += `    <${key}></${key}>\n`
        }
      }
      xml += '  </record>\n'
    }
    
    xml += `</${config.tableName}>\n`
    return xml
  }

  const addField = () => {
    const newField: FieldConfig = {
      id: Date.now().toString(),
      name: `field_${config.fields.length + 1}`,
      type: 'text',
      options: {},
      nullable: false
    }
    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    }))
  }

  const removeField = (id: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }))
  }

  const copyData = (data: GeneratedData) => {
    navigator.clipboard.writeText(data.data)
  }

  const downloadData = (data: GeneratedData) => {
    const extension = data.format === 'sql' ? 'sql' : data.format
    const mimeType = {
      sql: 'text/plain',
      json: 'application/json',
      csv: 'text/csv',
      xml: 'application/xml'
    }[data.format] || 'text/plain'
    
    const blob = new Blob([data.data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${data.tableName}_${data.recordCount}_records.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'users' | 'products' | 'orders' | 'logs') => {
    switch (preset) {
      case 'users':
        setConfig({
          tableName: 'users',
          fields: [
            { id: '1', name: 'id', type: 'auto_increment', options: {}, nullable: false },
            { id: '2', name: 'username', type: 'text', options: {}, nullable: false },
            { id: '3', name: 'email', type: 'email', options: {}, nullable: false },
            { id: '4', name: 'first_name', type: 'first_name', options: {}, nullable: false },
            { id: '5', name: 'last_name', type: 'last_name', options: {}, nullable: false },
            { id: '6', name: 'phone', type: 'phone', options: {}, nullable: true },
            { id: '7', name: 'created_at', type: 'datetime', options: {}, nullable: false }
          ],
          recordCount: 100,
          format: 'sql',
          database: 'mysql'
        })
        break
      case 'products':
        setConfig({
          tableName: 'products',
          fields: [
            { id: '1', name: 'id', type: 'auto_increment', options: {}, nullable: false },
            { id: '2', name: 'name', type: 'text', options: {}, nullable: false },
            { id: '3', name: 'description', type: 'paragraph', options: {}, nullable: true },
            { id: '4', name: 'price', type: 'currency', options: {}, nullable: false },
            { id: '5', name: 'category', type: 'text', options: {}, nullable: false },
            { id: '6', name: 'in_stock', type: 'boolean', options: {}, nullable: false },
            { id: '7', name: 'image_url', type: 'image_url', options: {}, nullable: true }
          ],
          recordCount: 50,
          format: 'json',
          database: 'postgresql'
        })
        break
      case 'orders':
        setConfig({
          tableName: 'orders',
          fields: [
            { id: '1', name: 'id', type: 'uuid', options: {}, nullable: false },
            { id: '2', name: 'customer_id', type: 'number', options: {}, nullable: false },
            { id: '3', name: 'total_amount', type: 'currency', options: {}, nullable: false },
            { id: '4', name: 'status', type: 'custom', options: { values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }, nullable: false },
            { id: '5', name: 'order_date', type: 'datetime', options: {}, nullable: false },
            { id: '6', name: 'shipping_address', type: 'address', options: {}, nullable: false }
          ],
          recordCount: 200,
          format: 'csv',
          database: 'mysql'
        })
        break
      case 'logs':
        setConfig({
          tableName: 'access_logs',
          fields: [
            { id: '1', name: 'id', type: 'auto_increment', options: {}, nullable: false },
            { id: '2', name: 'timestamp', type: 'timestamp', options: {}, nullable: false },
            { id: '3', name: 'ip_address', type: 'ip_address', options: {}, nullable: false },
            { id: '4', name: 'user_agent', type: 'text', options: {}, nullable: true },
            { id: '5', name: 'method', type: 'custom', options: { values: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }, nullable: false },
            { id: '6', name: 'url', type: 'url', options: {}, nullable: false },
            { id: '7', name: 'status_code', type: 'custom', options: { values: ['200', '201', '400', '401', '403', '404', '500'] }, nullable: false }
          ],
          recordCount: 1000,
          format: 'json',
          database: 'mongodb'
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
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Database Test Data Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate realistic test data for your databases. Support for SQL, JSON, CSV, XML formats and multiple database systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="h-5 w-5" />
                  Table Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 表名 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Table Name</Label>
                  <Input
                    value={config.tableName}
                    onChange={(e) => setConfig(prev => ({ ...prev, tableName: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter table name"
                  />
                </div>

                {/* 记录数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Number of Records</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={config.recordCount}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      recordCount: Math.max(1, Math.min(10000, parseInt(e.target.value) || 100))
                    }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* 输出格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Format</Label>
                  <select
                    value={config.format}
                    onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="sql" className="bg-slate-800">SQL INSERT Statements</option>
                    <option value="json" className="bg-slate-800">JSON Array</option>
                    <option value="csv" className="bg-slate-800">CSV File</option>
                    <option value="xml" className="bg-slate-800">XML Document</option>
                  </select>
                </div>

                {/* 数据库类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Database System</Label>
                  <select
                    value={config.database}
                    onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="mysql" className="bg-slate-800">MySQL</option>
                    <option value="postgresql" className="bg-slate-800">PostgreSQL</option>
                    <option value="sqlite" className="bg-slate-800">SQLite</option>
                    <option value="mongodb" className="bg-slate-800">MongoDB</option>
                  </select>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('users')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      👥 Users
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('products')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📦 Products
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('orders')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🛒 Orders
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('logs')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📊 Logs
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateData}
                  disabled={isGenerating || config.fields.length === 0}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Data...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Generate Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 字段配置 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Table className="h-5 w-5" />
                    Fields ({config.fields.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {config.fields.map((field, index) => (
                    <div key={field.id} className="p-3 bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          className="bg-transparent border-none text-white text-sm p-0 h-auto font-mono"
                        />
                        <Button
                          onClick={() => removeField(field.id)}
                          disabled={config.fields.length <= 1}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs mb-2"
                      >
                        {fieldTypes.map(type => (
                          <option key={type.key} value={type.key} className="bg-slate-800">
                            {type.name}
                          </option>
                        ))}
                      </select>
                      
                      {showAdvanced && (
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-white">
                            <input
                              type="checkbox"
                              checked={field.nullable}
                              onChange={(e) => updateField(field.id, { nullable: e.target.checked })}
                              className="rounded scale-75"
                            />
                            <span className="text-xs">Nullable</span>
                          </label>
                          
                          {field.type === 'custom' && (
                            <Input
                              placeholder="Values (comma-separated)"
                              onChange={(e) => updateField(field.id, { 
                                options: { ...field.options, values: e.target.value.split(',').map(v => v.trim()) }
                              })}
                              className="bg-white/10 border-white/20 text-white text-xs"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={addField}
                  disabled={config.fields.length >= 20}
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的数据 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedData.length > 0 ? (
              generatedData.map((data, index) => (
                <Card key={data.id} className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Database className="h-5 w-5 text-cyan-400" />
                          {data.tableName}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {data.recordCount} records • {data.format.toUpperCase()} • {data.database} • {data.size}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyData(data)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadData(data)}
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
                    <div className="bg-slate-900 border border-white/20 rounded p-4 max-h-96 overflow-auto">
                      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                        {data.data.length > 10000 ? data.data.substring(0, 10000) + '\n\n... (truncated for display)' : data.data}
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                      <span>Generated {data.timestamp.toLocaleString()}</span>
                      <span>Dataset #{index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate test data?</p>
                  <p>Configure your table structure and click "Generate Data"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Database Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">25+ Data Types</h4>
                    <p className="text-sm">Generate realistic data including names, emails, addresses, UUIDs, timestamps, and custom values.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Multiple Formats</h4>
                    <p className="text-sm">Export as SQL INSERT statements, JSON arrays, CSV files, or XML documents for different use cases.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Database Support</h4>
                    <p className="text-sm">Optimized output for MySQL, PostgreSQL, SQLite, and MongoDB with appropriate data types and syntax.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Database testing</li>
                      <li>Application development</li>
                      <li>Performance testing</li>
                      <li>Data migration</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Prototype data</li>
                      <li>Demo environments</li>
                      <li>Load testing</li>
                      <li>Training datasets</li>
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