import React, { useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-[#111535]">
      <Navbar />

      <main className="flex-grow max-w-[900px] w-full mx-auto px-4 sm:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 md:p-16 border border-gray-100">
          <h1 className="text-4xl sm:text-4xl font-bold mb-4 text-[#111633] tracking-tight">Refund Policy</h1>
          <p className="text-gray-500 mb-10 text-sm sm:text-base font-medium">Last updated: September 2026</p>

          <div className="space-y-10 text-[15px] sm:text-[15px] leading-relaxed text-[#4D5268]">
            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">1. General Refund Policy</h2>
              <p>
                At Vyntra One, we want you to be fully satisfied with your learning experience. 
                If you are not entirely satisfied with your course purchase, we are here to help. 
                Please read our policy below to understand your rights regarding refunds and cancellations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">2. Eligibility for Refunds</h2>
              <p className="mb-4">
                We offer a standard 7-day money-back guarantee on most of our courses. To be eligible for a refund, you must meet the following criteria:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your refund request is submitted within 7 days of the original purchase date.</li>
                <li>You have not completed more than 20% of the course content.</li>
                <li>You have not downloaded any course materials (such as PDFs, source code, or resources).</li>
                <li>You have not claimed or received any certificate of completion for the course.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">3. Non-Refundable Items</h2>
              <p>
                Certain purchases and services are strictly non-refundable. These include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Subscription plans (e.g., monthly or annual access passes) after the billing cycle has started.</li>
                <li>Live bootcamps and cohort-based courses once the first live session has commenced.</li>
                <li>1-on-1 mentorship sessions or career coaching services that have already been conducted.</li>
                <li>Purchases made using promotional codes or discounts that explicitly state "non-refundable".</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">4. How to Request a Refund</h2>
              <p>
                To request a refund, please contact our support team with your order number, the email address associated with your account, and a brief explanation of why you are requesting a refund. Our team will review your request and notify you of the approval or rejection of your refund within 3-5 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">5. Processing Refunds</h2>
              <p>
                If your refund is approved, it will be processed, and a credit will automatically be applied to your original method of payment. Please note that it may take some time (typically 5-10 business days) before your refund is officially posted by your bank or credit card company.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4">6. Contact Us</h2>
              <p>
                If you have any questions or need further assistance regarding our refund policy, please contact us at: {" "}
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

export default RefundPolicy;
