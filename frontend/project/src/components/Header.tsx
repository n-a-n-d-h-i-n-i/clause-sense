import React from 'react';
import { Scale, HelpCircle, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-parchment border-b border-navy-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-navy-dark rounded-lg">
              <Scale className="w-6 h-6 text-parchment" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-navy-dark">
              ClauseSense
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-navy-dark/5 transition-colors">
              <HelpCircle className="w-5 h-5 text-navy-dark/70" />
            </button>
            <button className="p-2 rounded-lg hover:bg-navy-dark/5 transition-colors">
              <Settings className="w-5 h-5 text-navy-dark/70" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;