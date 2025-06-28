import { motion } from 'framer-motion'

const WaveformVisualizer = ({ isActive = false, bars = 20 }) => {
  return (
    <div className="flex items-center justify-center space-x-1 h-16">
      {Array.from({ length: bars }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-1 bg-gradient-to-t from-mint-soft to-sky-soft rounded-full ${
            isActive ? 'wave-bar' : 'h-2'
          }`}
          initial={{ height: 8 }}
          animate={isActive ? {
            height: [8, Math.random() * 32 + 16, 8],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1
            }
          } : { height: 8 }}
        />
      ))}
    </div>
  )
}

export default WaveformVisualizer