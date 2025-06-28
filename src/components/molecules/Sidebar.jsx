import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: 'Home', label: 'Dashboard' },
    { path: '/voice-notes', icon: 'Mic', label: 'Voice Notes' },
    { path: '/ai-reader', icon: 'BookOpen', label: 'AI Reader' },
    { path: '/settings', icon: 'Settings', label: 'Settings' },
  ]

return (
    <div className="hidden md:flex flex-col w-72 bg-white border-r border-neutral-200 h-full">
      <div className="p-8 border-b border-neutral-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-mint-soft to-sky-soft rounded-2xl flex items-center justify-center shadow-sm">
            <ApperIcon name="Zap" className="w-7 h-7 text-accent-green" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-900">Decibl</h1>
            <p className="text-sm text-neutral-500 font-text">AI Voice Assistant</p>
          </div>
        </div>
      </div>
      
<nav className="flex-1 p-6 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-mint-soft text-primary-900 shadow-sm' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-700'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ 
                  x: isActive ? 0 : 4,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
                className="flex items-center space-x-4"
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="font-medium font-text">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
      
<div className="p-6 border-t border-neutral-200">
        <div className="bg-gradient-to-r from-mint-soft to-sky-soft rounded-xl p-6 text-center shadow-sm">
          <ApperIcon name="Sparkles" className="w-6 h-6 text-accent-green mx-auto mb-3" />
          <p className="text-base font-medium text-primary-900 font-text">AI-Powered</p>
          <p className="text-sm text-neutral-600 font-text">Voice & Reading Assistant</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar