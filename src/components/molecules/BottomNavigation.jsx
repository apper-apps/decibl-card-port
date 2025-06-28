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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-neutral-200 px-6 py-3 z-50 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary-900' : 'text-neutral-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ 
                    scale: 0.95,
                    transition: { type: "spring", stiffness: 400, damping: 15 }
                  }}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-mint-soft shadow-sm' : 'hover:bg-neutral-50'
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                </motion.div>
                <span className="text-xs mt-1 font-medium font-text">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default BottomNavigation