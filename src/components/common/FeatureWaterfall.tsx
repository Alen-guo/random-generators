"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Play, 
  Pause, 
  FastForward, 
  Rewind,
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
  CreditCard,
  Users,
  Star,
  Heart,
  Zap,
  Crown,
  Target,
  Award,
  Gamepad2,
  Music,
  Image,
  Lock,
  Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FeatureItem {
  id: string
  title: string
  description: string
  longDescription?: string
  icon: any
  gradient: string
  category: string
  popularity: number
  features?: string[]
  height?: number // 用于模拟不同高度
}

const generateRandomFeatures = (): FeatureItem[] => [
  {
    id: 'number',
    title: 'Random Number Generator',
    description: 'Generate random numbers with advanced customization options',
    longDescription: 'Create random integers, decimals, ranges, and sequences. Perfect for games, statistics, and testing. Supports negative numbers, scientific notation, and custom formats.',
    icon: Dices,
    gradient: 'from-purple-500 to-blue-500',
    category: 'numbers',
    popularity: 95,
    features: ['Integer & Decimal', 'Custom Range', 'Bulk Generation', 'No Duplicates'],
    height: Math.random() * 100 + 200
  },
  {
    id: 'password',
    title: 'Password Generator',
    description: 'Create ultra-secure passwords with custom complexity',
    longDescription: 'Generate cryptographically secure passwords with customizable length, character sets, and complexity rules.',
    icon: Hash,
    gradient: 'from-green-500 to-emerald-500',
    category: 'security',
    popularity: 90,
    features: ['Ultra Secure', 'Custom Length', 'Special Characters'],
    height: Math.random() * 100 + 180
  },
  {
    id: 'name',
    title: 'Random Name Generator',
    description: 'Generate names from different cultures worldwide',
    longDescription: 'Choose from thousands of names across different cultures, genders, and regions. Perfect for character creation, testing, and creative writing.',
    icon: Type,
    gradient: 'from-blue-500 to-cyan-500',
    category: 'text',
    popularity: 85,
    features: ['Multi-cultural', 'Gender Options', 'Full Names'],
    height: Math.random() * 100 + 220
  },
  {
    id: 'color',
    title: 'Color Generator',
    description: 'Generate beautiful colors in HEX, RGB, HSL formats',
    icon: Palette,
    gradient: 'from-purple-500 to-pink-500',
    category: 'design',
    popularity: 80,
    features: ['HEX', 'RGB', 'HSL', 'Color Palettes'],
    height: Math.random() * 100 + 160
  },
  {
    id: 'word',
    title: 'Word Generator',
    description: 'Generate random words for creativity and games',
    longDescription: 'Perfect for word games, creative writing prompts, and brainstorming sessions.',
    icon: Shuffle,
    gradient: 'from-orange-500 to-red-500',
    category: 'text',
    popularity: 75,
    height: Math.random() * 100 + 190
  },
  {
    id: 'quote',
    title: 'Quote Generator',
    description: 'Get inspired with quotes from famous personalities',
    longDescription: 'Discover wisdom from great minds throughout history. Categories include motivation, love, success, and philosophy.',
    icon: Quote,
    gradient: 'from-teal-500 to-green-500',
    category: 'inspiration',
    popularity: 70,
    features: ['Famous Authors', 'Categories', 'Daily Inspiration'],
    height: Math.random() * 100 + 240
  },
  {
    id: 'date',
    title: 'Random Date Generator',
    description: 'Generate random dates for testing and scenarios',
    icon: Calendar,
    gradient: 'from-indigo-500 to-purple-500',
    category: 'utility',
    popularity: 65,
    height: Math.random() * 100 + 170
  },
  {
    id: 'location',
    title: 'Location Generator',
    description: 'Generate random geographical locations worldwide',
    longDescription: 'Get random cities, countries, coordinates, and addresses from around the globe.',
    icon: MapPin,
    gradient: 'from-rose-500 to-pink-500',
    category: 'geography',
    popularity: 60,
    height: Math.random() * 100 + 200
  },
  {
    id: 'phone',
    title: 'Phone Number Generator',
    description: 'Generate valid phone numbers for testing',
    icon: Phone,
    gradient: 'from-violet-500 to-purple-500',
    category: 'utility',
    popularity: 55,
    height: Math.random() * 100 + 160
  },
  {
    id: 'email',
    title: 'Email Generator',
    description: 'Create random email addresses for testing purposes',
    longDescription: 'Generate realistic email addresses with various domains and formats for development and testing.',
    icon: Mail,
    gradient: 'from-cyan-500 to-blue-500',
    category: 'utility',
    popularity: 50,
    height: Math.random() * 100 + 180
  },
  {
    id: 'uuid',
    title: 'UUID Generator',
    description: 'Generate unique identifiers for development',
    icon: Crown,
    gradient: 'from-slate-500 to-gray-500',
    category: 'development',
    popularity: 45,
    height: Math.random() * 100 + 150
  },
  {
    id: 'dice',
    title: 'Dice Roller',
    description: 'Roll virtual dice for games and decisions',
    longDescription: 'Supports multiple dice types: D4, D6, D8, D10, D12, D20, D100. Perfect for tabletop gaming.',
    icon: Gamepad2,
    gradient: 'from-red-500 to-orange-500',
    category: 'games',
    popularity: 70,
    features: ['Multiple Dice', 'D&D Compatible', 'Custom Sides'],
    height: Math.random() * 100 + 210
  },
  {
    id: 'music',
    title: 'Random Playlist',
    description: 'Generate random music playlists and songs',
    icon: Music,
    gradient: 'from-pink-500 to-purple-500',
    category: 'entertainment',
    popularity: 40,
    height: Math.random() * 100 + 190
  },
  {
    id: 'image',
    title: 'Random Image',
    description: 'Get random images for placeholders and design',
    longDescription: 'Access thousands of high-quality random images across different categories and dimensions.',
    icon: Image,
    gradient: 'from-green-500 to-blue-500',
    category: 'design',
    popularity: 60,
    height: Math.random() * 100 + 200
  },
  {
    id: 'crypto',
    title: 'Crypto Generator',
    description: 'Generate random cryptocurrency data and keys',
    icon: Lock,
    gradient: 'from-yellow-500 to-orange-500',
    category: 'crypto',
    popularity: 35,
    height: Math.random() * 100 + 170
  },
  {
    id: 'api',
    title: 'API Data Generator',
    description: 'Generate random JSON data for API testing',
    longDescription: 'Create realistic mock data for your APIs with customizable schemas and data types.',
    icon: Globe,
    gradient: 'from-indigo-500 to-blue-500',
    category: 'development',
    popularity: 55,
    features: ['JSON Format', 'Custom Schema', 'Bulk Data'],
    height: Math.random() * 100 + 230
  }
]

