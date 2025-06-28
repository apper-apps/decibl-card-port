import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import RecordingInterface from '@/components/organisms/RecordingInterface'
import { voiceNotesService } from '@/services/api/voiceNotesService'
import { toast } from 'react-toastify'

const VoiceNotes = () => {
  const [voiceNotes, setVoiceNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('record')

  const loadVoiceNotes = async () => {
    try {
      setError('')
      setLoading(true)
      const notes = await voiceNotesService.getAll()
      setVoiceNotes(notes)
    } catch (err) {
      setError('Failed to load voice notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVoiceNotes()
  }, [])

  const handleDeleteNote = async (noteId) => {
    try {
      await voiceNotesService.delete(noteId)
      setVoiceNotes(prev => prev.filter(note => note.Id !== noteId))
      toast.success('Voice note deleted')
    } catch (error) {
      toast.error('Failed to delete voice note')
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard!')
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadVoiceNotes} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-primary">Voice Notes</h1>
          <p className="text-gray-600 mt-2">Record, transcribe, and format your voice notes with AI</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('record')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'record'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Mic" className="w-4 h-4" />
            <span>Record</span>
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
            <span>History ({voiceNotes.length})</span>
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
        {activeTab === 'record' ? (
          <RecordingInterface />
        ) : (
          <div className="space-y-6">
            {voiceNotes.length === 0 ? (
              <Empty
                title="No voice notes yet"
                description="Start recording your first voice note to see it appear here. Your transcriptions and formatted versions will be saved automatically."
                actionText="Record First Note"
                onAction={() => setActiveTab('record')}
                icon="Mic"
              />
            ) : (
              <div className="space-y-4">
                {voiceNotes.map((note, index) => (
                  <motion.div
                    key={note.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <div className="space-y-4">
                        {/* Note Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-mint-soft rounded-lg flex items-center justify-center">
                              <ApperIcon name="Mic" className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                Voice Note #{note.Id}
                              </p>
                              <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <span>{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                <span>•</span>
                                <span>{formatDuration(note.duration)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Copy"
                              onClick={() => handleCopyText(note.transcription)}
                            >
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Trash2"
                              onClick={() => handleDeleteNote(note.Id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Transcription */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">
                            {note.transcription}
                          </p>
                        </div>

                        {/* Formatted Versions */}
                        {note.formattedVersions && Object.keys(note.formattedVersions).length > 0 && (
                          <div className="space-y-3">
                            <p className="font-medium text-gray-800">Formatted Versions:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(note.formattedVersions).map(([format, text]) => (
                                <div key={format} className="bg-gradient-to-br from-sky-soft to-blush-soft rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-primary capitalize">
                                      {format}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      icon="Copy"
                                      onClick={() => handleCopyText(text)}
                                    >
                                      Copy
                                    </Button>
                                  </div>
                                  <p className="text-sm text-gray-700 line-clamp-3">
                                    {text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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

export default VoiceNotes