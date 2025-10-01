"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiArrowRight, FiPlay, FiUsers, FiClock, FiTrendingUp } from 'react-icons/fi';
import AIFeatures from '../../components/AIFeatures';
import Testimonials from '../../components/Testimonials';
import HowItWorks from '../../components/HowItWorks';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-6">
                <FiZap className="w-4 h-4" />
                AI-Powered Content Creation
              </div>

              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent mb-6">
                OpenBlog AI
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Transform YouTube videos into engaging, SEO-optimized blog posts in seconds.
                Let AI handle the heavy lifting while you focus on what matters.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <FiPlay className="w-5 h-5" />
                  Start Creating Now
                </div>
              </button>

              <button className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mx-auto mb-4">
                  <FiTrendingUp className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">10k+</h3>
                <p className="text-slate-600">Blogs Generated</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">5k+</h3>
                <p className="text-slate-600">Happy Users</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mx-auto mb-4">
                  <FiClock className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">90%</h3>
                <p className="text-slate-600">Time Saved</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <AIFeatures />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
              Join thousands of content creators who are already using OpenBlog AI to scale their content production
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-2">
                  Get Started Free
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}