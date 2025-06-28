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
  
  const baseClasses = `bg-white rounded-xl border border-neutral-100 ${paddingClasses[padding]} ${className}`
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ 
          y: -4, 
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }
        }}
        className={`${baseClasses} transition-shadow duration-200 hover:shadow-lg`}
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