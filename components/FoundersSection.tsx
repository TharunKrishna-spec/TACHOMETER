import React from 'react';
import { motion } from 'framer-motion';

const founders = [
  { initials: 'TK', name: 'Tharun Krishna' },
  { initials: 'GR', name: 'GokulRaj' },
  { initials: 'JK', name: 'Jayakumar' },
];

// FIX: Added a props interface and typed FounderCard as a React.FC to resolve issues with TypeScript incorrectly handling the 'key' prop.
interface FounderCardProps {
  initials: string;
  name: string;
}

const FounderCard: React.FC<FounderCardProps> = ({ initials, name }) => {
  // Helper for corner '+' icons
  const CornerIcon = ({ className }: { className?: string }) => (
    <div className={`absolute text-cyan-tech-300/50 text-xl font-thin ${className}`}>+</div>
  );

  return (
    <motion.div
      className="relative w-full max-w-xs p-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Border elements */}
      <div className="absolute inset-0 border border-cyan-tech-300/20 rounded-3xl"></div>
      <CornerIcon className="-top-3 -left-3" />
      <CornerIcon className="-top-3 -right-3" />
      <CornerIcon className="-bottom-3 -left-3" />
      <CornerIcon className="-bottom-3 -right-3" />
      <CornerIcon className="top-1/2 -translate-y-1/2 -left-3" />
      <CornerIcon className="top-1/2 -translate-y-1/2 -right-3" />
      <CornerIcon className="left-1/2 -translate-x-1/2 -top-3" />
      <CornerIcon className="left-1/2 -translate-x-1/2 -bottom-3" />

      {/* Content */}
      <div className="relative w-40 h-40 rounded-full flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-black rounded-full shadow-[0_0_80px_20px_rgba(0,0,0,0.9)]"></div>
        <span className="relative text-white font-bold text-5xl z-10">{initials}</span>
      </div>
      <p className="text-off-white text-lg tracking-wider">{name}</p>
    </motion.div>
  );
};

const FoundersSection: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-16 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Meet The Founders
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {founders.map((founder, index) => (
            <FounderCard key={index} {...founder} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
