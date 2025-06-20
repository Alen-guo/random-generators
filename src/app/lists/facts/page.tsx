"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Brain, RefreshCw, Copy, Download, Heart, Star, Clock, Lightbulb } from 'lucide-react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface FactConfig {
  categories: string[]
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'mixed'
  includeSource: boolean
  factLength: 'short' | 'medium' | 'long' | 'mixed'
}

interface GeneratedFact {
  id: string
  fact: string
  category: string
  difficulty: string
  source?: string
  length: 'short' | 'medium' | 'long'
  timestamp: Date
  isLiked: boolean
}

export default function FactsPage() {
  const containerRef = useTranslationProtection()
  const [config, setConfig] = useState<FactConfig>({
    categories: ['science'],
    difficultyLevel: 'mixed',
    includeSource: true,
    factLength: 'mixed'
  })
  const [generatedFacts, setGeneratedFacts] = useState<GeneratedFact[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFacts, setSelectedFacts] = useState<Set<string>>(new Set())

  const categories = [
    { 
      key: 'science', 
      name: 'Science', 
      icon: '🔬', 
      description: 'Amazing scientific discoveries and principles',
      color: 'text-blue-400'
    },
    { 
      key: 'history', 
      name: 'History', 
      icon: '📜', 
      description: 'Fascinating historical events and figures',
      color: 'text-amber-400'
    },
    { 
      key: 'nature', 
      name: 'Nature', 
      icon: '🌿', 
      description: 'Incredible facts about animals and plants',
      color: 'text-green-400'
    },
    { 
      key: 'technology', 
      name: 'Technology', 
      icon: '💻', 
      description: 'Mind-blowing tech innovations and inventions',
      color: 'text-purple-400'
    },
    { 
      key: 'space', 
      name: 'Space', 
      icon: '🚀', 
      description: 'Cosmic wonders and astronomical phenomena',
      color: 'text-cyan-400'
    },
    { 
      key: 'human', 
      name: 'Human Body', 
      icon: '🧠', 
      description: 'Incredible facts about human biology',
      color: 'text-pink-400'
    },
    { 
      key: 'geography', 
      name: 'Geography', 
      icon: '🌍', 
      description: 'Amazing places and geological wonders',
      color: 'text-emerald-400'
    },
    { 
      key: 'culture', 
      name: 'Culture', 
      icon: '🎭', 
      description: 'Interesting cultural traditions and customs',
      color: 'text-orange-400'
    }
  ]

  // 事实数据库
  const factsDatabase = {
    science: {
      easy: [
        { fact: "Water boils at 100°C (212°F) at sea level.", source: "Basic Chemistry" },
        { fact: "The Earth orbits the Sun once every 365.25 days.", source: "Astronomy Basics" },
        { fact: "Lightning is hotter than the surface of the Sun.", source: "Physics Facts" },
        { fact: "A group of flamingos is called a 'flamboyance'.", source: "Zoology" },
        { fact: "Bananas are berries, but strawberries aren't.", source: "Botany" }
      ],
      medium: [
        { fact: "DNA was first discovered in 1869, but its structure wasn't understood until 1953.", source: "Molecular Biology" },
        { fact: "The speed of light in a vacuum is exactly 299,792,458 meters per second.", source: "Physics Constants" },
        { fact: "Octopuses have three hearts and blue blood.", source: "Marine Biology" },
        { fact: "The chemical element with the longest name is 'pneumonoultramicroscopicsilicovolcanoconiosisogen'.", source: "Chemistry" },
        { fact: "A single raindrop falls at approximately 20 mph.", source: "Meteorology" }
      ],
      hard: [
        { fact: "Quantum entanglement allows particles to instantaneously affect each other regardless of distance.", source: "Quantum Physics" },
        { fact: "The mitochondrial DNA is inherited exclusively from the mother in most species.", source: "Genetics" },
        { fact: "Neutron stars are so dense that a teaspoon would weigh about 6 billion tons.", source: "Astrophysics" },
        { fact: "The Heisenberg Uncertainty Principle states that you cannot know both the position and momentum of a particle simultaneously.", source: "Quantum Mechanics" }
      ]
    },
    history: {
      easy: [
        { fact: "The Great Wall of China was built over many dynasties, starting in the 7th century BC.", source: "World History" },
        { fact: "World War II ended in 1945.", source: "Modern History" },
        { fact: "The ancient Egyptians built the pyramids as tombs for pharaohs.", source: "Ancient History" },
        { fact: "Christopher Columbus reached the Americas in 1492.", source: "Age of Exploration" },
        { fact: "The Roman Empire lasted for over 1000 years.", source: "Classical History" }
      ],
      medium: [
        { fact: "The Library of Alexandria was one of the largest libraries of the ancient world.", source: "Ancient History" },
        { fact: "The Black Death killed an estimated 75-200 million people in the 14th century.", source: "Medieval History" },
        { fact: "Napoleon Bonaparte was exiled twice, first to Elba and then to Saint Helena.", source: "European History" },
        { fact: "The Rosetta Stone was key to deciphering Egyptian hieroglyphs.", source: "Archaeology" },
        { fact: "The Vikings reached North America 500 years before Columbus.", source: "Medieval History" }
      ],
      hard: [
        { fact: "The Carrington Event of 1859 was the most powerful geomagnetic storm in recorded history.", source: "Scientific History" },
        { fact: "The Taiping Rebellion (1850-1864) was one of the deadliest conflicts in human history.", source: "Chinese History" },
        { fact: "The Bronze Age collapse around 1177 BC led to the fall of several major civilizations.", source: "Ancient History" },
        { fact: "The Younger Dryas period caused rapid climate change that lasted about 1,300 years.", source: "Prehistoric History" }
      ]
    },
    nature: {
      easy: [
        { fact: "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.", source: "Food Science" },
        { fact: "A group of owls is called a 'parliament'.", source: "Ornithology" },
        { fact: "Dolphins have names for each other.", source: "Marine Biology" },
        { fact: "Trees can communicate with each other through underground networks.", source: "Forest Ecology" },
        { fact: "A shrimp's heart is in its head.", source: "Marine Biology" }
      ],
      medium: [
        { fact: "The immortal jellyfish (Turritopsis dohrnii) can theoretically live forever.", source: "Marine Biology" },
        { fact: "Some trees can live for thousands of years, like the bristlecone pines.", source: "Dendrology" },
        { fact: "Elephants can recognize themselves in mirrors, showing self-awareness.", source: "Animal Psychology" },
        { fact: "The Arctic tern migrates roughly 44,000 miles annually, the longest migration of any bird.", source: "Ornithology" },
        { fact: "Mushrooms are more closely related to animals than to plants.", source: "Mycology" }
      ],
      hard: [
        { fact: "Tardigrades can survive in space without protection and withstand extreme radiation.", source: "Astrobiology" },
        { fact: "Some plants can count, like the Venus flytrap which needs two trigger hairs touched within 20 seconds.", source: "Plant Neurobiology" },
        { fact: "The mantis shrimp has the most complex color vision in the animal kingdom with 16 types of color receptors.", source: "Comparative Vision" },
        { fact: "Mycorrhizal networks can span thousands of acres and connect multiple forest ecosystems.", source: "Ecosystem Ecology" }
      ]
    },
    technology: {
      easy: [
        { fact: "The first computer bug was an actual bug - a moth found in a Harvard computer in 1947.", source: "Computer History" },
        { fact: "The first website is still online and was created in 1991.", source: "Internet History" },
        { fact: "A smartphone has more computing power than all of NASA had in 1969.", source: "Computing" },
        { fact: "The first email was sent in 1971.", source: "Communication Technology" },
        { fact: "Wi-Fi stands for 'Wireless Fidelity'.", source: "Network Technology" }
      ],
      medium: [
        { fact: "The term 'robot' comes from the Czech word 'robota' meaning forced labor.", source: "Robotics History" },
        { fact: "The first computer programmer was Ada Lovelace in the 1840s.", source: "Programming History" },
        { fact: "Internet data travels at about 70% the speed of light through fiber optic cables.", source: "Network Engineering" },
        { fact: "The first digital camera was invented in 1975 and weighed 8 pounds.", source: "Photography Technology" },
        { fact: "Bluetooth technology is named after Harald Bluetooth, a 10th-century Danish king.", source: "Technology History" }
      ],
      hard: [
        { fact: "Quantum computers use qubits that can exist in superposition, being both 0 and 1 simultaneously.", source: "Quantum Computing" },
        { fact: "Machine learning algorithms can now generate deepfakes that are nearly indistinguishable from reality.", source: "Artificial Intelligence" },
        { fact: "CRISPR gene editing technology allows precise modification of DNA sequences in living organisms.", source: "Biotechnology" },
        { fact: "Neuromorphic chips mimic the human brain's neural structure for ultra-efficient computing.", source: "Advanced Computing" }
      ]
    },
    space: {
      easy: [
        { fact: "The Sun is so large that about 1.3 million Earths could fit inside it.", source: "Solar System" },
        { fact: "A day on Venus is longer than its year.", source: "Planetary Science" },
        { fact: "Saturn's rings are made mostly of ice and rock particles.", source: "Planetary Science" },
        { fact: "The Moon is moving away from Earth at about 1.5 inches per year.", source: "Lunar Science" },
        { fact: "Jupiter has at least 79 known moons.", source: "Planetary Science" }
      ],
      medium: [
        { fact: "One million Earths could fit inside the Sun, and the Sun is considered a medium-sized star.", source: "Stellar Astronomy" },
        { fact: "There are more possible games of chess than there are atoms in the observable universe.", source: "Mathematics & Cosmology" },
        { fact: "A year on Pluto lasts 248 Earth years.", source: "Dwarf Planets" },
        { fact: "The International Space Station travels at 17,500 mph and orbits Earth every 90 minutes.", source: "Space Exploration" },
        { fact: "Neutron stars can spin up to 700 times per second.", source: "Stellar Physics" }
      ],
      hard: [
        { fact: "Dark matter makes up about 85% of all matter in the universe, but we can't directly observe it.", source: "Cosmology" },
        { fact: "Time dilation near a black hole's event horizon would make time pass differently relative to outside observers.", source: "Relativity" },
        { fact: "The cosmic microwave background radiation is the afterglow of the Big Bang, visible throughout the universe.", source: "Cosmology" },
        { fact: "Hawking radiation suggests that black holes slowly evaporate over extremely long periods of time.", source: "Theoretical Physics" }
      ]
    },
    human: {
      easy: [
        { fact: "The human brain contains approximately 86 billion neurons.", source: "Neuroscience" },
        { fact: "Your stomach gets an entirely new lining every 3-4 days.", source: "Human Biology" },
        { fact: "The human heart beats about 100,000 times per day.", source: "Cardiology" },
        { fact: "You blink about 17,000 times per day.", source: "Ophthalmology" },
        { fact: "The human body produces about 1.5 liters of saliva daily.", source: "Human Physiology" }
      ],
      medium: [
        { fact: "Your brain uses about 20% of your body's total energy despite being only 2% of your body weight.", source: "Neuroscience" },
        { fact: "The human immune system has a memory and can remember pathogens for decades.", source: "Immunology" },
        { fact: "Your bones are constantly being broken down and rebuilt throughout your life.", source: "Orthopedics" },
        { fact: "The human eye can distinguish about 10 million different colors.", source: "Visual Science" },
        { fact: "Your brain continues developing until you're about 25 years old.", source: "Developmental Neuroscience" }
      ],
      hard: [
        { fact: "Epigenetic changes can alter gene expression without changing DNA sequence and can be inherited.", source: "Epigenetics" },
        { fact: "The vagus nerve connects the brain to most major organs and plays a crucial role in the mind-body connection.", source: "Neuroscience" },
        { fact: "Telomeres shorten with age and cellular division, potentially contributing to aging and disease.", source: "Cellular Biology" },
        { fact: "The human microbiome contains more bacterial cells than human cells and significantly affects health.", source: "Microbiology" }
      ]
    },
    geography: {
      easy: [
        { fact: "The Amazon rainforest produces about 20% of the world's oxygen.", source: "Environmental Science" },
        { fact: "The Dead Sea is the lowest point on Earth's surface.", source: "Physical Geography" },
        { fact: "Antarctica is the largest desert in the world.", source: "Geography" },
        { fact: "The Nile River is the longest river in the world at about 4,135 miles.", source: "Physical Geography" },
        { fact: "Mount Everest grows about 4 millimeters taller each year.", source: "Geology" }
      ],
      medium: [
        { fact: "The Mariana Trench is deeper than Mount Everest is tall.", source: "Oceanography" },
        { fact: "Lake Baikal contains about 20% of all fresh water on Earth's surface.", source: "Limnology" },
        { fact: "The Sahara Desert is roughly the size of the entire United States.", source: "Desert Geography" },
        { fact: "Iceland sits on the Mid-Atlantic Ridge, causing it to grow by 2 cm per year.", source: "Plate Tectonics" },
        { fact: "The Ring of Fire contains 75% of the world's active volcanoes.", source: "Volcanology" }
      ],
      hard: [
        { fact: "Continental drift occurs at about the same rate as fingernails grow (2-5 cm per year).", source: "Plate Tectonics" },
        { fact: "The Earth's magnetic field has reversed many times throughout history, with the last reversal 780,000 years ago.", source: "Geomagnetism" },
        { fact: "Isostatic rebound causes land to rise after ice sheets melt, still occurring in Scandinavia today.", source: "Glacial Geology" },
        { fact: "The Yellowstone Caldera is considered a supervolcano that last erupted 640,000 years ago.", source: "Volcanology" }
      ]
    },
    culture: {
      easy: [
        { fact: "In Japan, it's considered rude to tip at restaurants.", source: "Japanese Culture" },
        { fact: "The thumbs-up gesture is considered offensive in some Middle Eastern countries.", source: "Cultural Anthropology" },
        { fact: "In India, people traditionally eat with their right hand only.", source: "Indian Culture" },
        { fact: "Kissing on both cheeks is a common greeting in many European countries.", source: "European Customs" },
        { fact: "In China, the color red symbolizes good luck and prosperity.", source: "Chinese Culture" }
      ],
      medium: [
        { fact: "The Inuit people have dozens of words for different types of snow and ice.", source: "Linguistic Anthropology" },
        { fact: "In Ethiopia, being late is often considered polite as it shows you didn't eagerly wait.", source: "Ethiopian Culture" },
        { fact: "The Maasai people of Kenya traditionally greet each other by spitting.", source: "African Cultures" },
        { fact: "In Russia, giving an even number of flowers is associated with funerals.", source: "Russian Traditions" },
        { fact: "The ancient Romans used to brush their teeth with urine.", source: "Ancient Roman Culture" }
      ],
      hard: [
        { fact: "The concept of individual human rights is relatively recent and not universal across all cultures.", source: "Cultural Philosophy" },
        { fact: "Some Amazonian tribes have no concept of exact numbers beyond three, using only 'few' and 'many'.", source: "Cognitive Anthropology" },
        { fact: "The Pirahã people of the Amazon have no creation myths or abstract art in their culture.", source: "Linguistic Anthropology" },
        { fact: "Certain Pacific Islander cultures practice 'gift economies' where status comes from giving away wealth.", source: "Economic Anthropology" }
      ]
    }
  }

  const generateFacts = async () => {
    if (config.categories.length === 0) return

    setIsGenerating(true)
    
    try {
      const facts: GeneratedFact[] = []
      
      for (let i = 0; i < 5; i++) {
        const randomCategory = config.categories[Math.floor(Math.random() * config.categories.length)]
        const categoryFacts = factsDatabase[randomCategory as keyof typeof factsDatabase]
        
        let difficulty = config.difficultyLevel
        if (difficulty === 'mixed') {
          difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
        }
        
        const difficultyFacts = categoryFacts[difficulty]
        if (difficultyFacts.length === 0) continue
        
        const randomFact = difficultyFacts[Math.floor(Math.random() * difficultyFacts.length)]
        
        let length: 'short' | 'medium' | 'long' = 'medium'
        if (config.factLength === 'mixed') {
          length = ['short', 'medium', 'long'][Math.floor(Math.random() * 3)] as 'short' | 'medium' | 'long'
        } else {
          length = config.factLength as 'short' | 'medium' | 'long'
        }
        
        facts.push({
          id: `fact_${Date.now()}_${i}`,
          fact: randomFact.fact,
          category: randomCategory,
          difficulty,
          source: config.includeSource ? randomFact.source : undefined,
          length,
          timestamp: new Date(),
          isLiked: false
        })
      }
      
      setGeneratedFacts([...facts, ...generatedFacts.slice(0, 15)]) // Keep last 20 facts
      
    } catch (error) {
      console.error('Error generating facts:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleCategory = (category: string) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const toggleLike = (factId: string) => {
    setGeneratedFacts(prev =>
      prev.map(fact =>
        fact.id === factId ? { ...fact, isLiked: !fact.isLiked } : fact
      )
    )
  }

  const copyFact = (fact: GeneratedFact) => {
    const text = config.includeSource && fact.source 
      ? `${fact.fact}\n\nSource: ${fact.source}`
      : fact.fact
    navigator.clipboard.writeText(text)
  }

  const downloadFacts = () => {
    if (generatedFacts.length === 0) return
    
    const content = generatedFacts.map((fact, index) => {
      const source = config.includeSource && fact.source ? `\nSource: ${fact.source}` : ''
      return `${index + 1}. ${fact.fact}${source}\nCategory: ${fact.category} | Difficulty: ${fact.difficulty}\n`
    }).join('\n')
    
    const header = `Random Facts Collection\nGenerated: ${new Date().toLocaleString()}\nTotal Facts: ${generatedFacts.length}\n\n`
    const blob = new Blob([header + content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-facts-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'educational' | 'entertaining' | 'scientific' | 'general') => {
    switch (preset) {
      case 'educational':
        setConfig({
          categories: ['science', 'history', 'geography'],
          difficultyLevel: 'medium',
          includeSource: true,
          factLength: 'medium'
        })
        break
      case 'entertaining':
        setConfig({
          categories: ['nature', 'culture', 'human'],
          difficultyLevel: 'easy',
          includeSource: false,
          factLength: 'short'
        })
        break
      case 'scientific':
        setConfig({
          categories: ['science', 'technology', 'space'],
          difficultyLevel: 'hard',
          includeSource: true,
          factLength: 'long'
        })
        break
      case 'general':
        setConfig({
          categories: ['science', 'history', 'nature', 'technology'],
          difficultyLevel: 'mixed',
          includeSource: true,
          factLength: 'mixed'
        })
        break
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-400',
      medium: 'text-yellow-400',
      hard: 'text-red-400'
    }
    return colors[difficulty as keyof typeof colors] || 'text-gray-400'
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category)
    return cat ? cat.icon : '📚'
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.key === category)
    return cat ? cat.color : 'text-gray-400'
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Random Facts Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Discover amazing facts from science, history, nature, technology, and more. Expand your knowledge with fascinating information!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5" />
                  Fact Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your fact generation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 类别选择 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Categories ({config.categories.length} selected)</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map(category => (
                      <button
                        key={category.key}
                        onClick={() => toggleCategory(category.key)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          config.categories.includes(category.key)
                            ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {category.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 难度级别 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Difficulty Level</Label>
                  <select
                    value={config.difficultyLevel}
                    onChange={(e) => setConfig(prev => ({ ...prev, difficultyLevel: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="easy" className="bg-slate-800">Easy - Simple facts</option>
                    <option value="medium" className="bg-slate-800">Medium - Intermediate facts</option>
                    <option value="hard" className="bg-slate-800">Hard - Complex facts</option>
                    <option value="mixed" className="bg-slate-800">Mixed - All levels</option>
                  </select>
                </div>

                {/* 事实长度 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Fact Length</Label>
                  <select
                    value={config.factLength}
                    onChange={(e) => setConfig(prev => ({ ...prev, factLength: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="short" className="bg-slate-800">Short - Brief facts</option>
                    <option value="medium" className="bg-slate-800">Medium - Detailed facts</option>
                    <option value="long" className="bg-slate-800">Long - Comprehensive facts</option>
                    <option value="mixed" className="bg-slate-800">Mixed - Various lengths</option>
                  </select>
                </div>

                {/* 选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Options</Label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={config.includeSource}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeSource: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include source information</span>
                  </label>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('educational')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Educational
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('entertaining')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Fun
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('scientific')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Scientific
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('general')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      General
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateFacts}
                  disabled={isGenerating || config.categories.length === 0}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Facts...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Facts
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的事实 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedFacts.length > 0 ? (
              <>
                {/* 导出按钮 */}
                <div className="flex justify-end">
                  <Button
                    onClick={downloadFacts}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Facts
                  </Button>
                </div>

                {/* 事实列表 */}
                <div className="space-y-4">
                  {generatedFacts.map((fact, index) => (
                    <Card key={fact.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryIcon(fact.category)}</span>
                            <span className={`text-sm font-medium ${getCategoryColor(fact.category)}`}>
                              {fact.category.charAt(0).toUpperCase() + fact.category.slice(1)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(fact.difficulty)} bg-white/10`}>
                              {fact.difficulty}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => toggleLike(fact.id)}
                              size="sm"
                              variant="ghost"
                              className={`${fact.isLiked ? 'text-red-400' : 'text-slate-400'} hover:text-red-300`}
                            >
                              <Heart className={`h-4 w-4 ${fact.isLiked ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              onClick={() => copyFact(fact)}
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-white text-base leading-relaxed mb-3">
                          {fact.fact}
                        </p>
                        
                        {fact.source && (
                          <div className="text-slate-400 text-sm">
                            <span className="font-medium">Source:</span> {fact.source}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-white/10">
                          <span>Generated {fact.timestamp.toLocaleString()}</span>
                          <span>Fact #{index + 1}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to learn something new?</p>
                  <p>Select categories and click "Generate Facts"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Random Facts Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">8 Knowledge Categories</h4>
                    <p className="text-sm">Explore science, history, nature, technology, space, human body, geography, and culture.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Difficulty Levels</h4>
                    <p className="text-sm">Choose from easy, medium, hard, or mixed difficulty to match your knowledge level.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Source Information</h4>
                    <p className="text-sm">Enable sources to learn where facts come from and explore topics further.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Learning new things</li>
                      <li>Conversation starters</li>
                      <li>Educational content</li>
                      <li>Trivia preparation</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Brain training</li>
                      <li>Research inspiration</li>
                      <li>Social media content</li>
                      <li>Curiosity satisfaction</li>
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