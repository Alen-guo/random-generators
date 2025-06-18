import { NumberGeneratorConfig } from '@/types'

export class NumberGenerator {
    static generate(config: NumberGeneratorConfig): number[] {
        const { min, max, count, allowDuplicates, format, decimals = 2 } = config
        const results: number[] = []
        const usedNumbers = new Set<number>()

        for (let i = 0; i < count; i++) {
            let number: number

            if (!allowDuplicates && usedNumbers.size >= (max - min + 1)) {
                // 如果不允许重复且已经生成了所有可能的数字，跳出循环
                break
            }

            do {
                if (format === 'integer') {
                    number = Math.floor(Math.random() * (max - min + 1)) + min
                } else {
                    number = Math.random() * (max - min) + min
                    number = Number(number.toFixed(decimals))
                }
            } while (!allowDuplicates && usedNumbers.has(number))

            results.push(number)
            if (!allowDuplicates) {
                usedNumbers.add(number)
            }
        }

        return results
    }

    static generateSingle(min: number = 0, max: number = 100): number {
        return this.generate({
            min,
            max,
            count: 1,
            allowDuplicates: true,
            format: 'integer'
        })[0]
    }

    static generateRange(count: number, min: number = 0, max: number = 100): number[] {
        return this.generate({
            min,
            max,
            count,
            allowDuplicates: true,
            format: 'integer'
        })
    }

    static generateDecimal(min: number = 0, max: number = 1, decimals: number = 2): number {
        return this.generate({
            min,
            max,
            count: 1,
            allowDuplicates: true,
            format: 'decimal',
            decimals
        })[0]
    }
} 