export function FeatureWaterfall() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [allFeatures] = useState(() => generateRandomFeatures())
  const [filteredFeatures, setFilteredFeatures] = useState(allFeatures)
  const [displayedFeatures, setDisplayedFeatures] = useState<FeatureItem[]>([])
  const [columns, setColumns] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const nextItemIndex = useRef(0)

  // 响应式列数
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)
      else if (width < 768) setColumns(2)
      else if (width < 1024) setColumns(3)
      else setColumns(4)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // 搜索过滤
  useEffect(() => {
    const filtered = allFeatures.filter(feature =>
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredFeatures(filtered)
    nextItemIndex.current = 0
    if (!searchQuery) {
      setDisplayedFeatures([])
    }
  }, [searchQuery, allFeatures])

  // 瀑布流布局计算
  const calculatePosition = useCallback((index: number, columns: number) => {
    const columnWidth = 100 / columns
    const column = index % columns
    const row = Math.floor(index / columns)
    
    return {
      left: `${column * columnWidth}%`,
      width: `${columnWidth}%`,
      animationDelay: index * 0.1
    }
  }, [])

  // 添加新卡片到瀑布流
  const addNewCard = useCallback(() => {
    if (nextItemIndex.current >= filteredFeatures.length) {
      nextItemIndex.current = 0
    }

    const newFeature = filteredFeatures[nextItemIndex.current]
    if (newFeature) {
      const featureWithId = {
        ...newFeature,
        id: `${newFeature.id}-${Date.now()}-${nextItemIndex.current}`,
        height: Math.random() * 150 + 200 // 随机高度
      }

      setDisplayedFeatures(prev => {
        const newFeatures = [featureWithId, ...prev]
        // 限制显示数量，保持瀑布流流动
        return newFeatures.slice(0, Math.min(12, filteredFeatures.length))
      })
      
      nextItemIndex.current++
    }
  }, [filteredFeatures])

  // 瀑布流动画
  useEffect(() => {
    if (!isPlaying || filteredFeatures.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // 立即添加第一批卡片
    if (displayedFeatures.length === 0) {
      const initialCount = Math.min(8, filteredFeatures.length)
      for (let i = 0; i < initialCount; i++) {
        setTimeout(() => addNewCard(), i * 200)
      }
    }

    const delay = Math.max(800, 2000 / speed)
    intervalRef.current = setInterval(addNewCard, delay)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed, filteredFeatures, addNewCard, displayedFeatures.length])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(Math.max(0.25, Math.min(4, newSpeed)))
  }

  return (
    <div className="w-full space-y-8">
      {/* 搜索框 */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
          <Input
            placeholder="Search for random generators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-2xl backdrop-blur-lg"
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSpeedChange(speed - 0.25)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          disabled={speed <= 0.25}
        >
          <Rewind className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handlePlayPause}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSpeedChange(speed + 0.25)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          disabled={speed >= 4}
        >
          <FastForward className="h-5 w-5" />
        </Button>
        
        <div className="ml-4 text-white/70 text-sm">
          Speed: {speed}x
        </div>
      </div>

      {/* 真正的瀑布流容器 */}
      <div 
        ref={containerRef}
        className="relative h-[700px] overflow-hidden rounded-3xl glass-card p-6"
      >
        <div className="relative h-full overflow-y-auto">
          <AnimatePresence>
            {displayedFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              const position = calculatePosition(index, columns)
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ 
                    opacity: 0, 
                    y: -100,
                    scale: 0.9
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: index * 50, // 错落排列
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 100,
                    scale: 0.9
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: position.animationDelay,
                    ease: "easeOut",
                    y: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: position.left,
                    width: `calc(${position.width} - 12px)`,
                    top: `${(index % columns) * 60}px`, // 错落的垂直位置
                    zIndex: displayedFeatures.length - index
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    zIndex: 1000,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card 
                    className="glass-card neon-border group cursor-pointer h-auto"
                    style={{ 
                      height: `${feature.height}px`,
                      minHeight: '200px'
                    }}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-white text-lg">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <span className="line-clamp-2 text-sm">{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="text-slate-300 text-sm line-clamp-3">
                        {feature.description}
                      </CardDescription>
                      
                      {feature.longDescription && (
                        <p className="text-slate-400 text-xs line-clamp-2">
                          {feature.longDescription}
                        </p>
                      )}

                      {feature.features && (
                        <div className="flex flex-wrap gap-1">
                          {feature.features.slice(0, 3).map((feat, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs border border-white/20"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-slate-300">{feature.popularity}%</span>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className={`bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white border-0 text-xs px-2 py-1 h-6`}
                        >
                          Try
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* 瀑布流动态背景 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* 状态信息 */}
      <div className="text-center">
        <p className="text-slate-400 text-sm">
          {searchQuery ? (
            <>Flowing {filteredFeatures.length} results for "{searchQuery}"</>
          ) : (
            <>Waterfall flowing with {allFeatures.length} amazing generators</>
          )}
        </p>
      </div>
    </div>
  )
} 