import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function CyberPanel({ children, className = '', title }: { children: ReactNode, className?: string, title?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative bg-panel-bg backdrop-blur-md border border-glass-border rounded-xl overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {title && (
        <div className="px-5 py-3 border-b border-glass-border bg-white/[0.02] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-electric-blue" />
          <h3 className="font-display font-bold text-xs uppercase tracking-widest text-text-secondary drop-shadow-md">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function CyberButton({ children, onClick, active = false, className = '', variant = 'primary' }: { children: ReactNode, onClick?: () => void, active?: boolean, className?: string, variant?: 'primary' | 'ghost' }) {
  const baseClasses = "relative px-5 py-2.5 font-display font-medium tracking-wide text-sm transition-all duration-300 rounded-md flex items-center justify-center uppercase";
  
  const variants = {
    primary: `${active ? 'text-space-navy bg-electric-blue' : 'bg-transparent border border-electric-blue text-electric-blue hover:bg-electric-blue/10'}`,
    ghost: `border-transparent ${active ? 'text-electric-blue bg-white/5' : 'text-text-secondary hover:text-electric-blue hover:bg-white/5'}`
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
