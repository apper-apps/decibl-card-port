import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const FeatureCard = ({ title, description, icon, iconBg, route, stats }) => {
  const navigate = useNavigate()
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(route)}
      className="cursor-pointer"
    >
      <Card className="h-full">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <ApperIcon name={icon} className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {description}
            </p>
            
            {stats && (
              <div className="text-xs text-gray-500">
                {stats}
              </div>
            )}
          </div>
          
          <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </Card>
    </motion.div>
  )
}

export default FeatureCard