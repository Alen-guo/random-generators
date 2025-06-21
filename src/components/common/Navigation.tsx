"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search,
  ChevronDown,
  Home,
  Gamepad2,
  Hash,
  List,
  Palette,
  Code,
  BarChart3,
  BookOpen,
  User,
  Menu,
  X
} from 'lucide-react'

interface DropdownItem {
  name: string
  href: string
  description?: string
}

interface NavItem {
  name: string
  href?: string
  icon?: any
  dropdown?: DropdownItem[]
}

const navigationData: NavItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home
  },
  {
    name: 'Games',
    icon: Gamepad2,
    dropdown: [
      { name: 'Lottery Quick Pick', href: '/games/lottery', description: 'Generate lottery numbers' },
      { name: 'Keno Quick Pick', href: '/games/keno', description: 'Pick keno numbers' },
      { name: 'Coin Flipper', href: '/games/coin', description: 'Flip a virtual coin' },
      { name: 'Dice Roller', href: '/games/dice', description: 'Roll virtual dice' },
      { name: 'Playing Card Shuffler', href: '/games/cards', description: 'Shuffle playing cards' },
      { name: 'Bingo Card Generator', href: '/games/bingo', description: 'Create bingo cards' },
      { name: 'Team Generator', href: '/games/teams', description: 'Generate random teams' },
      { name: 'Tournament Bracket', href: '/games/bracket', description: 'Create tournament brackets' }
    ]
  },
  {
    name: 'Numbers',
    icon: Hash,
    dropdown: [
      { name: 'Integers', href: '/numbers/integers', description: 'Generate random integers' },
      { name: 'Sequences', href: '/numbers/sequences', description: 'Number sequences' },
      { name: 'Integer Sets', href: '/numbers/sets', description: 'Sets of unique numbers' },
      { name: 'Gaussian Numbers', href: '/numbers/gaussian', description: 'Normal distribution numbers' },
      { name: 'Decimal Fractions', href: '/numbers/decimals', description: 'Random decimal numbers' },
      { name: 'Raw Bytes', href: '/numbers/bytes', description: 'Random bytes' },
      { name: 'Prime Numbers', href: '/numbers/primes', description: 'Random prime numbers' },
      { name: 'Fibonacci Sequence', href: '/numbers/fibonacci', description: 'Fibonacci numbers' }
    ]
  },
  {
    name: 'Lists & More',
    icon: List,
    dropdown: [
      { name: 'List Randomizer', href: '/lists/randomizer', description: 'Randomize any list' },
      { name: 'Name Generator', href: '/lists/names', description: 'Generate random names' },
      { name: 'Password Generator', href: '/lists/passwords', description: 'Secure passwords' },
      { name: 'String Generator', href: '/lists/strings', description: 'Random strings' },
      { name: 'Date Generator', href: '/lists/dates', description: 'Random dates' },
      { name: 'Time Generator', href: '/lists/times', description: 'Random times' },
      { name: 'Geographic Coordinates', href: '/lists/coordinates', description: 'Random locations' },
      { name: 'Phone Numbers', href: '/lists/phones', description: 'Generate phone numbers' },
      { name: 'Email Addresses', href: '/lists/emails', description: 'Random email addresses' },
      { name: 'Lorem Ipsum', href: '/lists/lorem', description: 'Placeholder text' }
    ]
  },
  {
    name: 'Design',
    icon: Palette,
    dropdown: [
      { name: 'Color Generator', href: '/design/colors', description: 'Random colors' },
      { name: 'Color Palettes', href: '/design/palettes', description: 'Color combinations' },
      { name: 'Hex Color Codes', href: '/design/hex', description: 'Hex color values' },
      { name: 'RGB Colors', href: '/design/rgb', description: 'RGB color values' },
      { name: 'HSL Colors', href: '/design/hsl', description: 'HSL color values' },
      { name: 'Gradient Generator', href: '/design/gradients', description: 'CSS gradients' },
      { name: 'Image Placeholder', href: '/design/images', description: 'Placeholder images' }
    ]
  },
  {
    name: 'Web Tools',
    icon: Code,
    dropdown: [
      { name: 'UUID Generator', href: '/web/uuid', description: 'Unique identifiers' },
      { name: 'Hash Generator', href: '/web/hash', description: 'Generate hashes' },
      { name: 'QR Code Generator', href: '/web/qr', description: 'Create QR codes' },
      { name: 'JSON Data Generator', href: '/web/json', description: 'Mock JSON data' },
      { name: 'CSV Generator', href: '/web/csv', description: 'Random CSV data' },
      { name: 'SQL Generator', href: '/web/sql', description: 'Test SQL data' }
    ]
  },
  {
    name: 'Statistics',
    icon: BarChart3,
    dropdown: [
      { name: 'Usage Statistics', href: '/stats/usage', description: 'Site usage stats' },
      { name: 'Randomness Tests', href: '/stats/tests', description: 'Quality tests' },
      { name: 'Distribution Analysis', href: '/stats/distribution', description: 'Number distributions' },
      { name: 'Performance Metrics', href: '/stats/performance', description: 'System performance' }
    ]
  },
  {
    name: 'Learn More',
    icon: BookOpen,
    dropdown: [
      { name: 'About Randomness', href: '/learn/randomness', description: 'Understanding randomness' },
      { name: 'True vs Pseudo Random', href: '/learn/true-random', description: 'Technical explanation' },
      { name: 'Use Cases', href: '/learn/use-cases', description: 'How people use our tools' },
      { name: 'Algorithms', href: '/learn/algorithms', description: 'Our random algorithms' },
      { name: 'FAQ', href: '/learn/faq', description: 'Frequently asked questions' },
      { name: 'Blog', href: '/learn/blog', description: 'Latest articles' }
    ]
  }
]

// 创建搜索索引
const createSearchIndex = () => {
  const searchItems: Array<{name: string, href: string, description: string, category: string}> = []
  
  navigationData.forEach(navItem => {
    if (navItem.dropdown) {
      navItem.dropdown.forEach(item => {
        searchItems.push({
          name: item.name,
          href: item.href,
          description: item.description || '',
          category: navItem.name
        })
      })
    } else if (navItem.href) {
      searchItems.push({
        name: navItem.name,
        href: navItem.href,
        description: '',
        category: 'Main'
      })
    }
  })
  
  return searchItems
}

export function Navigation() {
  const router = useRouter()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{name: string, href: string, description: string, category: string}>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchIndex] = useState(() => createSearchIndex())
  
  // 添加延迟隐藏的 ref
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 搜索功能
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = searchIndex.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
      
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery, searchIndex])

  // 处理鼠标进入主菜单
  const handleMouseEnter = (itemName: string) => {
    // 清除之前的延迟隐藏
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setActiveDropdown(itemName)
  }

  // 处理鼠标离开主菜单区域
  const handleMouseLeave = () => {
    // 设置延迟隐藏，给用户时间移动到下拉菜单
    hideTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms 的缓冲时间
  }

  // 处理鼠标进入下拉菜单
  const handleDropdownMouseEnter = () => {
    // 清除延迟隐藏
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }

  // 处理鼠标离开下拉菜单
  const handleDropdownMouseLeave = () => {
    // 立即隐藏下拉菜单
    setActiveDropdown(null)
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const handleSearchSelect = (href: string) => {
    router.push(href)
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0].href)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold gradient-text">
              RANDOM GENERATORS
            </a>
          </div>
          
          {/* 桌面端导航菜单 */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationData.map((item) => {
              const IconComponent = item.icon
              const hasDropdown = item.dropdown && item.dropdown.length > 0
              
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(item.name)}
                  onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 text-white hover:bg-white/10 px-2 py-2 text-sm ${
                      activeDropdown === item.name ? 'bg-white/10' : ''
                    }`}
                    asChild={!hasDropdown}
                  >
                    {hasDropdown ? (
                      <div className="flex items-center gap-1 cursor-pointer">
                        <IconComponent className="h-4 w-4" />
                        <span className="hidden xl:inline">{item.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    ) : (
                      <a href={item.href} className="flex items-center gap-1">
                        <IconComponent className="h-4 w-4" />
                        <span className="hidden xl:inline">{item.name}</span>
                      </a>
                    )}
                  </Button>

                  {/* 下拉菜单 */}
                  {hasDropdown && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-72 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50"
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <div className="py-2 max-h-96 overflow-y-auto">
                        {item.dropdown!.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                          >
                            <div className="font-medium text-sm">{dropdownItem.name}</div>
                            {dropdownItem.description && (
                              <div className="text-xs text-slate-400 mt-1">{dropdownItem.description}</div>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 右侧搜索和登录 */}
          <div className="flex items-center space-x-3">
            {/* 搜索框 */}
            <div className="relative">
              {/* <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 1 && setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    className="w-48 pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 text-sm"
                  />
                </div>
              </form> */}
              
              {/* 搜索结果下拉 */}
              {/* {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="py-2">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(result.href)}
                        className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors"
                      >
                        <div className="font-medium text-sm">{result.name}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {result.category} • {result.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )} */}
            </div>

            {/* 登录按钮 */}
            {/* <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button> */}

            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            <div className="space-y-2">
              {navigationData.map((item) => {
                const IconComponent = item.icon
                const hasDropdown = item.dropdown && item.dropdown.length > 0
                
                return (
                  <div key={item.name}>
                    {hasDropdown ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-3 py-2 text-white font-medium">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          <span>{item.name}</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {item.dropdown!.map((dropdownItem) => (
                            <a
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}