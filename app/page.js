"use client";

import { motion } from "framer-motion";
import { Scan, Camera, Zap } from "lucide-react";
import { Scene3D } from "@/components/scene3D";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {

  const router = useRouter();

  const handleNavigation = () => {
     alert("Get Started clicked!");
    router.push("/camera");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemEaseOut = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Dummy handler for Get Started button
  const handleGetStarted = () => {
    // Implement navigation or logic here
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 opacity-30"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center min-h-screen"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Content Section */}
          <div className="space-y-8">
            <motion.div variants={itemEaseOut} className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/20 backdrop-blur-sm border border-purple-500/20 rounded-full text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4 text-purple-500" />
                <span className="text-gray-400">Real-time Face Detection</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Next-Gen
                </span>
                <br />
                <span className="text-white">Face Tracking</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Real Time Face Tracking with 60 FPS, 99.9% Accuracy next JS face
                detection
                Click ON GET STARTED to start tracking your face
              </p>
            </motion.div>

            <motion.div
              variants={itemEaseOut}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={handleNavigation}
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <Camera className="w-5 h-5 mr-2" />
                  Get Started
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
              </motion.button>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              variants={itemEaseOut}
              className="grid grid-cols-3 gap-4 pt-8"
            >
              {/* Real-time Feature */}
              <motion.div
                className="cursor-pointer text-center p-4 bg-gray-800/10 backdrop-blur-sm border border-purple-500/10 rounded-lg"
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Camera className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">60 FPS</div>
                <div className="text-sm text-gray-400">Real-time</div>
              </motion.div>

              {/* Accuracy Feature */}
              <motion.div
                className="cursor-pointer text-center p-4 bg-gray-800/10 backdrop-blur-sm border border-purple-500/10 rounded-lg"
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Scan className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </motion.div>

              {/* Latency Feature */}
              <motion.div
                className="cursor-pointer text-center p-4 bg-gray-800/10 backdrop-blur-sm border border-purple-500/10 rounded-lg"
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">&lt;10ms</div>
                <div className="text-sm text-gray-400">Latency</div>
              </motion.div>
            </motion.div>
          </div>

          {/* 3D Scene Section */}
          <motion.div
            variants={itemEaseOut}
            className="relative h-[600px] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl backdrop-blur-sm border border-purple-500/10"></div>
            <div className="absolute inset-4 rounded-2xl overflow-hidden">
              <Scene3D />
            </div>

            {/* Floating UI elements */}
            <motion.div
              className="absolute top-8 right-8 bg-gray-800/80 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-white">Tracking Active</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-8 bg-gray-800/80 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            >
              <div className="text-sm text-white">
                <div className="text-purple-500 font-semibold text-center">
                  Face
                </div>
                <div className="text-gray-400">Detected</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
