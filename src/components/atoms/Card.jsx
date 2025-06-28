import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'default',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }
  
  const baseClasses = `bg-white rounded-lg shadow-soft ${paddingClasses[padding]} ${className}`
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, shadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

export default Card