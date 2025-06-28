import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import ReaderInterface from '@/components/organisms/ReaderInterface'
import { readingSessionsService } from '@/services/api/readingSessionsService'
import { toast } from 'react-toastify'

const AIReader = () => {
  const [readingSessions, setReadingSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('reader')

  const loadReadingSessions = async () => {
    try {
      setError('')
      setLoading(true)
      const sessions = await readingSessionsService.getAll()
      setReadingSessions(sessions)
    } catch (err) {
      setError('Failed to load reading sessions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReadingSessions()
  }, [])

  const handleDeleteSession = async (sessionId) => {
    try {
      await readingSessionsService.delete(sessionId)
      setReadingSessions(prev => prev.filter(session => session.Id !== sessionId))
      toast.success('Reading session deleted')
    } catch (error) {
      toast.error('Failed to delete reading session')
    }
  }

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard!')
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadReadingSessions} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-primary">AI Reader</h1>
          <p className="text-gray-600 mt-2">Convert any text to natural speech with customizable voices</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('reader')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'reader'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="BookOpen" className="w-4 h-4" />
            <span>Reader</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="History" className="w-4 h-4" />
            <span>History ({readingSessions.length})</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'reader' ? (
          <ReaderInterface />
        ) : (
          <div className="space-y-6">
            {readingSessions.length === 0 ? (
              <Empty
                title="No reading sessions yet"
                description="Start your first reading session to see it appear here. Your text, voice settings, and progress will be saved automatically."
                actionText="Start Reading"
                onAction={() => setActiveTab('reader')}
                icon="BookOpen"
              />
            ) : (
              <div className="space-y-4">
                {readingSessions.map((session, index) => (
                  <motion.div
                    key={session.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <div className="space-y-4">
                        {/* Session Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-sky-soft rounded-lg flex items-center justify-center">
                              <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                Reading Session #{session.Id}
                              </p>
                              <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <span>{format(new Date(session.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                <span>•</span>
                                <span>{session.voice} voice</span>
                                <span>•</span>
                                <span>{session.speed}x speed</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Copy"
                              onClick={() => handleCopyText(session.cleanedText || session.text)}
                            >
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Trash2"
                              onClick={() => handleDeleteSession(session.Id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-primary">{Math.round(session.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-mint-soft to-sky-soft h-2 rounded-full transition-all"
                              style={{ width: `${session.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Text Preview */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed line-clamp-3">
                            {session.cleanedText || session.text}
                          </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="soft"
                            size="sm"
                            icon="Play"
                            onClick={() => setActiveTab('reader')}
                          >
                            Resume Reading
                          </Button>
                          <div className="text-sm text-gray-600">
                            {session.text?.split(' ').length || 0} words
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AIReader