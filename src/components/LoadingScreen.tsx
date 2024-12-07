import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="w-64 h-64 flex items-center justify-center">
              {!imageError ? (
                <img 
                  src="/avatar.png" 
                  alt="Avatar"
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary">
                  <span className="text-lg">Loading Avatar...</span>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            TRACE AR
          </motion.h1>
          
          <motion.div
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{
                  y: ["0%", "-50%", "0%"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className="mt-4 text-primary text-sm tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Initializing AR Experience
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;