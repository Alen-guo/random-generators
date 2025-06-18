"use client"

import { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, RefreshCw, Copy, Download, Globe, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

interface PhoneConfig {
  country: string
  format: 'international' | 'national' | 'both'
  includeAreaCode: boolean
  includeExtension: boolean
  extensionRange: [number, number]
  phoneType: 'any' | 'mobile' | 'landline' | 'toll_free'
  count: number
  duplicates: boolean
}

interface GeneratedPhone {
  id: string
  number: string
  international: string
  national: string
  areaCode: string
  extension?: number
  type: 'mobile' | 'landline' | 'toll_free'
  country: string
  valid: boolean
}

export default function PhonesPage() {
  const [config, setConfig] = useState<PhoneConfig>({
    country: 'us',
    format: 'both',
    includeAreaCode: true,
    includeExtension: false,
    extensionRange: [1000, 9999],
    phoneType: 'any',
    count: 10,
    duplicates: false
  })
  const [generatedPhones, setGeneratedPhones] = useState<GeneratedPhone[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const countries = [
    {
      code: 'us',
      name: 'United States',
      countryCode: '+1',
      format: 'XXX-XXX-XXXX',
      areaCodes: ['201', '202', '203', '205', '206', '207', '208', '209', '210', '212', '213', '214', '215', '216', '217', '218', '219', '224', '225', '228', '229', '231', '234', '239', '240', '248', '251', '252', '253', '254', '256', '260', '262', '267', '269', '270', '272', '276', '281', '283', '301', '302', '303', '304', '305', '307', '308', '309', '310', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '323', '325', '330', '331', '334', '336', '337', '339', '341', '347', '351', '352', '360', '361', '364', '380', '385', '386', '401', '402', '404', '405', '406', '407', '408', '409', '410', '412', '413', '414', '415', '417', '419', '423', '424', '425', '430', '432', '434', '435', '440', '442', '443', '445', '458', '469', '470', '475', '478', '479', '480', '484', '501', '502', '503', '504', '505', '507', '508', '509', '510', '512', '513', '515', '516', '517', '518', '520', '530', '540', '541', '551', '559', '561', '562', '563', '564', '567', '570', '571', '573', '574', '575', '580', '585', '586', '601', '602', '603', '605', '606', '607', '608', '609', '610', '612', '614', '615', '616', '617', '618', '619', '620', '623', '626', '628', '629', '630', '631', '636', '641', '646', '650', '651', '657', '660', '661', '662', '667', '669', '678', '681', '682', '684', '689', '701', '702', '703', '704', '706', '707', '708', '712', '713', '714', '715', '716', '717', '718', '719', '720', '724', '725', '727', '731', '732', '734', '737', '740', '747', '754', '757', '760', '762', '763', '765', '770', '772', '773', '774', '775', '779', '781', '785', '786', '787', '801', '802', '803', '804', '805', '806', '808', '810', '812', '813', '814', '815', '816', '817', '818', '828', '830', '831', '832', '843', '845', '847', '848', '850', '856', '857', '858', '859', '860', '862', '863', '864', '865', '870', '872', '878', '901', '903', '904', '906', '907', '908', '909', '910', '912', '913', '914', '915', '916', '917', '918', '919', '920', '925', '928', '929', '930', '931', '934', '936', '937', '940', '941', '947', '949', '951', '952', '954', '956', '957', '959', '970', '971', '972', '973', '978', '979', '980', '984', '985', '989'],
      mobileAreaCodes: ['201', '202', '203', '209', '213', '224', '240', '267', '301', '310', '312', '323', '347', '404', '415', '424', '442', '470', '510', '551', '562', '571', '646', '669', '678', '702', '714', '747', '754', '786', '818', '832', '848', '857', '862', '917', '929', '949', '954', '972', '984'],
      tollFreeAreaCodes: ['800', '833', '844', '855', '866', '877', '888']
    },
    {
      code: 'uk',
      name: 'United Kingdom',
      countryCode: '+44',
      format: 'XXXX XXX XXXX',
      areaCodes: ['20', '121', '131', '141', '151', '161', '191', '1202', '1203', '1204', '1205', '1206', '1207', '1208', '1209', '1223', '1224', '1225', '1226', '1227', '1228', '1229', '1233', '1234', '1235', '1236', '1237', '1239', '1241', '1242', '1243', '1244', '1245', '1246', '1248', '1249', '1250', '1252', '1253', '1254', '1255', '1256', '1257', '1258', '1259', '1260', '1261', '1262', '1263', '1264', '1267', '1268', '1269', '1270', '1271', '1272', '1273', '1274', '1275', '1276', '1277', '1278', '1279', '1280', '1282', '1283', '1284', '1285', '1286', '1287', '1288', '1289', '1290', '1291', '1292', '1293', '1294', '1295', '1296', '1297', '1298', '1299'],
      mobileAreaCodes: ['74', '75', '76', '77', '78', '79'],
      tollFreeAreaCodes: ['800', '808']
    },
    {
      code: 'ca',
      name: 'Canada',
      countryCode: '+1',
      format: 'XXX-XXX-XXXX',
      areaCodes: ['204', '236', '249', '250', '289', '306', '343', '365', '403', '416', '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587', '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807', '819', '825', '867', '873', '902', '905'],
      mobileAreaCodes: ['236', '249', '289', '343', '365', '431', '437', '438', '548', '579', '581', '587', '639', '647', '672', '742', '778', '825', '873'],
      tollFreeAreaCodes: ['800', '833', '844', '855', '866', '877', '888']
    },
    {
      code: 'au',
      name: 'Australia',
      countryCode: '+61',
      format: 'XXXX XXX XXX',
      areaCodes: ['2', '3', '4', '7', '8'],
      mobileAreaCodes: ['4'],
      tollFreeAreaCodes: ['1800']
    },
    {
      code: 'de',
      name: 'Germany',
      countryCode: '+49',
      format: 'XXX XXXXXXX',
      areaCodes: ['30', '40', '89', '69', '221', '211', '231', '201', '203', '208', '209', '228', '241', '251', '261', '271', '281', '291', '351', '361', '371', '381', '391', '421', '431', '451', '461', '471', '511', '521', '531', '541', '551', '561', '571', '581', '591', '611', '621', '631', '641', '651', '661', '671', '681', '691', '711', '721', '731', '741', '751', '761', '771', '781', '791', '821', '831', '841', '851', '861', '871', '881', '891', '911', '921', '931', '941', '951', '961', '971', '981', '991'],
      mobileAreaCodes: ['15', '16', '17'],
      tollFreeAreaCodes: ['800']
    },
    {
      code: 'fr',
      name: 'France',
      countryCode: '+33',
      format: 'XX XX XX XX XX',
      areaCodes: ['1', '2', '3', '4', '5'],
      mobileAreaCodes: ['6', '7'],
      tollFreeAreaCodes: ['800']
    },
    {
      code: 'jp',
      name: 'Japan',
      countryCode: '+81',
      format: 'XXX-XXXX-XXXX',
      areaCodes: ['3', '6', '45', '52', '75', '78', '92', '95', '96', '97', '98'],
      mobileAreaCodes: ['80', '90'],
      tollFreeAreaCodes: ['120', '800']
    },
    {
      code: 'cn',
      name: 'China',
      countryCode: '+86',
      format: 'XXX XXXX XXXX',
      areaCodes: ['10', '20', '21', '22', '23', '24', '25', '27', '28', '29'],
      mobileAreaCodes: ['13', '14', '15', '16', '17', '18', '19'],
      tollFreeAreaCodes: ['400', '800']
    }
  ]

  const getCurrentCountry = () => countries.find(c => c.code === config.country) || countries[0]

  const generateRandomDigits = (length: number): string => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
  }

  const generatePhoneNumber = (country: any, type: string): { number: string, areaCode: string, type: 'mobile' | 'landline' | 'toll_free' } => {
    let areaCode: string
    let phoneType: 'mobile' | 'landline' | 'toll_free'
    
    if (type === 'mobile' && country.mobileAreaCodes.length > 0) {
      areaCode = country.mobileAreaCodes[Math.floor(Math.random() * country.mobileAreaCodes.length)]
      phoneType = 'mobile'
    } else if (type === 'toll_free' && country.tollFreeAreaCodes.length > 0) {
      areaCode = country.tollFreeAreaCodes[Math.floor(Math.random() * country.tollFreeAreaCodes.length)]
      phoneType = 'toll_free'
    } else if (type === 'landline' || (type === 'mobile' && country.mobileAreaCodes.length === 0)) {
      const landlineAreaCodes = country.areaCodes.filter((code: string) => 
        !country.mobileAreaCodes.includes(code) && !country.tollFreeAreaCodes.includes(code)
      )
      areaCode = landlineAreaCodes.length > 0 
        ? landlineAreaCodes[Math.floor(Math.random() * landlineAreaCodes.length)]
        : country.areaCodes[Math.floor(Math.random() * country.areaCodes.length)]
      phoneType = 'landline'
    } else {
      // 随机选择
      const allAreaCodes = country.areaCodes
      areaCode = allAreaCodes[Math.floor(Math.random() * allAreaCodes.length)]
      
      if (country.mobileAreaCodes.includes(areaCode)) {
        phoneType = 'mobile'
      } else if (country.tollFreeAreaCodes.includes(areaCode)) {
        phoneType = 'toll_free'
      } else {
        phoneType = 'landline'
      }
    }
    
    // 生成剩余数字
    let remainingDigits: string
    switch (country.code) {
      case 'us':
      case 'ca':
        // 美国和加拿大：XXX-XXX-XXXX
        remainingDigits = generateRandomDigits(3) + generateRandomDigits(4)
        break
      case 'uk':
        // 英国：根据区号长度决定
        const ukRemainingLength = areaCode.length === 2 ? 8 : 7
        remainingDigits = generateRandomDigits(ukRemainingLength)
        break
      case 'au':
        // 澳大利亚：XXXX XXX XXX
        remainingDigits = generateRandomDigits(7)
        break
      case 'de':
        // 德国：变长格式
        remainingDigits = generateRandomDigits(7)
        break
      case 'fr':
        // 法国：XX XX XX XX XX
        remainingDigits = generateRandomDigits(8)
        break
      case 'jp':
        // 日本：XXX-XXXX-XXXX
        remainingDigits = generateRandomDigits(8)
        break
      case 'cn':
        // 中国：XXX XXXX XXXX
        remainingDigits = generateRandomDigits(8)
        break
      default:
        remainingDigits = generateRandomDigits(7)
    }
    
    const fullNumber = areaCode + remainingDigits
    return { number: fullNumber, areaCode, type: phoneType }
  }

  const formatPhoneNumber = (number: string, country: any, format: 'international' | 'national'): string => {
    if (format === 'international') {
      return `${country.countryCode} ${number}`
    }
    
    // 国内格式
    switch (country.code) {
      case 'us':
      case 'ca':
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`
      case 'uk':
        if (number.length === 10) {
          return `${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`
        } else {
          return `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`
        }
      case 'au':
        return `${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`
      case 'de':
        return `${number.slice(0, 3)} ${number.slice(3)}`
      case 'fr':
        return `${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)} ${number.slice(6, 8)} ${number.slice(8)}`
      case 'jp':
        return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`
      case 'cn':
        return `${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`
      default:
        return number
    }
  }

  const validatePhoneNumber = (number: string, country: any): boolean => {
    // 简化的验证逻辑
    const expectedLength: Record<string, number> = {
      'us': 10, 'ca': 10, 'uk': 10, 'au': 9, 
      'de': 10, 'fr': 10, 'jp': 11, 'cn': 11
    }
    
    return number.length === (expectedLength[country.code] || 10)
  }

  const generatePhones = async () => {
    setIsGenerating(true)
    
    try {
      const country = getCurrentCountry()
      const phones: GeneratedPhone[] = []
      const usedNumbers = new Set<string>()
      let attempts = 0
      const maxAttempts = config.count * 10
      
      while (phones.length < config.count && attempts < maxAttempts) {
        attempts++
        
        let selectedType: 'mobile' | 'landline' | 'toll_free' = 'mobile'
        if (config.phoneType === 'any') {
          const types: ('mobile' | 'landline' | 'toll_free')[] = ['mobile', 'landline', 'toll_free']
          selectedType = types[Math.floor(Math.random() * types.length)]
        } else {
          selectedType = config.phoneType as 'mobile' | 'landline' | 'toll_free'
        }
        
        const { number, areaCode, type } = generatePhoneNumber(country, selectedType)
        
        // 检查重复
        if (!config.duplicates && usedNumbers.has(number)) {
          continue
        }
        
        const international = formatPhoneNumber(number, country, 'international')
        const national = formatPhoneNumber(number, country, 'national')
        const valid = validatePhoneNumber(number, country)
        
        let extension: number | undefined
        if (config.includeExtension) {
          extension = Math.floor(
            Math.random() * (config.extensionRange[1] - config.extensionRange[0] + 1)
          ) + config.extensionRange[0]
        }
        
        phones.push({
          id: `phone_${Date.now()}_${phones.length}`,
          number,
          international,
          national,
          areaCode,
          extension,
          type,
          country: country.name,
          valid
        })
        
        usedNumbers.add(number)
        await new Promise(resolve => setTimeout(resolve, 1))
      }
      
      setGeneratedPhones(phones)
      
    } catch (error) {
      console.error('Error generating phone numbers:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyPhones = () => {
    const format = config.format === 'international' ? 'international' : 
                   config.format === 'national' ? 'national' : 'both'
    
    let content: string
    if (format === 'both') {
      content = generatedPhones.map(phone => 
        `${phone.national} | ${phone.international}${phone.extension ? ` ext. ${phone.extension}` : ''}`
      ).join('\n')
    } else {
      content = generatedPhones.map(phone => 
        phone[format as keyof GeneratedPhone] + (phone.extension ? ` ext. ${phone.extension}` : '')
      ).join('\n')
    }
    
    navigator.clipboard.writeText(content)
  }

  const downloadPhones = () => {
    const content = `Random Phone Numbers
Generated: ${new Date().toLocaleString()}
Country: ${getCurrentCountry().name}
Format: ${config.format}
Phone Type: ${config.phoneType}
Include Area Code: ${config.includeAreaCode}
Include Extension: ${config.includeExtension}
Count: ${generatedPhones.length}

National Format,International Format,Area Code,Type,Extension,Valid
${generatedPhones.map(phone => 
  `"${phone.national}","${phone.international}","${phone.areaCode}","${phone.type}","${phone.extension || ''}","${phone.valid}"`
).join('\n')}`

    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `random-phones-${config.country}-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const loadPreset = (preset: 'us_mobile' | 'uk_landline' | 'global_mix' | 'toll_free') => {
    switch (preset) {
      case 'us_mobile':
        setConfig(prev => ({ 
          ...prev, 
          country: 'us',
          phoneType: 'mobile',
          format: 'both',
          count: 15,
          includeExtension: false
        }))
        break
      case 'uk_landline':
        setConfig(prev => ({ 
          ...prev, 
          country: 'uk',
          phoneType: 'landline',
          format: 'national',
          count: 10,
          includeExtension: true
        }))
        break
      case 'global_mix':
        setConfig(prev => ({ 
          ...prev, 
          phoneType: 'any',
          format: 'international',
          count: 20,
          includeExtension: false
        }))
        break
      case 'toll_free':
        setConfig(prev => ({ 
          ...prev, 
          country: 'us',
          phoneType: 'toll_free',
          format: 'both',
          count: 8,
          includeExtension: true
        }))
        break
    }
  }

  const typeIcons = {
    mobile: '📱',
    landline: '☎️',
    toll_free: '🆓'
  }

  const typeColors = {
    mobile: 'from-blue-400 to-blue-500',
    landline: 'from-green-400 to-green-500',
    toll_free: 'from-purple-400 to-purple-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Phone Number Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate realistic phone numbers for multiple countries and formats. Perfect for testing, development, and data generation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  Phone Settings
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure phone number generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 国家 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Country</Label>
                  <Select value={config.country} onValueChange={(value) => setConfig(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.countryCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400">
                    Format: {getCurrentCountry().format}
                  </p>
                </div>

                {/* 电话类型 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Phone Type</Label>
                  <Select value={config.phoneType} onValueChange={(value: any) => setConfig(prev => ({ ...prev, phoneType: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">📞 Any Type</SelectItem>
                      <SelectItem value="mobile">📱 Mobile Only</SelectItem>
                      <SelectItem value="landline">☎️ Landline Only</SelectItem>
                      <SelectItem value="toll_free">🆓 Toll-Free Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 格式 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Output Format</Label>
                  <Select value={config.format} onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National Format</SelectItem>
                      <SelectItem value="international">International Format</SelectItem>
                      <SelectItem value="both">Both Formats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 数量 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Count</Label>
                  <Input
                    type="number"
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ ...prev, count: Math.max(1, Math.min(100, parseInt(e.target.value) || 10)) }))}
                    className="bg-white/10 border-white/20 text-white"
                    min="1"
                    max="100"
                  />
                </div>

                {/* 选项 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeAreaCode"
                      checked={config.includeAreaCode}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeAreaCode: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="includeAreaCode" className="text-slate-300">Include Area Code</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeExtension"
                      checked={config.includeExtension}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeExtension: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="includeExtension" className="text-slate-300">Include Extension</Label>
                  </div>
                  
                  {config.includeExtension && (
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      <div>
                        <Label className="text-xs text-slate-400">Min</Label>
                        <Input
                          type="number"
                          value={config.extensionRange[0]}
                          onChange={(e) => setConfig(prev => ({ 
                            ...prev, 
                            extensionRange: [parseInt(e.target.value) || 1000, prev.extensionRange[1]]
                          }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">Max</Label>
                        <Input
                          type="number"
                          value={config.extensionRange[1]}
                          onChange={(e) => setConfig(prev => ({ 
                            ...prev, 
                            extensionRange: [prev.extensionRange[0], parseInt(e.target.value) || 9999]
                          }))}
                          className="bg-white/10 border-white/20 text-white text-sm"
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="duplicates"
                      checked={config.duplicates}
                      onChange={(e) => setConfig(prev => ({ ...prev, duplicates: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="duplicates" className="text-slate-300">Allow Duplicates</Label>
                  </div>
                </div>

                {/* 快速预设 */}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('us_mobile')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      📱 US Mobile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('uk_landline')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      ☎️ UK Landline
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('global_mix')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🌍 Global Mix
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('toll_free')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      🆓 Toll-Free
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={generatePhones}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Generate Phone Numbers
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：生成的电话号码 */}
          <div className="lg:col-span-2 space-y-6">
            {generatedPhones.length > 0 ? (
              <>
                {/* 操作按钮 */}
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {generatedPhones.length} phone numbers generated
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={copyPhones}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={downloadPhones}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download CSV
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 电话号码列表 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Generated Phone Numbers</CardTitle>
                      <CardDescription className="text-slate-300">
                        {getCurrentCountry().name} ({getCurrentCountry().countryCode}) - {config.format} format
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {generatedPhones.map((phone, index) => (
                          <motion.div
                            key={phone.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className={`bg-gradient-to-r ${typeColors[phone.type]} p-4 rounded-lg relative overflow-hidden`}
                          >
                            <div className="relative z-10 flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{typeIcons[phone.type]}</span>
                                  <span className="text-white font-medium capitalize">{phone.type}</span>
                                  {phone.valid && (
                                    <div className="bg-white/20 rounded-full px-2 py-1 text-xs text-white">
                                      Valid
                                    </div>
                                  )}
                                </div>
                                
                                <div className="space-y-1">
                                  {(config.format === 'national' || config.format === 'both') && (
                                    <div className="text-white font-mono text-lg">
                                      📞 {phone.national}
                                      {phone.extension && <span className="text-white/80 text-sm ml-2">ext. {phone.extension}</span>}
                                    </div>
                                  )}
                                  {(config.format === 'international' || config.format === 'both') && (
                                    <div className="text-white/90 font-mono">
                                      🌍 {phone.international}
                                      {phone.extension && <span className="text-white/70 text-sm ml-2">ext. {phone.extension}</span>}
                                    </div>
                                  )}
                                  
                                  <div className="text-white/70 text-sm">
                                    Area Code: {phone.areaCode}
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(
                                  config.format === 'international' ? phone.international : phone.national
                                )}
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute inset-0 bg-black/10"></div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-16 text-slate-400">
                  <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate phone numbers?</p>
                  <p>Select your country and preferences, then click "Generate Phone Numbers"</p>
                </CardContent>
              </Card>
            )}

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Phone Generation Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Country Formats</h4>
                    <p className="text-sm">Each country follows its specific phone number format and area code system. Mobile and landline numbers use different prefixes.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Phone Types</h4>
                    <p className="text-sm">Mobile (📱), Landline (☎️), and Toll-Free (🆓) numbers have distinct area codes and formatting rules.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-white">Validation</h4>
                    <p className="text-sm">Numbers are validated against country-specific rules for length and format compliance.</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Use Cases:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Application testing</li>
                      <li>Database seeding</li>
                      <li>Form validation</li>
                      <li>Contact management</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>API development</li>
                      <li>Customer examples</li>
                      <li>Training datasets</li>
                      <li>System integration</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-sm">
                    <strong>Note:</strong> These are randomly generated numbers for testing purposes only. They should not be used for actual communication.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
