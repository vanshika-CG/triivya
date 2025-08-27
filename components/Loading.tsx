'use client';

import { ShoppingBag } from 'lucide-react';
import { useLoading } from '@/lib/LoadingContext';
import { motion } from 'framer-motion';

export default function Loading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-extrabold text-[rgb(140,77,100)] tracking-wide">
            Triivya
          </h1>
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0,
            }}
          >
            <ShoppingBag className="h-8 w-8 text-[rgb(140,77,100)]" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          >
            <ShoppingBag className="h-8 w-8 text-[rgb(140,77,100)]" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
          >
            <ShoppingBag className="h-8 w-8 text-[rgb(140,77,100)]" />
          </motion.div>
        </div>
        <motion.p
          className="text-lg font-medium text-gray-900"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Preparing your shopping experience...
        </motion.p>
      </div>
    </div>
  );
}