import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import BlogsHero from './components/BlogsHero';
import Blogs from './components/Blogs';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import './index.css';

const categories = ['All', 'Career Growth', 'Full Stack', 'Digital Marketing', 'Stock Market', 'AI & Tech'];

const BlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="website-homepage-scope font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Exact Hero Section as requested */}
      <BlogsHero />

      {/* Blog Listing Section */}
      <main className="flex-grow">
        <Blogs />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogsPage;
