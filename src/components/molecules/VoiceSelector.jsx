import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const VoiceSelector = ({ value, onChange, voices = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedVoice = voices.find(v => v.id === value) || voices[0]
  
  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
        icon={isOpen ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Volume2" className="w-4 h-4" />
          <span>{selectedVoice?.name || 'Select Voice'}</span>
        </div>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-soft-lg z-10">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => {
                onChange(voice.id)
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{voice.name}</div>
                  <div className="text-sm text-gray-500">{voice.language}</div>
                </div>
                {value === voice.id && (
                  <ApperIcon name="Check" className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default VoiceSelector