import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  accent: 'blue' | 'red' | 'cream'
  trend?: { value: number; isUp: boolean }
  className?: string
}

const accentMap = {
  blue: {
    value: 'text-blue-accent',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-accent',
    glow: 'rgba(37,99,235,0.04)',
  },
  red: {
    value: 'text-red-accent',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-accent',
    glow: 'rgba(230,57,70,0.04)',
  },
  cream: {
    value: 'text-navy-900',
    bg: 'bg-cream',
    border: 'border-navy-200',
    badge: 'bg-navy-100 text-navy-600',
    glow: 'rgba(0,0,0,0.02)',
  },
}

export default function StatsCard({
  title,
  value,
  subtitle,
  accent,
  trend,
  className = '',
}: StatsCardProps) {
  const styles = accentMap[accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`doodle-border relative p-6 overflow-hidden ${styles.bg} ${className}`}
    >
      <div className="relative z-10">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-navy-500 mb-2">
          {title}
        </p>
        <p className={`text-5xl md:text-6xl font-black tracking-tight leading-none ${styles.value}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-navy-500 mt-2">{subtitle}</p>
        )}
        {trend && (
          <div
            className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.badge}`}
          >
            <span>{trend.isUp ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div
        className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full"
        style={{ background: styles.glow }}
      />
    </motion.div>
  )
}
