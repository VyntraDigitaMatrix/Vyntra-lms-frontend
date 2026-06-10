import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  const cards = [
    {
      title: 'Student Portal',
      description: 'Access your classes, learning materials, quizzes, and track your learning progress.',
      path: '/UserLogin',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/10 hover:shadow-blue-500/20',
      badge: 'Learn & Grow'
    },
    {
      title: 'Instructor Portal',
      description: 'Manage your courses, view student performance, assign homework, and conduct schedules.',
      path: '/InstructorLogin',
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10 hover:shadow-emerald-500/20',
      badge: 'Teach & Guide'
    },
    {
      title: 'Admin Console',
      description: 'Oversee the whole LMS system, manage students, instructors, schedules, and monitor system metrics.',
      path: '/AdminLogin',
      icon: Shield,
      color: 'from-violet-500 to-fuchsia-600',
      shadow: 'shadow-violet-500/10 hover:shadow-violet-500/20',
      badge: 'Manage & Monitor'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      
      {/* Decorative top border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-violet-500 to-fuchsia-500" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex-grow flex flex-col justify-center items-center relative z-10 w-full">
        {/* Logo / Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800/80 mb-6 text-sm text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Vyntra Digita Matrix LMS
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-6">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">Vyntra LMS</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A unified smart learning management ecosystem tailored for students, educators, and administrators. Choose your portal below to sign in.
          </p>
        </motion.div>

        {/* Portal Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Link 
                  to={card.path}
                  className={`flex flex-col h-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/60 shadow-xl ${card.shadow}`}
                >
                  {/* Card Icon & Badge */}
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg shadow-black/20`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-slate-100 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                    {card.description}
                  </p>

                  {/* Action Link */}
                  <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                      Enter Portal
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 relative z-10">
        <div>
          &copy; {new Date().getFullYear()} Vyntra LMS. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;