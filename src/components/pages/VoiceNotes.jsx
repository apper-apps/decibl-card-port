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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-primary-900 tracking-tight">Voice Notes</h1>
          <p className="text-lg text-neutral-600 font-text">Record, transcribe, and format your voice notes with AI</p>
        </div>
      </div>

{/* Tabs */}
      <div className="flex space-x-2 bg-neutral-100 rounded-xl p-2">
        <button
          onClick={() => setActiveTab('record')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'record'
              ? 'bg-white text-primary-900 shadow-sm'
              : 'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Mic" className="w-4 h-4" />
            <span className="font-text">Record</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'history'
              ? 'bg-white text-primary-900 shadow-sm'
              : 'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="History" className="w-4 h-4" />
            <span className="font-text">History ({voiceNotes.length})</span>
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
                    <Card className="shadow-soft">
                      <div className="space-y-6">
                        {/* Note Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-mint-soft rounded-xl flex items-center justify-center">
                              <ApperIcon name="Mic" className="w-6 h-6 text-accent-green" />
                            </div>
                            <div>
                              <p className="font-semibold text-primary-900 font-text text-lg">
                                Voice Note #{note.Id}
                              </p>
                              <div className="flex items-center space-x-3 text-sm text-neutral-600 mt-1">
                                <span>{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                <span>•</span>
                                <span>{formatDuration(note.duration)}</span>
                              </div>
                            </div>
                          </div>
                          
<div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Copy"
                              onClick={() => handleCopyText(note.transcription)}
                              className="shadow-sm"
                            >
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Trash2"
                              onClick={() => handleDeleteNote(note.Id)}
                              className="shadow-sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

{/* Transcription */}
                        <div className="bg-neutral-50 rounded-xl p-6">
                          <p className="text-neutral-700 leading-relaxed font-text">
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