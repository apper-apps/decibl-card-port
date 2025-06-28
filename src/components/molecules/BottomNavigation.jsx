import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BottomNavigation = () => {
  const navItems = [
    { path: '/', icon: 'Home', label: 'Dashboard' },
    { path: '/voice-notes', icon: 'Mic', label: 'Voice Notes' },
    { path: '/ai-reader', icon: 'BookOpen', label: 'AI Reader' },
    { path: '/settings', icon: 'Settings', label: 'Settings' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg ${isActive ? 'bg-mint-soft' : ''}`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                </motion.div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default BottomNavigation