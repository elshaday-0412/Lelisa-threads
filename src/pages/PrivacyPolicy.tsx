import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBFA] py-20 px-6 md:px-16 text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto bg-white border border-[#E5E1DA] p-8 md:p-12 rounded-sm shadow-sm">
        <h1 className="text-3xl md:text-5xl font-serif font-light mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10 font-light uppercase tracking-widest">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
        
        <div className="space-y-8 text-sm md:text-base text-gray-700 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-3">1. Introduction</h2>
            <p>
              Welcome to Wanofi Design. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website 
              (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-3">2. Data We Collect</h2>
            <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong className="text-gray-800">Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong className="text-gray-800">Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong className="text-gray-800">Financial Data:</strong> includes payment card details (processed securely via our encrypted payment gateways).</li>
              <li><strong className="text-gray-800">Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-3">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to process your orders, 
              manage our relationship with you, and, if you have opted in, send you details of new heritage collections and VIP drops.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-3">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, 
              altered, or disclosed. All transactions are protected via 256-bit encryption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-3">5. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, 
              correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at: <br />
              <strong className="text-gray-800">Email:</strong> privacy@wanofidesign.com<br />
              <strong className="text-gray-800">Phone:</strong> +251 911 704 132
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
