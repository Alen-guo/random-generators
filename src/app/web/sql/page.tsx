"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Database, Shuffle, Copy, RefreshCw } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

export default function SQLPage() {
  const containerRef = useTranslationProtection()
  const [tableName, setTableName] = useState('users')
  const [rows, setRows] = useState(10)
  const [sqlData, setSqlData] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSQL = async () => {
    setIsGenerating(true)
    
    // 添加延迟以显示加载状态
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']
    const emails = ['john@email.com', 'jane@email.com', 'bob@email.com', 'alice@email.com', 'charlie@email.com']
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
    
    let sql = `-- Generated SQL INSERT statements for ${tableName}\n\n`
    sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`
    sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`
    sql += `  name VARCHAR(100),\n`
    sql += `  email VARCHAR(100),\n`
    sql += `  age INT,\n`
    sql += `  city VARCHAR(50),\n`
    sql += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`
    sql += `);\n\n`
    
    for (let i = 1; i <= rows; i++) {
      const name = names[Math.floor(Math.random() * names.length)]
      const email = emails[Math.floor(Math.random() * emails.length)]
      const age = Math.floor(Math.random() * 50) + 18
      const city = cities[Math.floor(Math.random() * cities.length)]
      
      sql += `INSERT INTO ${tableName} (name, email, age, city) VALUES ('${name}', '${email}', ${age}, '${city}');\n`
    }
    
    setSqlData(sql)
    setIsGenerating(false)
  }

  const copySQL = () => {
    navigator.clipboard.writeText(sqlData)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">SQL Generator</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Generate SQL INSERT statements with random test data for database development.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-slate-400" />
                SQL Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tableName" className="text-white">Table Name</Label>
                  <Input
                    id="tableName"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rows" className="text-white">Number of Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    min="1"
                    max="100"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={generateSQL} 
                disabled={isGenerating}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white notranslate"
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
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate SQL
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {sqlData && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Generated SQL</CardTitle>
                  <Button
                    onClick={copySQL}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={sqlData}
                  readOnly
                  className="bg-white/10 border-white/20 text-white font-mono text-sm min-h-[400px]"
                  data-result="true"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 