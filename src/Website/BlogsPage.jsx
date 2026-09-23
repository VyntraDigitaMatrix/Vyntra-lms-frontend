import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import BlogsHero from './components/BlogsHero';
import LatestArticle from './components/LatestArticle';
import FeaturedStory from './components/FeaturedStory';
import Blogs from './components/Blogs';
import BlogsCTA from './components/BlogsCTA';
import MoreFromVyntra from './components/MoreFromVyntra';
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

      {/* Hero Section */}
      <BlogsHero />

      <LatestArticle />

      <BlogsCTA />

      {/* More from Vyntra One, Popular Topics & Sidebar */}
      <MoreFromVyntra />



      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogsPage;
