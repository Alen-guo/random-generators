"use client"

import { useState, useRef } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrCode, Download, Copy, Link, Mail, Phone, Wifi, MapPin, CreditCard, Settings } from 'lucide-react'
import QRCode from 'qrcode'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface QRData {
  type: 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'location' | 'vcard'
  content: string
  generated: boolean
}

export default function QRCodePage() {
  const containerRef = useTranslationProtection()
  const [qrData, setQrData] = useState<QRData>({
    type: 'text',
    content: '',
    generated: false
  })
  const [qrSize, setQrSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [margin, setMargin] = useState(4)
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Form states for different QR types
  const [urlInput, setUrlInput] = useState('')
  const [emailData, setEmailData] = useState({ email: '', subject: '', body: '' })
  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsData, setSmsData] = useState({ phone: '', message: '' })
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', security: 'WPA', hidden: false })
  const [locationData, setLocationData] = useState({ lat: '', lng: '', name: '' })
  const [vcardData, setVcardData] = useState({
    name: '', phone: '', email: '', company: '', website: '', address: ''
  })

  // 真正的QR码生成函数
  const generateQRCode = async () => {
    if (!qrData.content.trim()) return

    setIsGenerating(true)
    
    try {
      const canvas = canvasRef.current
      if (!canvas) {
        setIsGenerating(false)
        return
      }

      // 使用qrcode库生成真正的二维码
      await QRCode.toCanvas(canvas, qrData.content, {
        width: qrSize,
        margin: margin,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        errorCorrectionLevel: errorLevel
      })

      setQrData(prev => ({ ...prev, generated: true }))
    } catch (error) {
      console.error('QR Code generation failed:', error)
      alert('Failed to generate QR code. Please check your input.')
    } finally {
      setIsGenerating(false)
    }
  }



  const buildQRContent = () => {
    switch (qrData.type) {
      case 'url':
        return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`
      case 'email':
        return `mailto:${emailData.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`
      case 'phone':
        return `tel:${phoneNumber}`
      case 'sms':
        return `sms:${smsData.phone}?body=${encodeURIComponent(smsData.message)}`
      case 'wifi':
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden ? 'true' : 'false'};;`
      case 'location':
        return `geo:${locationData.lat},${locationData.lng}${locationData.name ? `?q=${encodeURIComponent(locationData.name)}` : ''}`
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nORG:${vcardData.company}\nURL:${vcardData.website}\nADR:${vcardData.address}\nEND:VCARD`
      default:
        return qrData.content
    }
  }

  const handleGenerate = () => {
    const content = buildQRContent()
    setQrData(prev => ({ ...prev, content }))
    
    // Trigger QR generation after content is set
    setTimeout(() => {
      generateQRCode()
    }, 100)
  }

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas || !qrData.generated) return

    const link = document.createElement('a')
    link.download = `qr-code-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const copyQRImage = async () => {
    const canvas = canvasRef.current
    if (!canvas || !qrData.generated) return

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
        }
      })
    } catch (err) {
      console.error('Failed to copy image:', err)
    }
  }

  const loadPreset = (preset: 'website' | 'email' | 'phone' | 'wifi' | 'location') => {
    switch (preset) {
      case 'website':
        setQrData(prev => ({ ...prev, type: 'url' }))
        setUrlInput('example.com')
        break
      case 'email':
        setQrData(prev => ({ ...prev, type: 'email' }))
        setEmailData({ email: 'contact@example.com', subject: 'Hello', body: 'Hi there!' })
        break
      case 'phone':
        setQrData(prev => ({ ...prev, type: 'phone' }))
        setPhoneNumber('+1234567890')
        break
      case 'wifi':
        setQrData(prev => ({ ...prev, type: 'wifi' }))
        setWifiData({ ssid: 'MyWiFi', password: 'password123', security: 'WPA', hidden: false })
        break
      case 'location':
        setQrData(prev => ({ ...prev, type: 'location' }))
        setLocationData({ lat: '40.7128', lng: '-74.0060', name: 'New York City' })
        break
    }
  }

  const renderInputForm = () => {
    switch (qrData.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label className="text-slate-300">Text Content</Label>
            <textarea
              value={qrData.content}
              onChange={(e) => setQrData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter any text..."
              rows={4}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-slate-400 resize-none"
            />
          </div>
        )
      
      case 'url':
        return (
          <div className="space-y-2">
            <Label className="text-slate-300">Website URL</Label>
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="example.com or https://example.com"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        )
      
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Email Address</Label>
              <Input
                value={emailData.email}
                onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@example.com"
                type="email"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Subject (Optional)</Label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Message (Optional)</Label>
              <textarea
                value={emailData.body}
                onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Email message"
                rows={3}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        )
      
      case 'phone':
        return (
          <div className="space-y-2">
            <Label className="text-slate-300">Phone Number</Label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              type="tel"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        )
      
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Network Name (SSID)</Label>
              <Input
                value={wifiData.ssid}
                onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                placeholder="WiFi Network Name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Password</Label>
              <Input
                value={wifiData.password}
                onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="WiFi Password"
                type="password"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Security</Label>
                <select
                  value={wifiData.security}
                  onChange={(e) => setWifiData(prev => ({ ...prev, security: e.target.value as any }))}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Hidden Network</Label>
                <label className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    checked={wifiData.hidden}
                    onChange={(e) => setWifiData(prev => ({ ...prev, hidden: e.target.checked }))}
                    className="rounded accent-blue-500"
                  />
                  <span className="text-white text-sm">Hidden</span>
                </label>
              </div>
            </div>
          </div>
        )
      
      case 'location':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Latitude</Label>
                <Input
                  value={locationData.lat}
                  onChange={(e) => setLocationData(prev => ({ ...prev, lat: e.target.value }))}
                  placeholder="40.7128"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Longitude</Label>
                <Input
                  value={locationData.lng}
                  onChange={(e) => setLocationData(prev => ({ ...prev, lng: e.target.value }))}
                  placeholder="-74.0060"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Location Name (Optional)</Label>
              <Input
                value={locationData.name}
                onChange={(e) => setLocationData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="New York City"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        )
      
      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <Input
                  value={vcardData.name}
                  onChange={(e) => setVcardData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Phone</Label>
                <Input
                  value={vcardData.phone}
                  onChange={(e) => setVcardData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input
                  value={vcardData.email}
                  onChange={(e) => setVcardData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Company</Label>
                <Input
                  value={vcardData.company}
                  onChange={(e) => setVcardData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company Name"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Website</Label>
              <Input
                value={vcardData.website}
                onChange={(e) => setVcardData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Address</Label>
              <Input
                value={vcardData.address}
                onChange={(e) => setVcardData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, City, State"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 generator-container">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">QR Code Generator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Create custom QR codes for websites, contacts, WiFi, locations, and more. Fully customizable design and high-quality output.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：QR码显�?*/}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <QrCode className="h-5 w-5" />
                  Generated QR Code
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {qrData.generated ? 'Click to download or copy' : 'Configure and generate your QR code'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                {/* QR码画�?*/}
                <div className="p-4 bg-white rounded-lg" data-result="true" translate="no">
                  <canvas
                    ref={canvasRef}
                    width={qrSize}
                    height={qrSize}
                    className="max-w-full h-auto border border-gray-200 notranslate"
                    style={{ 
                      width: '240px', 
                      height: '240px',
                      imageRendering: 'pixelated'
                    }}
                    translate="no"
                    data-result="true"
                  />
                </div>

                {qrData.generated && (
                  <div className="flex gap-2 w-full">
                    <Button
                      onClick={downloadQR}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 notranslate"
                      translate="no"
                      data-interactive="true"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={copyQRImage}
                      variant="outline"
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 notranslate"
                      translate="no"
                      data-interactive="true"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR设置 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  QR Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Size (px)</Label>
                  <Input
                    type="number"
                    min={128}
                    max={512}
                    step={32}
                    value={qrSize}
                    onChange={(e) => setQrSize(parseInt(e.target.value) || 256)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Error Correction</Label>
                  <select
                    value={errorLevel}
                    onChange={(e) => setErrorLevel(e.target.value as any)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Foreground</Label>
                    <Input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="h-10 bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Background</Label>
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-10 bg-white/10 border-white/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：内容配�?*/}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">QR Code Content</CardTitle>
                <CardDescription className="text-slate-300">
                  Choose the type of data to encode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 类型选择 */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Content Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => setQrData(prev => ({ ...prev, type: 'text' }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        qrData.type === 'text' 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <QrCode className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Text</div>
                    </button>
                    <button
                      onClick={() => setQrData(prev => ({ ...prev, type: 'url' }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        qrData.type === 'url' 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <Link className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Website</div>
                    </button>
                    <button
                      onClick={() => setQrData(prev => ({ ...prev, type: 'email' }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        qrData.type === 'email' 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <Mail className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Email</div>
                    </button>
                    <button
                      onClick={() => setQrData(prev => ({ ...prev, type: 'phone' }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        qrData.type === 'phone' 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <Phone className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Phone</div>
                    </button>
                    <button
                      onClick={() => setQrData(prev => ({ ...prev, type: 'wifi' }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        qrData.type === 'wifi' 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <Wifi className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">WiFi</div>
                    </button>
                    <button
                      onClick={() => setQrData(prev => ({ ...prev, type: 'location' }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        qrData.type === 'location' 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <MapPin className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Location</div>
                    </button>
                    <button
                      onClick={() => setQrData(prev => ({ ...prev, type: 'vcard' }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        qrData.type === 'vcard' 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Contact</div>
                    </button>
                  </div>
                </div>

                {/* 快速预�?*/}
                <div className="space-y-2">
                  <Label className="text-slate-300">Quick Presets</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('website')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Sample Website
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('email')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Sample Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('wifi')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      Sample WiFi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset('location')}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      NYC Location
                    </Button>
                  </div>
                </div>

                {/* 动态输入表�?*/}
                <div className="pt-4 border-t border-white/10">
                  {renderInputForm()}
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 font-semibold notranslate"
                  translate="no"
                  data-interactive="true"
                >
                  {isGenerating ? (
                    <>
                      <QrCode className="h-5 w-5 mr-2 animate-spin" />
                      Generating QR Code...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-5 w-5 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">QR Code Features & Usage</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm leading-relaxed">
                  Create professional QR codes for various purposes with customizable design options and high-quality output.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Supported Data Types:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Plain text and messages</li>
                      <li>Website URLs and links</li>
                      <li>Email with pre-filled subject/body</li>
                      <li>Phone numbers for quick dialing</li>
                      <li>WiFi network credentials</li>
                      <li>GPS coordinates and locations</li>
                      <li>Contact cards (vCard format)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Customization Options:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Adjustable size (128px to 512px)</li>
                      <li>Error correction levels</li>
                      <li>Custom colors for design</li>
                      <li>High-resolution PNG output</li>
                      <li>Print-ready quality</li>
                      <li>Instant download and copy</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Common Use Cases:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Business cards</li>
                      <li>Product packaging</li>
                      <li>Event tickets</li>
                      <li>Marketing materials</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Restaurant menus</li>
                      <li>WiFi sharing</li>
                      <li>App downloads</li>
                      <li>Contact sharing</li>
                    </ul>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Location sharing</li>
                      <li>Social media links</li>
                      <li>Payment systems</li>
                      <li>Digital portfolios</li>
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
