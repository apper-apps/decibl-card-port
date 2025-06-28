// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Default settings
const defaultSettings = {
  defaultVoice: 'sarah',
  defaultSpeed: 1.0,
  language: 'en-US',
  theme: 'light',
  hotkeys: {
    record: 'Ctrl+R',
    play: 'Ctrl+P',
    stop: 'Ctrl+S'
  }
}

// Use localStorage for persistence
const STORAGE_KEY = 'decibl_settings'

export const settingsService = {
  async get() {
    await delay(200)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) }
    }
    return { ...defaultSettings }
  },

  async update(settings) {
    await delay(300)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    return { ...settings }
  },

  async reset() {
    await delay(200)
    localStorage.removeItem(STORAGE_KEY)
    return { ...defaultSettings }
  }
}