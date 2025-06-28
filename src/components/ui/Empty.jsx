import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by creating your first item", 
  actionText = "Get Started",
  onAction,
  icon = "Smile"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-mint-soft to-sky-soft rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-primary to-gray-700 text-white rounded-lg font-medium shadow-soft hover:shadow-soft-lg transition-all"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty