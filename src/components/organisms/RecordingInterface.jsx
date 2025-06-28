import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import WaveformVisualizer from '@/components/molecules/WaveformVisualizer'
import { voiceNotesService } from '@/services/api/voiceNotesService'

const RecordingInterface = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [duration, setDuration] = useState(0)
  const [selectedFormat, setSelectedFormat] = useState('social')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formattedVersions, setFormattedVersions] = useState({})

  const formats = [
    { id: 'social', name: 'Social Post', icon: 'MessageCircle' },
    { id: 'blog', name: 'Blog Article', icon: 'FileText' },
    { id: 'pr', name: 'Press Release', icon: 'Megaphone' },
    { id: 'article', name: 'Article', icon: 'Newspaper' }
  ]

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setDuration(0)
    setTranscription('')
    setFormattedVersions({})
    toast.success('Recording started')
    
    // Simulate live transcription
    setTimeout(() => {
      setTranscription("Welcome to Decibl, your AI voice assistant. This is a demo transcription that appears in real-time as you speak...")
    }, 2000)
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    setIsProcessing(true)
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const finalTranscription = "Welcome to Decibl, your AI voice assistant. This is a demo transcription that shows how your speech is converted to text with high accuracy and then formatted for different use cases."
      
      setTranscription(finalTranscription)
      
      // Create new voice note
      const voiceNote = await voiceNotesService.create({
        transcription: finalTranscription,
        duration,
        audioUrl: 'demo-audio.mp3'
      })
      
      toast.success('Recording saved successfully!')
    } catch (error) {
      toast.error('Failed to process recording')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFormatText = async (format) => {
    setIsProcessing(true)
    try {
      // Simulate AI formatting
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const formatted = {
        social: "🎙️ Just discovered Decibl - an amazing AI voice assistant that transforms how we capture thoughts! Perfect for quick voice notes and content creation. #AI #Productivity",
        blog: "# Introducing Decibl: The Future of Voice Technology\n\nDecibl represents a revolutionary approach to voice assistance, combining cutting-edge AI with intuitive design to create an unparalleled user experience...",
        pr: "FOR IMMEDIATE RELEASE\n\nDecibl Launches Revolutionary AI Voice Assistant\n\nNew platform transforms speech-to-text technology with advanced formatting capabilities...",
        article: "The Evolution of Voice Technology: How Decibl is Changing the Game\n\nIn today's fast-paced digital world, voice technology has become increasingly important..."
      }
      
      setFormattedVersions(prev => ({
        ...prev,
        [format]: formatted[format]
      }))
      
      toast.success(`Text formatted as ${formats.find(f => f.id === format)?.name}`)
    } catch (error) {
      toast.error('Failed to format text')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card className="text-center">
        <div className="space-y-6">
          <WaveformVisualizer isActive={isRecording} />
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 recording-pulse' 
                  : 'bg-primary hover:bg-gray-700'
              }`}
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ApperIcon name={isRecording ? "Square" : "Mic"} className="w-8 h-8" />
              )}
            </motion.button>
            
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {isRecording ? 'Recording...' : 'Ready to Record'}
              </p>
              <p className="text-gray-600">{formatTime(duration)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Live Transcription */}
      <AnimatePresence>
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Transcription</h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Copy"
                  onClick={() => handleCopyText(transcription)}
                >
                  Copy
                </Button>
              </div>
              <p className="text-gray-700 leading-relaxed">{transcription}</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Format Options */}
      {transcription && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Format As</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {formats.map((format) => (
              <Button
                key={format.id}
                variant={selectedFormat === format.id ? "primary" : "outline"}
                size="sm"
                icon={format.icon}
                onClick={() => {
                  setSelectedFormat(format.id)
                  handleFormatText(format.id)
                }}
                loading={isProcessing && selectedFormat === format.id}
              >
                {format.name}
              </Button>
            ))}
          </div>

          {/* Formatted Output */}
          <AnimatePresence>
            {formattedVersions[selectedFormat] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gray-800">
                    {formats.find(f => f.id === selectedFormat)?.name} Format
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Copy"
                    onClick={() => handleCopyText(formattedVersions[selectedFormat])}
                  >
                    Copy
                  </Button>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {formattedVersions[selectedFormat]}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}
    </div>
  )
}

export default RecordingInterface