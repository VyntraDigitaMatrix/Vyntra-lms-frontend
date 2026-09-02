import React, { useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-[#111535]">
      <Navbar />

      <main className="flex-grow max-w-[900px] w-full mx-auto px-4 sm:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 md:p-16 border border-gray-100">
          <h1 className="text-4xl sm:text-4xl font-bold mb-4 text-[#111633] tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 mb-10 text-sm sm:text-base font-medium">Last updated: September 2026</p>

          <div className="space-y-10 text-[15px] sm:text-[15px] leading-relaxed text-[#4D5268]">
            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">1. Introduction</h2>
              <p>
                Welcome to Vyntra One, a Learning Management System (LMS) designed to
                provide online learning, training programs, assessments, certifications,
                and educational resources. This Privacy Policy explains how we collect,
                use, store, and protect your personal information when you access our
                platform and services.
              </p>

            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">2. Information We Collect</h2>
              <p className="mb-4">
                We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the website or otherwise when you contact us.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> Name, email address, phone number,
                  username, password, and profile details provided during registration.
                </li>
                <li>
                  <strong>Learning Data:</strong> Course enrollments, learning progress,
                  quiz results, assignment submissions, certifications, and completion status.
                </li>
                <li>
                  <strong>Payment Information:</strong> Billing details required for course
                  purchases or subscription plans. Payment transactions are processed
                  securely through third-party payment providers.
                </li>
                <li>
                  <strong>Device & Usage Information:</strong> Browser type, IP address,
                  device information, login history, and activity on the platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">
                We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your learner account.</li>
                <li>Provide access to courses, learning materials, and assessments.</li>
                <li>Track learning progress and course completion.</li>
                <li>Issue certificates upon successful completion of courses.</li>
                <li>Process payments and manage subscriptions.</li>
                <li>Send important updates regarding courses and platform features.</li>
                <li>Improve the learning experience and platform performance.</li>
                <li>Provide customer support and resolve technical issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">4. Learning Progress & Certificates</h2>
              <p>
                Vyntra One maintains records of course participation, assessment scores,
                learning progress, and certifications earned through the platform.
                This information is used to provide personalized learning experiences,
                generate reports, and verify certificate authenticity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal
                information, course data, and learning records from unauthorized access,
                disclosure, alteration, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">6. Third-Party Services</h2>
              <p>
                We may use trusted third-party service providers for payment processing,
                analytics, communication services, cloud hosting, and authentication.
                These providers only access information necessary to perform their services.
              </p>
            </section>



            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">7. User Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information.</li>
                <li>Update or correct your profile information.</li>
                <li>Request deletion of your account and associated data.</li>
                <li>Download available learning records and certificates.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">8. Contact Us</h2>
              <p>
                If you have any questions regarding this Privacy Policy or the handling
                of your personal information, please contact us at: {" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@vyntraone.com" target="_blank" rel="noopener noreferrer"
                  className="text-[#4323CA] hover:underline font-medium"
                >
                  info@vyntraone.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
