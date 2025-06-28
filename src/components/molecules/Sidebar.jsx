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
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-mint-soft to-sky-soft rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Decibl</h1>
            <p className="text-xs text-gray-500">AI Voice Assistant</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-mint-soft text-primary border-l-4 border-primary' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: isActive ? 0 : 4 }}
                className="flex items-center space-x-3"
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-mint-soft to-sky-soft rounded-lg p-4 text-center">
          <ApperIcon name="Sparkles" className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-primary">AI-Powered</p>
          <p className="text-xs text-gray-600">Voice & Reading Assistant</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar