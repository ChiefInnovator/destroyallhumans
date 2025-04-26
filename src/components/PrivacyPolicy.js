import React from 'react';
import '../styles/LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      
      <section>
        <h2>1. Introduction</h2>
        <p>At Destroy All Humans, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at destroyallhumans.ai (the "Site").</p>
      </section>
      
      <section>
        <h2>2. Information We Collect</h2>
        <p>We collect minimal information about our visitors. The only data we collect is:</p>
        <ul>
          <li>Usage Data: Information on how you use our website, including pages visited and time spent on the site.</li>
          <li>Technical Data: IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and platform.</li>
        </ul>
        <p>We do not collect any personally identifiable information unless you explicitly provide it to us.</p>
      </section>
      
      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the collected data for the following purposes:</p>
        <ul>
          <li>To maintain and improve our website</li>
          <li>To analyze usage patterns and optimize user experience</li>
          <li>To detect and prevent technical issues</li>
        </ul>
      </section>
      
      <section>
        <h2>4. Cookies</h2>
        <p>We use only essential cookies that are necessary for the functioning of our website. We do not use tracking or advertising cookies. For more information, please see our Cookie Support page.</p>
      </section>
      
      <section>
        <h2>5. Third-Party Services</h2>
        <p>Our website uses the following third-party services:</p>
        <ul>
          <li>Google AdSense: For displaying advertisements. Please refer to Google's privacy policy for more information on how they handle your data.</li>
          <li>GitHub: For hosting our code repository and potentially for user interactions through issues or pull requests.</li>
        </ul>
      </section>
      
      <section>
        <h2>6. Data Security</h2>
        <p>We implement appropriate security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</p>
      </section>
      
      <section>
        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
        <ul>
          <li>The right to access information we hold about you</li>
          <li>The right to request correction of your personal data</li>
          <li>The right to request deletion of your personal data</li>
          <li>The right to object to processing of your personal data</li>
        </ul>
      </section>
      
      <section>
        <h2>8. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
      </section>
      
      <section>
        <h2>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us through the GitHub repository linked on our homepage.</p>
      </section>
      
      <div className="last-updated">Last Updated: April 26, 2025</div>
    </div>
  );
};

export default PrivacyPolicy;
