import { NameGeneratorConfig } from '@/types'

// 姓名数据库
const nameData = {
    american: {
        male: {
            first: [
                'James', 'Robert', 'John', 'Michael', 'William', 'David', 'Richard', 'Joseph',
                'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark',
                'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian',
                'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan'
            ],
            last: [
                'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
                'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
                'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
                'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
            ]
        },
        female: {
            first: [
                'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
                'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra',
                'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly',
                'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen'
            ],
            last: [
                'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
                'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
                'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
                'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
            ]
        }
    },
    chinese: {
        male: {
            first: [
                'Wei', 'Ming', 'Jun', 'Hao', 'Jie', 'Yu', 'Bin', 'Qiang', 'Lei', 'Tao',
                'Yang', 'Peng', 'Gang', 'Long', 'Feng', 'Kai', 'Dong', 'Bo', 'Hui', 'Fei'
            ],
            last: [
                'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
                'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Lin', 'Luo', 'Song'
            ]
        },
        female: {
            first: [
                'Li', 'Mei', 'Yan', 'Ying', 'Na', 'Jing', 'Min', 'Xue', 'Hong', 'Qing',
                'Fang', 'Hua', 'Yun', 'Xia', 'Juan', 'Rui', 'Ping', 'Lan', 'Yu', 'Ning'
            ],
            last: [
                'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
                'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Lin', 'Luo', 'Song'
            ]
        }
    },
    european: {
        male: {
            first: [
                'Alexander', 'Maximilian', 'Sebastian', 'Leonardo', 'Antonio', 'Francesco',
                'Marco', 'Matteo', 'Lorenzo', 'Giovanni', 'Luca', 'Andrea', 'Alessandro',
                'Gabriel', 'Rafael', 'Nicolas', 'Julian', 'Samuel', 'Benjamin', 'Felix'
            ],
            last: [
                'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
                'Becker', 'Schulz', 'Hoffmann', 'Rossi', 'Ferrari', 'Esposito', 'Bianchi',
                'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno'
            ]
        },
        female: {
            first: [
                'Sophia', 'Emma', 'Olivia', 'Isabella', 'Mia', 'Charlotte', 'Amelia',
                'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
                'Ella', 'Scarlett', 'Grace', 'Victoria', 'Riley', 'Aria'
            ],
            last: [
                'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
                'Becker', 'Schulz', 'Hoffmann', 'Rossi', 'Ferrari', 'Esposito', 'Bianchi',
                'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno'
            ]
        }
    }
}

export class NameGenerator {
    static generate(config: NameGeneratorConfig): string[] {
        const { gender, origin, includeLastName, count } = config
        const results: string[] = []

        for (let i = 0; i < count; i++) {
            const selectedGender = gender === 'any'
                ? Math.random() > 0.5 ? 'male' : 'female'
                : gender

            const selectedOrigin = origin === 'global'
                ? this.getRandomOrigin()
                : origin

            const firstName = this.getRandomFromArray(
                nameData[selectedOrigin][selectedGender].first
            )

            let fullName = firstName

            if (includeLastName) {
                const lastName = this.getRandomFromArray(
                    nameData[selectedOrigin][selectedGender].last
                )
                fullName = `${firstName} ${lastName}`
            }

            results.push(fullName)
        }

        return results
    }

    static generateSingle(
        gender: 'male' | 'female' | 'any' = 'any',
        includeLastName: boolean = true
    ): string {
        return this.generate({
            gender,
            origin: 'global',
            includeLastName,
            count: 1
        })[0]
    }

    private static getRandomOrigin(): 'american' | 'chinese' | 'european' {
        const origins = ['american', 'chinese', 'european'] as const
        return origins[Math.floor(Math.random() * origins.length)]
    }

    private static getRandomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
    }
} 