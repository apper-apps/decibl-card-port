import mockReadingSessions from '@/services/mockData/readingSessions.json'

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for demo purposes
let readingSessionsData = [...mockReadingSessions]

export const readingSessionsService = {
  async getAll() {
    await delay(300)
    return [...readingSessionsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const session = readingSessionsData.find(session => session.Id === parseInt(id))
    if (!session) {
      throw new Error('Reading session not found')
    }
    return { ...session }
  },

  async create(data) {
    await delay(400)
    const newSession = {
      Id: Math.max(...readingSessionsData.map(s => s.Id)) + 1,
      ...data,
      createdAt: new Date().toISOString()
    }
    readingSessionsData.push(newSession)
    return { ...newSession }
  },

  async update(id, data) {
    await delay(300)
    const index = readingSessionsData.findIndex(session => session.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Reading session not found')
    }
    readingSessionsData[index] = { ...readingSessionsData[index], ...data }
    return { ...readingSessionsData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = readingSessionsData.findIndex(session => session.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Reading session not found')
    }
    readingSessionsData.splice(index, 1)
    return true
  }
}