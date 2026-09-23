import React from "react";
import article1 from "../assets/Article-1.png";
import article2 from "../assets/Article-2.png";
import article3 from "../assets/Article-3.png";
import article4 from "../assets/Article-4.png";
import article5 from "../assets/Article-5.png";
import article6 from "../assets/Article-6.png";
import article7 from "../assets/Article-7.png";
import article8 from "../assets/Article-8.png";

const articles = [
  {
    id: 1,
    category: "Learning",
    title: "The Power of Live Learning: Why It Works",
    date: "Mar 4, 2025",
    readTime: "5 min read",
    image: article1,
  },
  {
    id: 2,
    category: "Student Stories",
    title: "From Learner to Marketer: A Vyntra One Success Story",
    date: "Mar 2, 2025",
    readTime: "6 min read",
    image: article2,
  },
  {
    id: 3,
    category: "Technology",
    title: "Full Stack vs. Data Analytics: Which Career Path Is Right for You?",
    date: "Feb 28, 2025",
    readTime: "7 min read",
    image: article3,
  },
  {
    id: 4,
    category: "Technology",
    title: "How to Build a Simple Investment Strategy",
    date: "Feb 25, 2025",
    readTime: "6 min read",
    image: article4,
  },
  {
    id: 5,
    category: "Career",
    title: "Top Skills Employers Look for in 2025",
    date: "Feb 20, 2025",
    readTime: "5 min read",
    image: article5,
  },
  {
    id: 6,
    category: "Digital Marketing",
    title: "SEO in 2025: What Still Works and What's New",
    date: "Feb 18, 2025",
    readTime: "7 min read",
    image: article6,
  },
  {
    id: 7,
    category: "Student Stories",
    title: "How Vyntra One Helped Me Switch to a Tech Career",
    date: "Feb 13, 2025",
    readTime: "6 min read",
    image: article7,
  },
  {
    id: 8,
    category: "Learning",
    title: "Turning Knowledge into Real Projects",
    date: "Feb 12, 2025",
    readTime: "6 min read",
    image: article8,
  },
];

const LatestArticle = () => {
  const handleClick = () => {
    window.location.href = "/blog-detail";
  };

  return (
    <section id="blogs" className="w-full py-10 sm:py-12 lg:py-7 bg-white relative">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        {/* Section Heading */}
        <h2
          className="text-[#071424] mb-6 sm:mb-8"
          style={{ fontFamily: "Gilroy-SemiBold", fontWeight: 400, fontSize: "25px", color: "#071424" }}
        >
          Latest Articles
        </h2>

        {/* 4-column grid of 8 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={handleClick}
              className="bg-white rounded-[20px] border border-[#ACACAC] p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer group hover:shadow-md transition-shadow duration-300"
            >
              <div>
                {/* Image Container with Pill Badge */}
                <div className="relative w-full aspect-[268/160] rounded-[14px] overflow-hidden mb-3.5 bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className="absolute top-2.5 left-2.5 px-3 py-1 bg-white backdrop-blur-sm rounded-full text-[11px] font-semibold text-[#071424] shadow-xs"
                    style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "9px", color: "#071424" }}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Article Title */}
                <h3
                  className="mb-2 line-clamp-2 leading-[1.35] group-hover:text-[#1677ED] transition-colors"
                  style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "14px", color: "#071424" }}
                >
                  {article.title}
                </h3>
              </div>

              {/* Date & Read Time */}
              <p
                className="mt-2"
                style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "10px", color: "#8190A2" }}
              >
                {article.date}&nbsp;&nbsp;&middot;&nbsp;&nbsp;{article.readTime}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticle;
