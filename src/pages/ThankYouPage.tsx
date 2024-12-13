import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-custom flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} // Faster animation
        className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", duration: 0.4 }} // Faster animation
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Heart className="w-12 h-12 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }} // Faster delay
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Welcome!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }} // Faster delay
          className="text-gray-600 mb-8"
        >
          We hope you enjoyed exploring our AR experience. Your engagement helps us create better immersive experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }} // Faster delay
          className="space-y-4"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;