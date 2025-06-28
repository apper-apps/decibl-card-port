import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white btn-apple"
  
  const variants = {
    primary: "bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-900 focus:ring-primary-300 shadow-sm",
    secondary: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 focus:ring-neutral-300 shadow-sm",
    soft: "bg-mint-soft text-accent-green hover:bg-green-100 active:bg-green-200 focus:ring-green-200 border border-green-200",
    outline: "border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 active:bg-neutral-100 focus:ring-neutral-300 shadow-sm"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-5 py-2.5 text-sm font-medium",
    lg: "px-6 py-3 text-base font-medium",
    xl: "px-8 py-4 text-lg font-medium"
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
  
  return (
    <motion.button
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 15 }
      } : {}}
      whileTap={!disabled && !loading ? { 
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 15 }
      } : {}}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      
      <span className="font-text">{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  )
}

export default Button