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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="text-gray-600 mt-2">Customize your Decibl experience</p>
        </div>
        
        <Button
          variant="primary"
          icon="Save"
          onClick={handleSaveSettings}
          loading={saving}
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
          <Card>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-mint-soft rounded-lg flex items-center justify-center">
                  <ApperIcon name="Volume2" className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Voice & Audio</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Voice
                  </label>
                  <VoiceSelector
                    value={settings.defaultVoice}
                    onChange={(value) => handleSettingChange('defaultVoice', value)}
                    voices={voices}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Reading Speed: {settings.defaultSpeed}x
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSettingChange('defaultSpeed', speed)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          settings.defaultSpeed === speed
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
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
          <Card>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sky-soft rounded-lg flex items-center justify-center">
                  <ApperIcon name="Keyboard" className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Keyboard Shortcuts</h3>
              </div>

              <div className="space-y-4">
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

                <div className="bg-yellow-soft rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Info" className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Desktop App Required</p>
                      <p className="text-sm text-yellow-700 mt-1">
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
          <Card>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blush-soft rounded-lg flex items-center justify-center">
                  <ApperIcon name="Palette" className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Appearance</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSettingChange('theme', 'light')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        settings.theme === 'light'
                          ? 'border-primary bg-mint-soft'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Sun" className="w-5 h-5 text-primary" />
                        <span className="font-medium">Light</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSettingChange('theme', 'dark')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        settings.theme === 'dark'
                          ? 'border-primary bg-mint-soft'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Moon" className="w-5 h-5 text-primary" />
                        <span className="font-medium">Dark</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-sky-soft rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Sparkles" className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-sky-800">Coming Soon</p>
                      <p className="text-sm text-sky-700 mt-1">
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
          <Card>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-soft rounded-lg flex items-center justify-center">
                  <ApperIcon name="HelpCircle" className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">About & Support</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Version</span>
                  <span className="font-medium text-primary">1.0.0</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Platform</span>
                  <span className="font-medium">Web App</span>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    icon="ExternalLink"
                    className="w-full justify-center"
                  >
                    Visit Website
                  </Button>
                  
                  <Button
                    variant="outline"
                    icon="MessageCircle"
                    className="w-full justify-center"
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