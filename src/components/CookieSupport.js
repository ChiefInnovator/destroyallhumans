import React from 'react';
import '../styles/LegalPages.css';

const CookieSupport = () => {
  return (
    <div className="legal-page">
      <h1>Cookie Support</h1>
      
      <section>
        <h2>1. What Are Cookies</h2>
        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
      </section>
      
      <section>
        <h2>2. How We Use Cookies</h2>
        <p>At Destroy All Humans, we are committed to user privacy and minimizing data collection. We only use essential cookies that are necessary for the website to function properly. We do not use any tracking or advertising cookies that would collect personal information about you.</p>
      </section>
      
      <section>
        <h2>3. Types of Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or logging in. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.</p>
        
        <h3>Third-Party Cookies</h3>
        <p>Our website uses Google AdSense to display advertisements. Google AdSense may use cookies to personalize ads and measure performance. Please refer to Google's cookie policy for more information.</p>
      </section>
      
      <section>
        <h2>4. Managing Cookies</h2>
        <p>Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to browser, and from version to version. You can however obtain up-to-date information about blocking and deleting cookies via these links:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        </ul>
        <p>Please note that restricting cookies may impact the functionality of our website.</p>
      </section>
      
      <section>
        <h2>5. Changes to Our Cookie Policy</h2>
        <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.</p>
      </section>
      
      <section>
        <h2>6. Contact Us</h2>
        <p>If you have any questions about our Cookie Policy, please contact us through the GitHub repository linked on our homepage.</p>
      </section>
      
      <div className="last-updated">Last Updated: April 26, 2025</div>
    </div>
  );
};

export default CookieSupport;
