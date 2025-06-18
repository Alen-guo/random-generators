"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Dices,
  Hash,
  Type,
  Palette,
  Shuffle,
  Quote,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Crown,
  Gamepad2,
  Music,
  Image,
  Lock,
  Globe,
  CreditCard,
  Users,
  Star,
  Heart,
  Zap,
  Search
} from 'lucide-react'

interface RandomTool {
  id: string
  title: string
  description: string
  icon: any
  gradient: string
  category: string
  isPopular?: boolean
  isFree?: boolean
}

const randomTools: RandomTool[] = [
  {
    id: 'number',
    title: 'Random Number Generator',
    description: 'Generate random numbers with customizable range and options',
    icon: Dices,
    gradient: 'from-blue-500 to-purple-500',
    category: 'Numbers',
    isPopular: true,
    isFree: true
  },
  {
    id: 'password',
    title: 'Password Generator',
    description: 'Create secure passwords with custom complexity settings',
    icon: Hash,
    gradient: 'from-green-500 to-emerald-500',
    category: 'Security',
    isPopular: true,
    isFree: true
  },
  {
    id: 'name',
    title: 'Name Generator',
    description: 'Generate random names from different cultures and regions',
    icon: Type,
    gradient: 'from-pink-500 to-rose-500',
    category: 'Text',
    isFree: true
  },
  {
    id: 'color',
    title: 'Color Generator',
    description: 'Generate random colors in HEX, RGB, and HSL formats',
    icon: Palette,
    gradient: 'from-purple-500 to-pink-500',
    category: 'Design',
    isFree: true
  },
  {
    id: 'word',
    title: 'Word Generator',
    description: 'Generate random words for games and creative writing',
    icon: Shuffle,
    gradient: 'from-orange-500 to-red-500',
    category: 'Text',
    isFree: true
  },
  {
    id: 'quote',
    title: 'Quote Generator',
    description: 'Get inspiring quotes from famous personalities',
    icon: Quote,
    gradient: 'from-teal-500 to-cyan-500',
    category: 'Inspiration',
    isFree: true
  },
  {
    id: 'dice',
    title: 'Dice Roller',
    description: 'Roll virtual dice for games and decision making',
    icon: Gamepad2,
    gradient: 'from-red-500 to-orange-500',
    category: 'Games',
    isPopular: true,
    isFree: true
  },
  {
    id: 'date',
    title: 'Date Generator',
    description: 'Generate random dates for testing and scenarios',
    icon: Calendar,
    gradient: 'from-indigo-500 to-blue-500',
    category: 'Utility',
    isFree: true
  },
  {
    id: 'location',
    title: 'Location Generator',
    description: 'Generate random geographical locations worldwide',
    icon: MapPin,
    gradient: 'from-emerald-500 to-teal-500',
    category: 'Geography',
    isFree: true
  },
  {
    id: 'email',
    title: 'Email Generator',
    description: 'Create random email addresses for testing',
    icon: Mail,
    gradient: 'from-cyan-500 to-blue-500',
    category: 'Utility',
    isFree: true
  },
  {
    id: 'phone',
    title: 'Phone Generator',
    description: 'Generate random phone numbers for testing',
    icon: Phone,
    gradient: 'from-violet-500 to-purple-500',
    category: 'Utility',
    isFree: true
  },
  {
    id: 'uuid',
    title: 'UUID Generator',
    description: 'Generate unique identifiers for development',
    icon: Crown,
    gradient: 'from-gray-500 to-slate-500',
    category: 'Development',
    isFree: true
  }
]

const categories = ['All', 'Numbers', 'Text', 'Security', 'Games', 'Design', 'Utility', 'Development', 'Geography', 'Inspiration']

export function RandomToolsGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = randomTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularTools = randomTools.filter(tool => tool.isPopular)

  return (
    <div className="w-full space-y-8">
      {/* 搜索栏 */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search random tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400"
          />
        </div>
      </div>

      {/* 热门工具 */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">🔥 Most Popular Tools</h2>
            <p className="text-slate-300">Our most frequently used random generators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Card key={tool.id} className="glass-card group cursor-pointer hover:scale-105 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.gradient}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{tool.title}</span>
                          {tool.isPopular && (
                            <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">HOT</span>
                          )}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300 text-sm mb-3">
                      {tool.description}
                    </CardDescription>
                    <Button 
                      size="sm" 
                      className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-white border-0`}
                    >
                      Try Now
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* 分类导航 */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 工具网格 */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            {selectedCategory === 'All' ? 'All Random Tools' : `${selectedCategory} Tools`}
          </h2>
          <p className="text-slate-400 text-sm">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Card key={tool.id} className="glass-card group cursor-pointer hover:scale-105 transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.gradient}`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{tool.title}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded">
                          {tool.category}
                        </span>
                        {tool.isFree && (
                          <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-300 rounded">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-sm mb-3 line-clamp-2">
                    {tool.description}
                  </CardDescription>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    Use Tool
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No tools found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
} 