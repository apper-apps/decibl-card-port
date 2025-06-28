import mockVoiceNotes from '@/services/mockData/voiceNotes.json'

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for demo purposes
let voiceNotesData = [...mockVoiceNotes]

export const voiceNotesService = {
  async getAll() {
    await delay(300)
    return [...voiceNotesData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const note = voiceNotesData.find(note => note.Id === parseInt(id))
    if (!note) {
      throw new Error('Voice note not found')
    }
    return { ...note }
  },

  async create(data) {
    await delay(400)
    const newNote = {
      Id: Math.max(...voiceNotesData.map(n => n.Id)) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      formattedVersions: data.formattedVersions || {}
    }
    voiceNotesData.push(newNote)
    return { ...newNote }
  },

  async update(id, data) {
    await delay(300)
    const index = voiceNotesData.findIndex(note => note.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Voice note not found')
    }
    voiceNotesData[index] = { ...voiceNotesData[index], ...data }
    return { ...voiceNotesData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = voiceNotesData.findIndex(note => note.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Voice note not found')
    }
    voiceNotesData.splice(index, 1)
    return true
  }
}