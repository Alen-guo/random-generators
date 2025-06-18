"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Shuffle, Download } from 'lucide-react'

export default function CSVPage() {
  const [rows, setRows] = useState(10)
  const [columns, setColumns] = useState('Name,Email,Age,City')
  const [csvData, setCsvData] = useState('')

  const generateCSV = () => {
    const headers = columns.split(',').map(h => h.trim())
    const sampleData = {
      Name: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'],
      Email: ['john@email.com', 'jane@email.com', 'bob@email.com', 'alice@email.com', 'charlie@email.com'],
      Age: Array.from({length: 50}, (_, i) => 18 + i),
      City: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
      Company: ['TechCorp', 'DataInc', 'WebSoft', 'CloudTech', 'AppDev'],
      Department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
    }

    let csv = headers.join(',') + '\n'
    
    for (let i = 0; i < rows; i++) {
      const row = headers.map(header => {
        const key = header as keyof typeof sampleData
        if (sampleData[key]) {
          const values = sampleData[key]
          return values[Math.floor(Math.random() * values.length)]
        }
        return `Sample${i + 1}`
      })
      csv += row.join(',') + '\n'
    }
    
    setCsvData(csv)
  }

  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-data.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">CSV Generator</h1>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            Generate random CSV data for testing and development purposes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" />
                CSV Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rows" className="text-white">Number of Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    min="1"
                    max="1000"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="columns" className="text-white">Column Headers (comma-separated)</Label>
                  <Input
                    id="columns"
                    value={columns}
                    onChange={(e) => setColumns(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button onClick={generateCSV} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Shuffle className="h-4 w-4 mr-2" />
                Generate CSV Data
              </Button>
            </CardContent>
          </Card>

          {csvData && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Generated CSV Data</CardTitle>
                  <Button
                    onClick={downloadCSV}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={csvData}
                  readOnly
                  className="bg-white/10 border-white/20 text-white font-mono text-sm min-h-[300px]"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 