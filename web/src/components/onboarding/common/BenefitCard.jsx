import React from 'react';
import { motion } from 'framer-motion';

export default function BenefitCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay }}
      className="flex items-start gap-4 pb-4 mb-4 border-b border-border/60 last:border-0 last:mb-0 last:pb-0"
    >
      <div className="bg-white border border-border/80 w-[36px] h-[36px] flex items-center justify-center rounded-full text-primary shrink-0 shadow-sm mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-0.5 text-[15px] tracking-tight">{title}</h3>
        <p className="text-[13px] text-muted leading-[1.4]">{description}</p>
      </div>
    </motion.div>
  );
}
