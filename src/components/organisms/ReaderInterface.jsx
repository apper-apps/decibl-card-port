import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import VoiceSelector from '@/components/molecules/VoiceSelector'
import { readingSessionsService } from '@/services/api/readingSessionsService'

const ReaderInterface = () => {
  const [text, setText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(1.0)
  const [selectedVoice, setSelectedVoice] = useState('sarah')
  const [isProcessing, setIsProcessing] = useState(false)
  const textareaRef = useRef(null)

  const voices = [
    { id: 'sarah', name: 'Sarah', language: 'English (US)' },
    { id: 'james', name: 'James', language: 'English (UK)' },
    { id: 'maria', name: 'Maria', language: 'Spanish' },
    { id: 'pierre', name: 'Pierre', language: 'French' }
  ]

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

  const cleanText = (inputText) => {
    return inputText
      .replace(/[#*_`]/g, '') // Remove markdown
      .replace(/\[[^\]]*\]/g, '') // Remove citations
      .replace(/\n\s*\n/g, '\n\n') // Clean up spacing
      .trim()
  }

  const handleTextChange = (e) => {
    const inputText = e.target.value
    setText(inputText)
    
    if (inputText.trim()) {
      const cleaned = cleanText(inputText)
      setCleanedText(cleaned)
    } else {
      setCleanedText('')
    }
  }

  const handlePlay = async () => {
    if (!cleanedText.trim()) {
      toast.error('Please enter some text to read')
      return
    }

    setIsProcessing(true)
    
    try {
      // Create reading session
      const session = await readingSessionsService.create({
        text: text,
        cleanedText: cleanedText,
        voice: selectedVoice,
        speed: speed,
        progress: 0
      })

      // Simulate audio playback
      setIsPlaying(true)
      setIsPaused(false)
      toast.success('Reading started')
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setIsPlaying(false)
            toast.success('Reading completed')
            return 100
          }
          return prev + 2
        })
      }, 200)
      
    } catch (error) {
      toast.error('Failed to start reading')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePause = () => {
    setIsPaused(true)
    setIsPlaying(false)
    toast.info('Reading paused')
  }

  const handleResume = () => {
    setIsPaused(false)
    setIsPlaying(true)
    toast.info('Reading resumed')
  }

  const handleStop = () => {
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)
    toast.info('Reading stopped')
  }

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
      setCleanedText(cleanText(clipboardText))
      toast.success('Text pasted from clipboard')
    } catch (error) {
      toast.error('Failed to paste from clipboard')
    }
  }

  const calculateEstimatedTime = () => {
    const wordsPerMinute = 150 * speed
    const wordCount = cleanedText.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Text to Read</h3>
            <Button
              variant="outline"
              size="sm"
              icon="Clipboard"
              onClick={handlePasteFromClipboard}
            >
              Paste
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Enter or paste your text
            </label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your article, blog post, or any text here. Markdown and special characters will be automatically cleaned up for better reading..."
              className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
            />
          </div>
          
          {cleanedText && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{cleanedText.split(' ').length}</span> words • 
              <span className="ml-1">~{calculateEstimatedTime()} min read time</span>
            </div>
          )}
        </div>
      </Card>

      {/* Voice Controls */}
      {cleanedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Voice Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Voice
                  </label>
                  <VoiceSelector
                    value={selectedVoice}
                    onChange={setSelectedVoice}
                    voices={voices}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Speed: {speed}x
                  </label>
                  <div className="flex space-x-2">
                    {speedOptions.map((speedOption) => (
                      <button
                        key={speedOption}
                        onClick={() => setSpeed(speedOption)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          speed === speedOption
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {speedOption}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Playback Controls */}
      {cleanedText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Playback</h3>
                <div className="text-sm text-gray-600">
                  {Math.round(progress)}% complete
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-mint-soft to-sky-soft h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  icon="SkipBack"
                  disabled={!isPlaying && !isPaused}
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  -10s
                </Button>
                
                {!isPlaying && !isPaused ? (
                  <Button
                    size="xl"
                    icon="Play"
                    onClick={handlePlay}
                    loading={isProcessing}
                  >
                    Start Reading
                  </Button>
                ) : isPlaying ? (
                  <Button
                    size="xl"
                    icon="Pause"
                    onClick={handlePause}
                  >
                    Pause
                  </Button>
                ) : (
                  <Button
                    size="xl"
                    icon="Play"
                    onClick={handleResume}
                  >
                    Resume
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  icon="Square"
                  disabled={!isPlaying && !isPaused}
                  onClick={handleStop}
                >
                  Stop
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  icon="SkipForward"
                  disabled={!isPlaying && !isPaused}
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10s
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Cleaned Text Preview */}
      {cleanedText && cleanedText !== text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Cleaned Text Preview</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Sparkles" className="w-4 h-4" />
                  <span>Auto-cleaned</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {cleanedText}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default ReaderInterface