"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Database, RefreshCw, Copy, Download, Server, Code, FileText, Layers } from 'lucide-react'

interface APIConfig {
  dataType: 'users' | 'products' | 'posts' | 'orders' | 'comments' | 'custom'
  format: 'json' | 'xml' | 'graphql' | 'rest'
  count: number
  includeMetadata: boolean
  includeRelations: boolean
  nested: boolean
  responseFormat: 'array' | 'paginated' | 'single'
}

interface GeneratedAPI {
  name: string
  type: string
  format: string
  data: any
  endpoint: string
  method: string
  timestamp: Date
  id: string
}

export default function APIPage() {
  const [config, setConfig] = useState<APIConfig>({
    dataType: 'users',
    format: 'json',
    count: 10,
    includeMetadata: true,
    includeRelations: false,
    nested: false,
    responseFormat: 'array'
  })
  const [generatedAPIs, setGeneratedAPIs] = useState<GeneratedAPI[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const dataTypes = [
    { 
      key: 'users', 
      name: 'Users', 
      description: 'User profiles and accounts',
      fields: ['id', 'name', 'email', 'avatar', 'created_at'],
      icon: '👤'
    },
    { 
      key: 'products', 
      name: 'Products', 
      description: 'E-commerce product data',
      fields: ['id', 'name', 'price', 'category', 'stock'],
      icon: '🛍️'
    },
    { 
      key: 'posts', 
      name: 'Posts', 
      description: 'Blog posts and articles',
      fields: ['id', 'title', 'content', 'author', 'published'],
      icon: '📝'
    },
    { 
      key: 'orders', 
      name: 'Orders', 
      description: 'Purchase orders and transactions',
      fields: ['id', 'total', 'status', 'customer', 'items'],
      icon: '🛒'
    },
    { 
      key: 'comments', 
      name: 'Comments', 
      description: 'User comments and reviews',
      fields: ['id', 'text', 'rating', 'user', 'post_id'],
      icon: '💬'
    },
    { 
      key: 'custom', 
      name: 'Custom', 
      description: 'Generic data structure',
      fields: ['id', 'name', 'value', 'type', 'metadata'],
      icon: '🔧'
    }
  ]

  const responseFormats = [
    { key: 'array', name: 'Array', description: 'Simple array of objects' },
    { key: 'paginated', name: 'Paginated', description: 'Paginated response with metadata' },
    { key: 'single', name: 'Single', description: 'Single object response' }
  ]

  const outputFormats = [
    { key: 'json', name: 'JSON', description: 'Standard JSON format' },
    { key: 'xml', name: 'XML', description: 'XML format' },
    { key: 'graphql', name: 'GraphQL', description: 'GraphQL query/response' },
    { key: 'rest', name: 'REST', description: 'Full REST API specification' }
  ]

  // Sample data generators
  const generateUser = (id: number) => ({
    id,
    name: generateName(),
    email: generateEmail(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    age: Math.floor(Math.random() * 50) + 18,
    address: generateAddress(),
    phone: generatePhone(),
    company: generateCompany(),
    website: `https://${generateName().toLowerCase().replace(' ', '')}.com`,
    bio: generateBio(),
    created_at: generateDate(),
    updated_at: new Date().toISOString(),
    is_active: Math.random() > 0.2,
    role: ['admin', 'user', 'moderator'][Math.floor(Math.random() * 3)]
  })

  const generateProduct = (id: number) => ({
    id,
    name: generateProductName(),
    description: generateProductDescription(),
    price: Math.round((Math.random() * 1000 + 10) * 100) / 100,
    category: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'][Math.floor(Math.random() * 5)],
    brand: generateBrand(),
    sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    stock: Math.floor(Math.random() * 1000),
    rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
    reviews: Math.floor(Math.random() * 500),
    tags: generateTags(),
    images: Array.from({length: Math.floor(Math.random() * 5) + 1}, (_, i) => 
      `https://picsum.photos/400/400?random=${id + i}`
    ),
    weight: Math.round((Math.random() * 5 + 0.1) * 100) / 100,
    dimensions: {
      length: Math.round(Math.random() * 50 + 5),
      width: Math.round(Math.random() * 50 + 5),
      height: Math.round(Math.random() * 50 + 5)
    },
    created_at: generateDate(),
    is_featured: Math.random() > 0.8
  })

  const generatePost = (id: number) => ({
    id,
    title: generatePostTitle(),
    slug: generateSlug(),
    content: generateContent(),
    excerpt: generateExcerpt(),
    author: {
      id: Math.floor(Math.random() * 100) + 1,
      name: generateName(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id * 10}`
    },
    category: ['Technology', 'Lifestyle', 'Business', 'Travel', 'Food'][Math.floor(Math.random() * 5)],
    tags: generateTags(),
    status: ['published', 'draft', 'archived'][Math.floor(Math.random() * 3)],
    featured_image: `https://picsum.photos/800/400?random=${id}`,
    view_count: Math.floor(Math.random() * 10000),
    like_count: Math.floor(Math.random() * 1000),
    comment_count: Math.floor(Math.random() * 100),
    published_at: generateDate(),
    created_at: generateDate(),
    updated_at: new Date().toISOString(),
    meta: {
      seo_title: generatePostTitle(),
      seo_description: generateExcerpt(),
      reading_time: Math.floor(Math.random() * 15) + 2
    }
  })

  const generateOrder = (id: number) => ({
    id,
    order_number: `ORD-${Date.now()}-${id}`,
    customer: {
      id: Math.floor(Math.random() * 1000) + 1,
      name: generateName(),
      email: generateEmail()
    },
    items: Array.from({length: Math.floor(Math.random() * 5) + 1}, (_, i) => ({
      id: i + 1,
      product_id: Math.floor(Math.random() * 100) + 1,
      name: generateProductName(),
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.round((Math.random() * 100 + 10) * 100) / 100
    })),
    subtotal: 0, // Will be calculated
    tax: 0,
    shipping: Math.round(Math.random() * 20 + 5),
    total: 0, // Will be calculated
    status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
    payment_method: ['credit_card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
    shipping_address: generateAddress(),
    billing_address: generateAddress(),
    tracking_number: Math.random() > 0.5 ? `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}` : null,
    created_at: generateDate(),
    updated_at: new Date().toISOString()
  })

  const generateComment = (id: number) => ({
    id,
    content: generateCommentText(),
    rating: Math.floor(Math.random() * 5) + 1,
    author: {
      id: Math.floor(Math.random() * 100) + 1,
      name: generateName(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id * 5}`
    },
    post_id: Math.floor(Math.random() * 50) + 1,
    parent_id: Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : null,
    likes: Math.floor(Math.random() * 50),
    is_approved: Math.random() > 0.1,
    is_spam: Math.random() < 0.05,
    created_at: generateDate(),
    updated_at: new Date().toISOString()
  })

  // Helper generators
  const generateName = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Emily', 'Robert', 'Ashley']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
  }

  const generateEmail = () => {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com']
    const name = generateName().toLowerCase().replace(' ', '.')
    return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`
  }

  const generateAddress = () => ({
    street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'First'][Math.floor(Math.random() * 5)]} St`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
    state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
    zip: Math.floor(Math.random() * 90000) + 10000,
    country: 'USA'
  })

  const generatePhone = () => {
    return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
  }

  const generateCompany = () => {
    const companies = ['Tech Corp', 'Innovation Inc', 'Digital Solutions', 'Future Systems', 'Global Enterprises']
    return companies[Math.floor(Math.random() * companies.length)]
  }

  const generateBio = () => {
    const bios = [
      'Software developer passionate about creating amazing user experiences.',
      'Marketing professional with expertise in digital campaigns.',
      'Designer focused on creating beautiful and functional interfaces.',
      'Entrepreneur building the next generation of web applications.',
      'Data scientist turning insights into actionable business strategies.'
    ]
    return bios[Math.floor(Math.random() * bios.length)]
  }

  const generateDate = () => {
    const start = new Date(2020, 0, 1)
    const end = new Date()
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
  }

  const generateProductName = () => {
    const adjectives = ['Amazing', 'Premium', 'Professional', 'Advanced', 'Smart']
    const nouns = ['Widget', 'Device', 'Tool', 'Gadget', 'System']
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`
  }

  const generateProductDescription = () => {
    const descriptions = [
      'High-quality product designed for modern professionals.',
      'Innovative solution that meets all your daily needs.',
      'Premium quality with exceptional performance and durability.',
      'State-of-the-art technology in a sleek design.',
      'Perfect balance of functionality and style.'
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const generateBrand = () => {
    const brands = ['TechBrand', 'InnovateCorp', 'QualityMakers', 'PremiumLine', 'SmartChoice']
    return brands[Math.floor(Math.random() * brands.length)]
  }

  const generateTags = () => {
    const allTags = ['new', 'featured', 'popular', 'sale', 'trending', 'premium', 'limited', 'bestseller']
    const count = Math.floor(Math.random() * 4) + 1
    return Array.from({length: count}, () => allTags[Math.floor(Math.random() * allTags.length)])
      .filter((tag, index, arr) => arr.indexOf(tag) === index)
  }

  const generatePostTitle = () => {
    const titles = [
      'The Future of Web Development',
      'Building Scalable Applications',
      'Design Principles for Modern UIs',
      'Optimizing Performance in React',
      'Best Practices for API Design'
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  const generateSlug = () => {
    return generatePostTitle().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  }

  const generateContent = () => {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  }

  const generateExcerpt = () => {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }

  const generateCommentText = () => {
    const comments = [
      'Great article! Really helpful information.',
      'Thanks for sharing this. Very insightful.',
      'I learned a lot from this post.',
      'Excellent explanation of the concepts.',
      'Looking forward to more content like this.'
    ]
    return comments[Math.floor(Math.random() * comments.length)]
  }

  const generateData = (type: string, count: number) => {
    switch (type) {
      case 'users':
        return Array.from({length: count}, (_, i) => generateUser(i + 1))
      case 'products':
        return Array.from({length: count}, (_, i) => generateProduct(i + 1))
      case 'posts':
        return Array.from({length: count}, (_, i) => generatePost(i + 1))
      case 'orders':
        return Array.from({length: count}, (_, i) => {
          const order = generateOrder(i + 1)
          // Calculate totals
          order.subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
          order.tax = Math.round(order.subtotal * 0.08 * 100) / 100
          order.total = Math.round((order.subtotal + order.tax + order.shipping) * 100) / 100
          return order
        })
      case 'comments':
        return Array.from({length: count}, (_, i) => generateComment(i + 1))
      default:
        return Array.from({length: count}, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          type: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
          metadata: {
            created_at: generateDate(),
            is_active: Math.random() > 0.2
          }
        }))
    }
  }

  const formatResponse = (data: any[], format: string, responseFormat: string) => {
    let response: any

    // Format response structure
    switch (responseFormat) {
      case 'single':
        response = data[0] || null
        break
      case 'paginated':
        response = {
          data: data,
          pagination: {
            page: 1,
            per_page: config.count,
            total: data.length * 3, // Simulate more data
            total_pages: 3,
            has_next: true,
            has_prev: false
          },
          meta: {
            timestamp: new Date().toISOString(),
            api_version: '1.0.0'
          }
        }
        break
      default: // array
        response = data
    }

    // Add metadata if requested
    if (config.includeMetadata && responseFormat === 'array') {
      response = {
        data: response,
        meta: {
          count: data.length,
          timestamp: new Date().toISOString(),
          api_version: '1.0.0'
        }
      }
    }

    // Format output
    switch (format) {
      case 'xml':
        return convertToXML(response)
      case 'graphql':
        return generateGraphQL(config.dataType, data)
      case 'rest':
        return generateRESTSpec(config.dataType, data)
      default:
        return JSON.stringify(response, null, 2)
    }
  }

  const convertToXML = (obj: any): string => {
    const xmlify = (obj: any, indent = 0): string => {
      const spaces = '  '.repeat(indent)
      if (Array.isArray(obj)) {
        return obj.map(item => `${spaces}<item>\n${xmlify(item, indent + 1)}\n${spaces}</item>`).join('\n')
      } else if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return `${spaces}<${key}>\n${xmlify(value, indent + 1)}\n${spaces}</${key}>`
          } else {
            return `${spaces}<${key}>${value}</${key}>`
          }
        }).join('\n')
      } else {
        return String(obj)
      }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${xmlify(obj, 1)}\n</root>`
  }

  const generateGraphQL = (type: string, data: any[]): string => {
    const sampleItem = data[0] || {}
    const fields = Object.keys(sampleItem).slice(0, 5) // Limit fields for readability
    
    return `# GraphQL Query
query Get${type.charAt(0).toUpperCase() + type.slice(1)} {
  ${type} {
    ${fields.join('\n    ')}
  }
}

# Sample Response
{
  "data": {
    "${type}": ${JSON.stringify(data.slice(0, 3), null, 4)}
  }
}`
  }

  const generateRESTSpec = (type: string, data: any[]): string => {
    const endpoint = `/api/v1/${type}`
    return `# REST API Specification

## Endpoint: ${endpoint}
**Method:** GET
**Description:** Retrieve ${type} data

### Query Parameters:
- \`page\` (optional): Page number (default: 1)
- \`limit\` (optional): Items per page (default: 10)
- \`sort\` (optional): Sort field
- \`order\` (optional): Sort order (asc/desc)

### Response Format:
\`\`\`json
${JSON.stringify(data.slice(0, 2), null, 2)}
\`\`\`

### HTTP Status Codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error`
  }

  const generateAPI = async () => {
    setIsGenerating(true)
    
    try {
      const actualCount = config.responseFormat === 'single' ? 1 : config.count
      const rawData = generateData(config.dataType, actualCount)
      const formattedData = formatResponse(rawData, config.format, config.responseFormat)
      
      const api: GeneratedAPI = {
        name: `${config.dataType.charAt(0).toUpperCase() + config.dataType.slice(1)} API`,
        type: config.dataType,
        format: config.format,
        data: formattedData,
        endpoint: `/api/v1/${config.dataType}`,
        method: 'GET',
        timestamp: new Date(),
        id: `api_${Date.now()}`
      }
      
      setGeneratedAPIs([api, ...generatedAPIs.slice(0, 4)]) // Keep only last 5 APIs
      
    } catch (error) {
      console.error('Error generating API:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyAPI = (api: GeneratedAPI) => {
    navigator.clipboard.writeText(api.data)
  }

  const downloadAPI = (api: GeneratedAPI) => {
    const extension = config.format === 'xml' ? 'xml' : 
                    config.format === 'graphql' ? 'graphql' : 
                    config.format === 'rest' ? 'md' : 'json'
    
    const blob = new Blob([api.data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${api.name.replace(/[^a-zA-Z0-9]/g, '-')}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'rest_api' | 'graphql_api' | 'mock_data' | 'documentation') => {
    switch (preset) {
      case 'rest_api':
        setConfig(prev => ({
          ...prev,
          format: 'json',
          responseFormat: 'paginated',
          includeMetadata: true,
          count: 10
        }))
        break
      case 'graphql_api':
        setConfig(prev => ({
          ...prev,
          format: 'graphql',
          responseFormat: 'array',
          includeRelations: true,
          count: 5
        }))
        break
      case 'mock_data':
        setConfig(prev => ({
          ...prev,
          format: 'json',
          responseFormat: 'array',
          includeMetadata: false,
          count: 20
        }))
        break
      case 'documentation':
        setConfig(prev => ({
          ...prev,
          format: 'rest',
          responseFormat: 'single',
          includeMetadata: true,
          count: 1
        }))
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">API Data Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate realistic API responses, mock data, and documentation. Perfect for testing, prototyping, and development workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：API配置 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Server className="h-5 w-5" />
                  API Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure API data generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 数据类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Data Type</Label>
                  <div className="space-y-2">
                    {dataTypes.map(type => (
                      <button
                        key={type.key}
                        onClick={() => setConfig(prev => ({ ...prev, dataType: type.key as any }))}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.dataType === type.key
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
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
                          Fields: {type.fields.join(', ')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 输出格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Format</Label>
                  <select
                    value={config.format}
                    onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    {outputFormats.map(format => (
                      <option key={format.key} value={format.key} className="bg-slate-800">
                        {format.name} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 响应格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Response Format</Label>
                  <select
                    value={config.responseFormat}
                    onChange={(e) => setConfig(prev => ({ ...prev, responseFormat: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    {responseFormats.map(format => (
                      <option key={format.key} value={format.key} className="bg-slate-800">
                        {format.name} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 记录数量 */}
                {config.responseFormat !== 'single' && (
                  <div className="space-y-2">
                    <Label className="text-slate-300">Number of Records</Label>
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
                )}

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeMetadata}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include metadata</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeRelations}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeRelations: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include relations</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.nested}
                        onChange={(e) => setConfig(prev => ({ ...prev, nested: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Nested objects</span>
                    </label>
                  </div>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('rest_api')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Server className="h-3 w-3 mr-1" />
                      REST API
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('graphql_api')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Layers className="h-3 w-3 mr-1" />
                      GraphQL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('mock_data')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Database className="h-3 w-3 mr-1" />
                      Mock Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('documentation')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Docs
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateAPI}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Generate API
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的API */}
          <div className="lg:col-span-2 space-y-6">
            {generatedAPIs.length > 0 ? (
              generatedAPIs.map((api, index) => (
                <Card key={api.id} className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Database className="h-5 w-5 text-cyan-400" />
                          {api.name}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {api.method} {api.endpoint} • {api.format.toUpperCase()} format
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyAPI(api)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadAPI(api)}
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
                    <div className="bg-slate-900 border border-white/20 rounded p-4 mb-4">
                      <pre className="text-sm text-white whitespace-pre-wrap overflow-x-auto max-h-96">
                        {api.data}
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Generated {api.timestamp.toLocaleString()}</span>
                      <span>API #{index + 1}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate API data?</p>
                  <p>Configure your settings and click "Generate API"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">API Data Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Data Types</h4>
                    <p className="text-sm">Choose from predefined data models like users, products, posts, orders, comments, or create custom structures.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Output Formats</h4>
                    <p className="text-sm">Generate JSON, XML, GraphQL queries, or full REST API documentation with realistic sample data.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Response Structures</h4>
                    <p className="text-sm">Configure array responses, paginated results, or single object responses with optional metadata.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>API prototyping</li>
                      <li>Frontend development</li>
                      <li>Testing scenarios</li>
                      <li>Mock servers</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Documentation examples</li>
                      <li>Database seeding</li>
                      <li>Demo applications</li>
                      <li>Integration testing</li>
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