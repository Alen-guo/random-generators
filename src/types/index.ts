// 随机生成器类型
export interface GeneratorConfig {
    id: string
    name: string
    description: string
    category: GeneratorCategory
    icon: string
    featured: boolean
}

export type GeneratorCategory =
    | 'numbers'
    | 'text'
    | 'names'
    | 'colors'
    | 'lifestyle'
    | 'creative'
    | 'tools'

// 随机数生成器配置
export interface NumberGeneratorConfig {
    min: number
    max: number
    count: number
    allowDuplicates: boolean
    format: 'integer' | 'decimal'
    decimals?: number
}

// 随机姓名生成器配置
export interface NameGeneratorConfig {
    gender: 'male' | 'female' | 'any'
    origin: 'american' | 'chinese' | 'european' | 'global'
    includeLastName: boolean
    count: number
}

// 姓名生成器配置
export interface NameConfig {
    gender: 'male' | 'female' | 'mixed'
    origin: string
    includeMiddleName: boolean
    format: 'full' | 'first' | 'last'
}

// 随机密码生成器配置
export interface PasswordGeneratorConfig {
    length: number
    includeUppercase: boolean
    includeLowercase: boolean
    includeNumbers: boolean
    includeSymbols: boolean
    excludeSimilar: boolean
}

// 密码配置
export interface PasswordConfig {
    length: number
    includeLowercase: boolean
    includeUppercase: boolean
    includeNumbers: boolean
    includeSymbols: boolean
    excludeSimilar: boolean
    excludeAmbiguous: boolean
}

// 生成结果
export interface GenerationResult<T = any> {
    id: string
    generatorId: string
    result: T
    timestamp: Date
    config: any
}

// 用户历史记录
export interface UserHistory {
    results: GenerationResult[]
    favorites: string[]
}