import React, { useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-[#111535]">
      <Navbar />

      <main className="flex-grow max-w-[900px] w-full mx-auto px-4 sm:px-8 py-16" style={{ fontFamily: 'Inter' }}>
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 md:p-16 border border-gray-100">
          <h1 className="text-4xl sm:text-4xl font-extrabold mb-4 text-[#111633] tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-10 text-sm sm:text-base font-medium">Last updated: September 2026</p>

          <div className="space-y-10 text-[15px] sm:text-[15px] leading-relaxed text-[#4D5268]">
            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using Vyntra One, you agree to comply with and be bound
                by these Terms of Service. If you do not agree with these terms, you
                should discontinue use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                2. User Accounts
              </h2>
              <p>
                Users must provide accurate registration information and are responsible
                for maintaining the confidentiality of their account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                3. Course Enrollment & Access
              </h2>
              <p>
                Vyntra One provides access to online courses, learning materials,
                assessments, and certifications. Access may be subject to payment,
                subscription, or approval requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                4. User Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate account information.</li>
                <li>Use the platform only for lawful educational purposes.</li>
                <li>Respect instructors and fellow learners.</li>
                <li>Maintain the security of account credentials.</li>
                <li>Comply with all platform policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                5. Assessments & Certifications
              </h2>
              <p>
                Certificates are issued based on successful completion of course
                requirements. Cheating, plagiarism, or fraudulent activities may result
                in certificate revocation and account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                6. Payments & Refunds
              </h2>
              <p>
                Certain courses and services may require payment. Fees and subscription
                plans will be displayed before purchase. Please note that all purchases are final and we have a strict no refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                7. Intellectual Property Rights
              </h2>
              <p>
                All course content, videos, assessments, designs, trademarks, and
                platform materials are owned by Vyntra One or its licensors and may not
                be copied, distributed, or used without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                8. Prohibited Activities
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sharing accounts with others.</li>
                <li>Redistributing course materials.</li>
                <li>Attempting to bypass security measures.</li>
                <li>Uploading harmful or illegal content.</li>
                <li>Using automated tools to scrape platform data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                9. Account Suspension & Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these
                terms or engage in activities that negatively affect the platform or its
                users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                10. Limitation of Liability
              </h2>
              <p>
                Vyntra One is not liable for any indirect, incidental, or consequential
                damages resulting from the use or inability to use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                11. Changes to Terms
              </h2>
              <p>
                We may update these Terms of Service periodically. Continued use of the
                platform after updates constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#111535] mb-4" style={{ fontFamily: 'Outfit' }}>
                12. Contact Information
              </h2>
              <p>
                For questions regarding these Terms of Service, contact us at: {" "}
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

export default TermsOfService;
