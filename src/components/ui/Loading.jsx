import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'cards') {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-soft"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-mint-soft rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-md animate-pulse mb-2" />
                <div className="h-3 bg-gray-100 rounded-md animate-pulse w-2/3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'waveform') {
    return (
      <div className="flex items-center justify-center space-x-2 py-8">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="w-1 h-8 bg-gradient-to-t from-mint-soft to-sky-soft rounded-full animate-wave"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-mint-soft border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default Loading