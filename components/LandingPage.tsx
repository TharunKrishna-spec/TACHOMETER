import React from 'react';
import { motion } from 'framer-motion';
import { HyperText } from './HyperText';
import DashboardPreview from './DashboardPreview';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import FoundersSection from './FoundersSection'; // Import the new component

interface LandingPageProps {
  onGetStarted: () => void;
}

// FIX: Made the `children` prop optional (`children?: React.ReactNode`) to resolve a TypeScript error where it was reported as missing, even though it was provided in the JSX.
const FeatureCard = ({ icon, title, children }: { icon: string; title: string; children?: React.ReactNode }) => (
    <motion.div 
      className="bg-panel-dark backdrop-blur-xl border border-cyan-tech-300/20 rounded-2xl p-6 text-left"
      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 245, 212, 0.5)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-off-white mb-2">{title}</h3>
      <p className="text-gray-400">{children}</p>
    </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="font-sans text-off-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center text-center p-4 relative">
        <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <HyperText
                text="TACHOMETER MONITOR"
                className="text-5xl md:text-7xl font-bold text-off-white tracking-wider"
              />
            </motion.div>
            <motion.p 
                className="mt-4 text-xl md:text-2xl text-cyan-tech-200 font-light tracking-widest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
                Real-time. Precise. Powerful.
            </motion.p>
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Connect to your IoT-enabled tachometer, like an ESP32, and instantly visualize performance data. Perfect for tuning, diagnostics, and pushing the limits of your machine.
            </motion.p>
            <motion.button
              onClick={onGetStarted}
              className="mt-10 relative z-20 flex items-center gap-2 py-4 px-10 border border-transparent text-md font-bold rounded-lg text-black bg-cyan-tech-300 hover:bg-cyan-tech-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-cyan-tech-500 transition-all duration-300 transform hover:scale-105 shadow-glow-cyan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              Connect to Device
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
        </div>
        
        {/* Features Cards moved to the bottom of the hero section */}
        <motion.div
          className="w-full pb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon="🔁" title="Live RPM Monitoring">
                      Stream your engine’s RPM in real time — precision readings updated every second.
                    </FeatureCard>
                    <FeatureCard icon="📈" title="Performance Analytics">
                      Visualize speed fluctuations, average RPM, and redline zones with interactive charts.
                    </FeatureCard>
                    <FeatureCard icon="🕹️" title="Session Control">
                      Start or stop runs remotely and save session data automatically for later analysis.
                    </FeatureCard>
                </div>
            </div>
        </motion.div>
      </section>

      {/* Visualization Preview Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <DashboardPreview />
            </motion.div>
            <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="text-4xl font-bold tracking-wider">Your Data. Your Dashboard.</h2>
                <p className="mt-6 text-gray-400 text-lg">
                  Every movement, every rev — captured and visualized instantly. Whether tuning your kart, testing an engine, or comparing laps — Tachometer Monitor gives you the insights you need, live and beautiful.
                </p>
                <button
                    onClick={onGetStarted}
                    className="mt-8 inline-flex items-center gap-2 py-3 px-8 border border-cyan-tech-300/50 text-md font-semibold rounded-lg text-cyan-tech-200 bg-cyan-tech-500/10 hover:bg-cyan-tech-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-cyan-tech-400 transition-all duration-300 transform hover:scale-105"
                >
                    See Live Demo
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-24 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold mb-6 tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Why It Matters
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you’re an automotive enthusiast, engine tuner, or IoT innovator, Tachometer Real-Time Monitor brings precision, design, and performance into one place.
          </motion.p>
          <motion.p 
            className="text-2xl text-cyan-tech-200 font-semibold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            ⚡ No delays. No complexity. Just pure, live performance.
          </motion.p>
        </div>
      </section>

      {/* Founders Section */}
      <FoundersSection />

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 border-t border-cyan-tech-300/10">
        <p>&copy; {new Date().getFullYear()} Tachometer Monitor. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;