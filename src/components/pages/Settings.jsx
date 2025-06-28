import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import VoiceSelector from '@/components/molecules/VoiceSelector'
import { settingsService } from '@/services/api/settingsService'

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultVoice: 'sarah',
    defaultSpeed: 1.0,
    language: 'en-US',
    theme: 'light',
    hotkeys: {
      record: 'Ctrl+R',
      play: 'Ctrl+P',
      stop: 'Ctrl+S'
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const voices = [
    { id: 'sarah', name: 'Sarah', language: 'English (US)' },
    { id: 'james', name: 'James', language: 'English (UK)' },
    { id: 'maria', name: 'Maria', language: 'Spanish' },
    { id: 'pierre', name: 'Pierre', language: 'French' }
  ]

  const languages = [
    { id: 'en-US', name: 'English (US)' },
    { id: 'en-GB', name: 'English (UK)' },
    { id: 'es-ES', name: 'Spanish' },
    { id: 'fr-FR', name: 'French' },
    { id: 'de-DE', name: 'German' }
  ]

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

  const loadSettings = async () => {
    try {
      setError('')
      setLoading(true)
      const userSettings = await settingsService.get()
      if (userSettings) {
        setSettings(userSettings)
      }
    } catch (err) {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await settingsService.update(settings)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleHotkeyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      hotkeys: {
        ...prev.hotkeys,
        [key]: value
      }
    }))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSettings} />

return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-primary-900 tracking-tight">Settings</h1>
          <p className="text-lg text-neutral-600 font-text">Customize your Decibl experience</p>
        </div>
        
        <Button
          variant="primary"
          icon="Save"
          onClick={handleSaveSettings}
          loading={saving}
          className="shadow-md"
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice & Audio Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
>
          <Card className="shadow-soft">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-mint-soft rounded-xl flex items-center justify-center">
                  <ApperIcon name="Volume2" className="w-5 h-5 text-accent-green" />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary-900">Voice & Audio</h3>
              </div>

<div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-base font-medium text-neutral-700">
                    Default Voice
                  </label>
                  <VoiceSelector
                    value={settings.defaultVoice}
                    onChange={(value) => handleSettingChange('defaultVoice', value)}
                    voices={voices}
                  />
                </div>

<div className="space-y-3">
                  <label className="block text-base font-medium text-neutral-700">
                    Default Reading Speed: {settings.defaultSpeed}x
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSettingChange('defaultSpeed', speed)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          settings.defaultSpeed === speed
                            ? 'bg-accent-blue text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:shadow-sm'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

<div className="space-y-3">
                  <label className="block text-base font-medium text-neutral-700">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-opacity-20 transition-all font-text"
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Hotkeys Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
<Card className="shadow-soft">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-sky-soft rounded-xl flex items-center justify-center">
                  <ApperIcon name="Keyboard" className="w-5 h-5 text-accent-blue" />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary-900">Keyboard Shortcuts</h3>
              </div>

<div className="space-y-6">
                <Input
                  label="Record Voice Note"
                  value={settings.hotkeys.record}
                  onChange={(e) => handleHotkeyChange('record', e.target.value)}
                  placeholder="e.g., Ctrl+R"
                />

                <Input
                  label="Play/Pause Reading"
                  value={settings.hotkeys.play}
                  onChange={(e) => handleHotkeyChange('play', e.target.value)}
                  placeholder="e.g., Ctrl+P"
                />

                <Input
                  label="Stop Reading"
                  value={settings.hotkeys.stop}
                  onChange={(e) => handleHotkeyChange('stop', e.target.value)}
                  placeholder="e.g., Ctrl+S"
                />
<div className="bg-amber-soft rounded-xl p-6 border border-amber-200">
                  <div className="flex items-start space-x-4">
                    <ApperIcon name="Info" className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-base font-medium text-amber-800">Desktop App Required</p>
                      <p className="text-sm text-amber-700 mt-2 leading-relaxed">
                        Global hotkeys work only in the desktop version of Decibl. 
                        Web version supports hotkeys when the app is focused.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
<Card className="shadow-soft">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-rose-soft rounded-xl flex items-center justify-center">
                  <ApperIcon name="Palette" className="w-5 h-5 text-accent-pink" />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary-900">Appearance</h3>
              </div>

<div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-base font-medium text-neutral-700">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleSettingChange('theme', 'light')}
                      className={`p-5 rounded-xl border transition-all duration-200 ${
                        settings.theme === 'light'
                          ? 'border-accent-blue bg-mint-soft shadow-md'
                          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Sun" className="w-5 h-5 text-accent-orange" />
                        <span className="font-medium text-neutral-900">Light</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSettingChange('theme', 'dark')}
                      className={`p-5 rounded-xl border transition-all duration-200 ${
                        settings.theme === 'dark'
                          ? 'border-accent-blue bg-mint-soft shadow-md'
                          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Moon" className="w-5 h-5 text-accent-indigo" />
                        <span className="font-medium text-neutral-900">Dark</span>
                      </div>
                    </button>
                  </div>
                </div>

<div className="bg-sky-soft rounded-xl p-6 border border-sky-200">
                  <div className="flex items-start space-x-4">
                    <ApperIcon name="Sparkles" className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-base font-medium text-sky-800">Coming Soon</p>
                      <p className="text-sm text-sky-700 mt-2 leading-relaxed">
                        Dark mode and additional themes will be available in a future update.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* About & Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
<Card className="shadow-soft">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-amber-soft rounded-xl flex items-center justify-center">
                  <ApperIcon name="HelpCircle" className="w-5 h-5 text-accent-orange" />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary-900">About & Support</h3>
              </div>

<div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-neutral-200">
                  <span className="text-neutral-700 font-text">Version</span>
                  <span className="font-medium text-primary-900">1.0.0</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-neutral-200">
                  <span className="text-neutral-700 font-text">Platform</span>
                  <span className="font-medium text-neutral-900">Web App</span>
                </div>

<div className="space-y-4">
                  <Button
                    variant="outline"
                    icon="ExternalLink"
                    className="w-full justify-center shadow-sm"
                  >
                    Visit Website
                  </Button>
                  
                  <Button
                    variant="outline"
                    icon="MessageCircle"
                    className="w-full justify-center shadow-sm"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings