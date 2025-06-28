import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FeatureCard from '@/components/molecules/FeatureCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { voiceNotesService } from '@/services/api/voiceNotesService'
import { readingSessionsService } from '@/services/api/readingSessionsService'
import { format } from 'date-fns'

const Dashboard = () => {
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalSessions: 0,
    hoursListened: 0
  })

  const loadDashboardData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [voiceNotes, readingSessions] = await Promise.all([
        voiceNotesService.getAll(),
        readingSessionsService.getAll()
      ])
      
      // Calculate stats
      const totalMinutes = voiceNotes.reduce((sum, note) => sum + (note.duration || 0), 0)
      const totalReadingMinutes = readingSessions.reduce((sum, session) => sum + 15, 0) // Estimate
      
      setStats({
        totalNotes: voiceNotes.length,
        totalSessions: readingSessions.length,
        hoursListened: Math.round((totalMinutes + totalReadingMinutes) / 60 * 10) / 10
      })
      
      // Combine and sort recent activity
      const activities = [
        ...voiceNotes.map(note => ({
          id: note.Id,
          type: 'voice',
          title: 'Voice Note Recorded',
          description: note.transcription?.substring(0, 100) + '...' || 'Voice recording',
          timestamp: note.createdAt,
          icon: 'Mic',
          color: 'mint-soft'
        })),
        ...readingSessions.map(session => ({
          id: session.Id,
          type: 'reading',
          title: 'Text Reading Session',
          description: session.text?.substring(0, 100) + '...' || 'Reading session',
          timestamp: session.createdAt,
          icon: 'BookOpen',
          color: 'sky-soft'
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
      
      setRecentActivity(activities)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const features = [
    {
      title: "Voice Notes & Transcriber",
      description: "Record voice notes with real-time transcription and AI-powered formatting for social posts, blogs, and articles.",
      icon: "Mic",
      iconBg: "bg-mint-soft",
      route: "/voice-notes",
      stats: `${stats.totalNotes} notes recorded`
    },
    {
      title: "AI Reader",
      description: "Convert any text to natural speech with customizable voices, speeds, and smart text cleanup capabilities.",
      icon: "BookOpen",
      iconBg: "bg-sky-soft",
      route: "/ai-reader",
      stats: `${stats.totalSessions} reading sessions`
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-primary">Welcome to Decibl</h1>
          <p className="text-gray-600 mt-2">Your AI-powered voice and reading assistant</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="soft"
            icon="Zap"
            onClick={() => window.location.href = '/voice-notes'}
          >
            Quick Record
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-mint-soft rounded-lg flex items-center justify-center">
                <ApperIcon name="Mic" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.totalNotes}</p>
                <p className="text-gray-600 text-sm">Voice Notes</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sky-soft rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.totalSessions}</p>
                <p className="text-gray-600 text-sm">Reading Sessions</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-soft rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.hoursListened}h</p>
                <p className="text-gray-600 text-sm">Total Usage</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.route}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary">Recent Activity</h2>
          {recentActivity.length > 0 && (
            <Button variant="outline" size="sm" icon="MoreHorizontal">
              View All
            </Button>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <Empty
            title="No activity yet"
            description="Start using Decibl to see your recent voice notes and reading sessions here."
            actionText="Record Voice Note"
            onAction={() => window.location.href = '/voice-notes'}
            icon="Activity"
          />
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card hover={false} className="transition-colors hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 bg-${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <ApperIcon name={activity.icon} className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    </div>
                    
                    <div className="text-sm text-gray-500 flex-shrink-0">
                      {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard