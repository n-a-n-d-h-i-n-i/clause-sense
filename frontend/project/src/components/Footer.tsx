import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-dark text-parchment py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-parchment/80">
            Powered by AI — For legal reference only, not a substitute for professional legal advice.
          </p>
          <div className="mt-4 pt-4 border-t border-parchment/20">
            <p className="text-xs text-parchment/60">
              © 2025 ClauseSense. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;