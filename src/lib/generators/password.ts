import { PasswordGeneratorConfig } from '@/types'

export class PasswordGenerator {
    private static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    private static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
    private static readonly NUMBERS = '0123456789'
    private static readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    private static readonly SIMILAR_CHARS = 'il1Lo0O'

    static generate(config: PasswordGeneratorConfig): string {
        const {
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols,
            excludeSimilar
        } = config

        let charset = ''

        // 构建字符集
        if (includeUppercase) {
            charset += excludeSimilar
                ? this.UPPERCASE.replace(/[LO]/g, '')
                : this.UPPERCASE
        }

        if (includeLowercase) {
            charset += excludeSimilar
                ? this.LOWERCASE.replace(/[il]/g, '')
                : this.LOWERCASE
        }

        if (includeNumbers) {
            charset += excludeSimilar
                ? this.NUMBERS.replace(/[10]/g, '')
                : this.NUMBERS
        }

        if (includeSymbols) {
            charset += this.SYMBOLS
        }

        if (charset === '') {
            throw new Error('At least one character type must be selected')
        }

        // 确保每种选中的字符类型至少包含一个字符
        let password = ''
        const requiredChars: string[] = []

        if (includeUppercase) {
            const upperChars = excludeSimilar
                ? this.UPPERCASE.replace(/[LO]/g, '')
                : this.UPPERCASE
            requiredChars.push(this.getRandomChar(upperChars))
        }

        if (includeLowercase) {
            const lowerChars = excludeSimilar
                ? this.LOWERCASE.replace(/[il]/g, '')
                : this.LOWERCASE
            requiredChars.push(this.getRandomChar(lowerChars))
        }

        if (includeNumbers) {
            const numberChars = excludeSimilar
                ? this.NUMBERS.replace(/[10]/g, '')
                : this.NUMBERS
            requiredChars.push(this.getRandomChar(numberChars))
        }

        if (includeSymbols) {
            requiredChars.push(this.getRandomChar(this.SYMBOLS))
        }

        // 填充剩余长度
        for (let i = requiredChars.length; i < length; i++) {
            requiredChars.push(this.getRandomChar(charset))
        }

        // 随机打乱顺序
        password = this.shuffleArray(requiredChars).join('')

        return password
    }

    static generateMultiple(config: PasswordGeneratorConfig, count: number): string[] {
        const passwords: string[] = []
        for (let i = 0; i < count; i++) {
            passwords.push(this.generate(config))
        }
        return passwords
    }

    static generateSimple(length: number = 12): string {
        return this.generate({
            length,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: false,
            excludeSimilar: true
        })
    }

    static generateSecure(length: number = 16): string {
        return this.generate({
            length,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true,
            excludeSimilar: true
        })
    }

    private static getRandomChar(charset: string): string {
        return charset.charAt(Math.floor(Math.random() * charset.length))
    }

    private static shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    static estimateStrength(password: string): {
        score: number
        strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
        feedback: string[]
    } {
        let score = 0
        const feedback: string[] = []

        // 长度检查
        if (password.length >= 8) score += 2
        else feedback.push('Use at least 8 characters')

        if (password.length >= 12) score += 1
        if (password.length >= 16) score += 1

        // 字符类型检查
        if (/[a-z]/.test(password)) score += 1
        else feedback.push('Add lowercase letters')

        if (/[A-Z]/.test(password)) score += 1
        else feedback.push('Add uppercase letters')

        if (/[0-9]/.test(password)) score += 1
        else feedback.push('Add numbers')

        if (/[^a-zA-Z0-9]/.test(password)) score += 2
        else feedback.push('Add special characters')

        // 重复字符检查
        if (!/(.)\1{2,}/.test(password)) score += 1
        else feedback.push('Avoid repeating characters')

        const strengthMap = {
            0: 'Very Weak',
            1: 'Very Weak',
            2: 'Weak',
            3: 'Weak',
            4: 'Fair',
            5: 'Fair',
            6: 'Good',
            7: 'Good',
            8: 'Strong',
            9: 'Strong'
        } as const

        const strength = strengthMap[Math.min(score, 9) as keyof typeof strengthMap]

        return { score, strength, feedback }
    }
} 