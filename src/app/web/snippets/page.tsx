"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Code, RefreshCw, Copy, Download, FileCode, Braces, Play } from 'lucide-react'

interface SnippetConfig {
  language: string
  category: string
  complexity: string
  includeComments: boolean
  includeDocumentation: boolean
  variablePrefix: string
  customTemplate: string
}

interface GeneratedSnippet {
  id: string
  language: string
  category: string
  title: string
  code: string
  description: string
  documentation: string
  complexity: string
  tags: string[]
  timestamp: Date
}

export default function SnippetsPage() {
  const [config, setConfig] = useState<SnippetConfig>({
    language: 'javascript',
    category: 'function',
    complexity: 'medium',
    includeComments: true,
    includeDocumentation: false,
    variablePrefix: '',
    customTemplate: ''
  })
  const [generatedSnippets, setGeneratedSnippets] = useState<GeneratedSnippet[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const languages = [
    { key: 'javascript', name: 'JavaScript', icon: '🟨', ext: 'js' },
    { key: 'typescript', name: 'TypeScript', icon: '🔷', ext: 'ts' },
    { key: 'python', name: 'Python', icon: '🐍', ext: 'py' },
    { key: 'java', name: 'Java', icon: '☕', ext: 'java' },
    { key: 'csharp', name: 'C#', icon: '💜', ext: 'cs' },
    { key: 'cpp', name: 'C++', icon: '⚡', ext: 'cpp' },
    { key: 'go', name: 'Go', icon: '🐹', ext: 'go' },
    { key: 'rust', name: 'Rust', icon: '🦀', ext: 'rs' },
    { key: 'php', name: 'PHP', icon: '🐘', ext: 'php' },
    { key: 'ruby', name: 'Ruby', icon: '💎', ext: 'rb' },
    { key: 'swift', name: 'Swift', icon: '🦉', ext: 'swift' },
    { key: 'kotlin', name: 'Kotlin', icon: '🤖', ext: 'kt' }
  ]

  const categories = [
    { key: 'function', name: 'Functions', icon: '⚡', description: 'Utility functions and methods' },
    { key: 'class', name: 'Classes', icon: '🏗️', description: 'Object-oriented structures' },
    { key: 'component', name: 'Components', icon: '🧩', description: 'UI components and widgets' },
    { key: 'algorithm', name: 'Algorithms', icon: '🧮', description: 'Sorting, searching, data structures' },
    { key: 'api', name: 'API Calls', icon: '🌐', description: 'HTTP requests and responses' },
    { key: 'database', name: 'Database', icon: '🗄️', description: 'CRUD operations and queries' },
    { key: 'validation', name: 'Validation', icon: '✅', description: 'Input validation and forms' },
    { key: 'async', name: 'Async/Await', icon: '⏳', description: 'Asynchronous programming patterns' },
    { key: 'testing', name: 'Testing', icon: '🧪', description: 'Unit tests and test cases' },
    { key: 'utility', name: 'Utilities', icon: '🔧', description: 'Helper functions and tools' }
  ]

  const complexityLevels = [
    { key: 'beginner', name: 'Beginner', description: 'Simple, easy to understand' },
    { key: 'medium', name: 'Intermediate', description: 'Moderate complexity' },
    { key: 'advanced', name: 'Advanced', description: 'Complex, production-ready' }
  ]

  const codeTemplates = {
    javascript: {
      function: {
        beginner: [
          {
            title: 'Simple Calculator Function',
            code: `// Simple calculator function
function calculate(a, b, operation) {
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      return b !== 0 ? a / b : 'Error: Division by zero';
    default:
      return 'Error: Invalid operation';
  }
}

// Example usage
console.log(calculate(10, 5, 'add')); // 15
console.log(calculate(10, 5, 'divide')); // 2`,
            description: 'A basic calculator function with four operations',
            tags: ['arithmetic', 'switch', 'basic'],
            documentation: `/**
 * Performs basic arithmetic operations
 * @param {number} a - First number
 * @param {number} b - Second number  
 * @param {string} operation - Operation to perform ('add', 'subtract', 'multiply', 'divide')
 * @returns {number|string} Result of operation or error message
 */`
          },
          {
            title: 'Array Utilities',
            code: `// Array utility functions
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Example usage
const fruits = ['apple', 'banana', 'cherry', 'apple'];
console.log(getRandomElement(fruits));
console.log(shuffleArray(fruits));
console.log(removeDuplicates(fruits));`,
            description: 'Common array manipulation utilities',
            tags: ['array', 'utilities', 'random'],
            documentation: `/**
 * Array utility functions for common operations
 */`
          }
        ],
        medium: [
          {
            title: 'Debounce Function',
            code: `// Debounce utility function
function debounce(func, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    const context = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Example usage with search input
const searchInput = document.getElementById('search');
const handleSearch = debounce((event) => {
  console.log('Searching for:', event.target.value);
  // Perform search operation
}, 300);

searchInput?.addEventListener('input', handleSearch);`,
            description: 'Debounce function to limit function execution frequency',
            tags: ['debounce', 'performance', 'events'],
            documentation: `/**
 * Creates a debounced function that delays invoking func until after delay milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */`
          },
          {
            title: 'Local Storage Manager',
            code: `// Local storage utility class
class StorageManager {
  // Set item with optional expiration
  static setItem(key, value, expirationMinutes = null) {
    const item = {
      value: value,
      timestamp: Date.now(),
      expiration: expirationMinutes ? Date.now() + (expirationMinutes * 60 * 1000) : null
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
  
  // Get item and check expiration
  static getItem(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Check if item has expired
      if (parsed.expiration && Date.now() > parsed.expiration) {
        this.removeItem(key);
        return null;
      }
      
      return parsed.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  
  // Remove item
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
  
  // Clear expired items
  static clearExpired() {
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.getItem(key) === null) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => this.removeItem(key));
    return keysToRemove.length;
  }
}

// Example usage
StorageManager.setItem('user', { name: 'John', id: 123 }, 60); // Expires in 1 hour
const user = StorageManager.getItem('user');
console.log(user);`,
            description: 'Local storage manager with expiration support',
            tags: ['localStorage', 'expiration', 'class'],
            documentation: `/**
 * Utility class for managing localStorage with expiration support
 */`
          }
        ],
        advanced: [
          {
            title: 'Advanced Promise Pool',
            code: `// Advanced promise pool with concurrency control
class PromisePool {
  constructor(concurrency = 3) {
    this.concurrency = concurrency;
    this.running = [];
    this.queue = [];
  }
  
  async add(promiseFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promiseFunction,
        resolve,
        reject
      });
      
      this.process();
    });
  }
  
  async process() {
    if (this.running.length >= this.concurrency || this.queue.length === 0) {
      return;
    }
    
    const { promiseFunction, resolve, reject } = this.queue.shift();
    
    const promise = promiseFunction()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running = this.running.filter(p => p !== promise);
        this.process();
      });
    
    this.running.push(promise);
    this.process();
  }
  
  async all(promiseFunctions) {
    const promises = promiseFunctions.map(fn => this.add(fn));
    return Promise.all(promises);
  }
  
  async drain() {
    return Promise.all(this.running);
  }
  
  size() {
    return this.queue.length + this.running.length;
  }
  
  clear() {
    this.queue = [];
  }
}

// Example usage
const pool = new PromisePool(2); // Max 2 concurrent operations

const fetchUrls = [
  'https://api.example.com/data1',
  'https://api.example.com/data2',
  'https://api.example.com/data3',
  'https://api.example.com/data4'
];

const promiseFunctions = fetchUrls.map(url => 
  () => fetch(url).then(res => res.json())
);

pool.all(promiseFunctions)
  .then(results => console.log('All requests completed:', results))
  .catch(error => console.error('Error:', error));`,
            description: 'Advanced promise pool with configurable concurrency',
            tags: ['promises', 'concurrency', 'async', 'pool'],
            documentation: `/**
 * Promise pool that limits the number of concurrent promise executions
 * Useful for rate limiting API calls or controlling resource usage
 */`
          }
        ]
      },
      class: {
        medium: [
          {
            title: 'Event Emitter Class',
            code: `// Custom event emitter implementation
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  // Add event listener
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return this; // For chaining
  }
  
  // Add one-time event listener
  once(eventName, callback) {
    const onceWrapper = (...args) => {
      callback(...args);
      this.off(eventName, onceWrapper);
    };
    this.on(eventName, onceWrapper);
    return this;
  }
  
  // Remove event listener
  off(eventName, callback) {
    if (!this.events[eventName]) return this;
    
    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
    return this;
  }
  
  // Emit event
  emit(eventName, ...args) {
    if (!this.events[eventName]) return false;
    
    this.events[eventName].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(\`Error in event listener for '\${eventName}':\`, error);
      }
    });
    
    return true;
  }
  
  // Remove all listeners
  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
    return this;
  }
  
  // Get listener count
  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }
}

// Example usage
const emitter = new EventEmitter();

emitter.on('user:login', (user) => {
  console.log(\`User \${user.name} logged in\`);
});

emitter.once('app:start', () => {
  console.log('Application started');
});

emitter.emit('user:login', { name: 'John', id: 123 });
emitter.emit('app:start');`,
            description: 'Custom event emitter with full functionality',
            tags: ['events', 'observer', 'class'],
            documentation: `/**
 * Custom EventEmitter implementation
 * Provides pub/sub functionality for decoupled communication
 */`
          }
        ]
      }
    },
    python: {
      function: {
        beginner: [
          {
            title: 'List Utilities',
            code: `# List utility functions
def find_duplicates(lst):
    """Find duplicate elements in a list"""
    seen = set()
    duplicates = set()
    
    for item in lst:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    
    return list(duplicates)

def chunk_list(lst, chunk_size):
    """Split list into chunks of specified size"""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

def flatten_list(nested_list):
    """Flatten a nested list"""
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten_list(item))
        else:
            result.append(item)
    return result

# Example usage
numbers = [1, 2, 3, 2, 4, 5, 3]
print(f"Duplicates: {find_duplicates(numbers)}")
print(f"Chunks: {chunk_list(numbers, 3)}")

nested = [1, [2, 3], [4, [5, 6]], 7]
print(f"Flattened: {flatten_list(nested)}")`,
            description: 'Common list manipulation utilities',
            tags: ['list', 'utilities', 'data-structures'],
            documentation: `"""
List utility functions for common operations
Includes duplicate finding, chunking, and flattening
"""`
          }
        ],
        medium: [
          {
            title: 'Decorator Examples',
            code: `# Useful Python decorators
import time
import functools
from typing import Callable, Any

def timing_decorator(func: Callable) -> Callable:
    """Decorator to measure function execution time"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

def retry(max_attempts: int = 3, delay: float = 1.0):
    """Decorator to retry function on failure"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay} seconds...")
                        time.sleep(delay)
                    else:
                        print(f"All {max_attempts} attempts failed.")
            
            raise last_exception
        return wrapper
    return decorator

def cache_result(func: Callable) -> Callable:
    """Simple caching decorator"""
    cache = {}
    
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Create cache key from arguments
        key = str(args) + str(sorted(kwargs.items()))
        
        if key in cache:
            print(f"Cache hit for {func.__name__}")
            return cache[key]
        
        print(f"Cache miss for {func.__name__}")
        result = func(*args, **kwargs)
        cache[key] = result
        return result
    
    return wrapper

# Example usage
@timing_decorator
@retry(max_attempts=3, delay=0.5)
def unreliable_api_call(success_rate: float = 0.7):
    """Simulates an unreliable API call"""
    import random
    if random.random() < success_rate:
        return "Success!"
    else:
        raise Exception("API call failed")

@cache_result
def expensive_calculation(n: int) -> int:
    """Simulates an expensive calculation"""
    time.sleep(1)  # Simulate processing time
    return n ** 2

# Test the decorators
try:
    result = unreliable_api_call(0.3)
    print(f"API Result: {result}")
except Exception as e:
    print(f"Final error: {e}")

# Test caching
print(expensive_calculation(5))  # Cache miss
print(expensive_calculation(5))  # Cache hit`,
            description: 'Useful Python decorators for timing, retry, and caching',
            tags: ['decorators', 'timing', 'retry', 'cache'],
            documentation: `"""
Collection of useful Python decorators:
- timing_decorator: Measures function execution time
- retry: Retries function on failure with configurable attempts
- cache_result: Simple memoization decorator
"""`
          }
        ]
      }
    }
  }

  const generateSnippet = async () => {
    setIsGenerating(true)
    
    try {
      const langTemplates = codeTemplates[config.language as keyof typeof codeTemplates] || {}
      const categoryTemplates = langTemplates[config.category as keyof typeof langTemplates] || {}
      const complexityTemplates = categoryTemplates[config.complexity as keyof typeof categoryTemplates] || []
      
      if (complexityTemplates.length === 0) {
        // Generate a simple placeholder if no templates available
        const placeholder = generatePlaceholderSnippet()
        setGeneratedSnippets([placeholder, ...generatedSnippets.slice(0, 9)])
        return
      }
      
      const randomTemplate = complexityTemplates[Math.floor(Math.random() * complexityTemplates.length)]
      
      // Process the code with custom options
      let processedCode = randomTemplate.code
      
      // Apply variable prefix if specified
      if (config.variablePrefix) {
        processedCode = processedCode.replace(/\b(let|const|var)\s+(\w+)/g, 
          `$1 ${config.variablePrefix}$2`)
      }
      
      // Add or remove comments based on preference
      if (!config.includeComments) {
        processedCode = processedCode.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
      }
      
      const newSnippet: GeneratedSnippet = {
        id: `snippet_${Date.now()}`,
        language: config.language,
        category: config.category,
        title: randomTemplate.title,
        code: processedCode.trim(),
        description: randomTemplate.description,
        documentation: config.includeDocumentation ? randomTemplate.documentation || '' : '',
        complexity: config.complexity,
        tags: randomTemplate.tags || [],
        timestamp: new Date()
      }
      
      setGeneratedSnippets([newSnippet, ...generatedSnippets.slice(0, 9)]) // Keep last 10 snippets
      
    } catch (error) {
      console.error('Error generating snippet:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePlaceholderSnippet = (): GeneratedSnippet => {
    const templates = {
      javascript: `// ${config.category} example
function example${config.category.charAt(0).toUpperCase() + config.category.slice(1)}() {
  // TODO: Implement ${config.category} logic
  console.log('Hello from ${config.category}!');
  return true;
}

example${config.category.charAt(0).toUpperCase() + config.category.slice(1)}();`,
      python: `# ${config.category} example
def example_${config.category}():
    """TODO: Implement ${config.category} logic"""
    print(f'Hello from ${config.category}!')
    return True

example_${config.category}()`,
      java: `// ${config.category} example
public class Example${config.category.charAt(0).toUpperCase() + config.category.slice(1)} {
    public static void main(String[] args) {
        System.out.println("Hello from ${config.category}!");
    }
}`
    }

    return {
      id: `placeholder_${Date.now()}`,
      language: config.language,
      category: config.category,
      title: `${config.language.charAt(0).toUpperCase() + config.language.slice(1)} ${config.category} Example`,
      code: templates[config.language as keyof typeof templates] || templates.javascript,
      description: `Basic ${config.category} example in ${config.language}`,
      documentation: '',
      complexity: config.complexity,
      tags: [config.language, config.category, 'example'],
      timestamp: new Date()
    }
  }

  const copySnippet = (snippet: GeneratedSnippet) => {
    const content = snippet.documentation 
      ? `${snippet.documentation}\n\n${snippet.code}`
      : snippet.code
    navigator.clipboard.writeText(content)
  }

  const downloadSnippet = (snippet: GeneratedSnippet) => {
    const language = languages.find(l => l.key === snippet.language)
    const extension = language?.ext || 'txt'
    
    const content = `/*
 * ${snippet.title}
 * ${snippet.description}
 * Language: ${snippet.language}
 * Category: ${snippet.category}
 * Complexity: ${snippet.complexity}
 * Generated: ${snippet.timestamp.toLocaleString()}
 * Tags: ${snippet.tags.join(', ')}
 */

${snippet.documentation ? `${snippet.documentation}\n\n` : ''}${snippet.code}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'beginner' | 'api' | 'utility' | 'advanced') => {
    switch (preset) {
      case 'beginner':
        setConfig({
          language: 'javascript',
          category: 'function',
          complexity: 'beginner',
          includeComments: true,
          includeDocumentation: true,
          variablePrefix: '',
          customTemplate: ''
        })
        break
      case 'api':
        setConfig({
          language: 'javascript',
          category: 'api',
          complexity: 'medium',
          includeComments: true,
          includeDocumentation: false,
          variablePrefix: '',
          customTemplate: ''
        })
        break
      case 'utility':
        setConfig({
          language: 'python',
          category: 'utility',
          complexity: 'medium',
          includeComments: false,
          includeDocumentation: true,
          variablePrefix: '',
          customTemplate: ''
        })
        break
      case 'advanced':
        setConfig({
          language: 'typescript',
          category: 'class',
          complexity: 'advanced',
          includeComments: true,
          includeDocumentation: true,
          variablePrefix: '',
          customTemplate: ''
        })
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Code Snippet Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate ready-to-use code snippets in multiple programming languages. From simple functions to advanced patterns!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Braces className="h-5 w-5" />
                  Snippet Configuration
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your code snippet parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 编程语言 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Programming Language</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {languages.map(lang => (
                      <button
                        key={lang.key}
                        onClick={() => setConfig(prev => ({ ...prev, language: lang.key }))}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          config.language === lang.key
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{lang.icon}</span>
                          <span className="text-xs font-medium">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 代码类别 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Code Category</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <button
                        key={category.key}
                        onClick={() => setConfig(prev => ({ ...prev, category: category.key }))}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          config.category === category.key
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{category.icon}</span>
                          <span className="text-xs font-medium">{category.name}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {category.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 复杂度 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Complexity Level</Label>
                  <div className="space-y-2">
                    {complexityLevels.map(level => (
                      <label
                        key={level.key}
                        className="flex items-center gap-2 text-white cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="complexity"
                          value={level.key}
                          checked={config.complexity === level.key}
                          onChange={(e) => setConfig(prev => ({ ...prev, complexity: e.target.value }))}
                          className="rounded"
                        />
                        <div>
                          <span className="text-sm font-medium">{level.name}</span>
                          <div className="text-xs text-slate-400">{level.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 生成选项 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Generation Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeComments}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeComments: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include code comments</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={config.includeDocumentation}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeDocumentation: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Include documentation</span>
                    </label>
                  </div>
                </div>

                {/* 变量前缀 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Variable Prefix (Optional)</Label>
                  <Input
                    value={config.variablePrefix}
                    onChange={(e) => setConfig(prev => ({ ...prev, variablePrefix: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="e.g., my, temp, user"
                  />
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('beginner')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🎯 Beginner
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('api')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌐 API
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('utility')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🔧 Utility
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('advanced')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🚀 Advanced
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generateSnippet}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Code className="h-4 w-4 mr-2" />
                      Generate Snippet
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的代码片段 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedSnippets.length > 0 ? (
              generatedSnippets.map((snippet, index) => (
                <Card key={snippet.id} className="bg-white/10 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FileCode className="h-5 w-5 text-blue-400" />
                          {snippet.title}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {snippet.language} • {snippet.category} • {snippet.complexity}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copySnippet(snippet)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadSnippet(snippet)}
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
                    {/* 描述 */}
                    <p className="text-slate-300 text-sm mb-4">{snippet.description}</p>

                    {/* 文档 */}
                    {snippet.documentation && (
                      <div className="bg-slate-800 border border-white/20 rounded p-3 mb-4">
                        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                          {snippet.documentation}
                        </pre>
                      </div>
                    )}

                    {/* 代码 */}
                    <div className="bg-slate-900 border border-white/20 rounded p-4 mb-4">
                      <pre className="text-white font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                        {snippet.code}
                      </pre>
                    </div>

                    {/* 标签和信息 */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {snippet.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        Generated {snippet.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate code snippets?</p>
                  <p>Select your preferences and click "Generate Snippet"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Code Snippet Generator Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">12 Programming Languages</h4>
                    <p className="text-sm">Generate snippets in JavaScript, Python, Java, C#, Go, Rust, and more with language-specific patterns.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">10 Code Categories</h4>
                    <p className="text-sm">From simple functions to complex algorithms, API calls, database operations, and testing patterns.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Complexity Levels</h4>
                    <p className="text-sm">Choose from beginner-friendly examples to advanced production-ready code patterns.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Perfect For:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Learning new languages</li>
                      <li>Quick prototyping</li>
                      <li>Code templates</li>
                      <li>Best practices</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Development workflow</li>
                      <li>Code examples</li>
                      <li>Educational content</li>
                      <li>Project starters</li>
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