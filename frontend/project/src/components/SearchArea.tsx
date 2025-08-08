import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import type { ParsedQuery } from '../App';

interface SearchAreaProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  parsedQuery: ParsedQuery;
}

const SearchArea: React.FC<SearchAreaProps> = ({ onSearch, isSearching, parsedQuery }) => {
  const [query, setQuery] = useState('');
  const [showChips, setShowChips] = useState(false);

  useEffect(() => {
    if (Object.keys(parsedQuery).length > 0) {
      setTimeout(() => setShowChips(true), 300);
    }
  }, [parsedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowChips(false);
    }
  };

  const chips = Object.entries(parsedQuery).filter(([, value]) => value);

  const formatChipLabel = (key: string): string => {
    switch (key) {
      case 'policy_duration':
        return 'Policy';
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-4xl font-bold text-navy-dark mb-4">
            Intelligent Legal Document Analysis
          </h2>
          <p className="text-lg text-navy-dark/70 max-w-2xl mx-auto">
            Enter your case details, claims, or policy queries for instant clause analysis and decision support.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy-dark/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a case, claim, or policy query…"
                className="w-full pl-12 pr-4 py-4 text-lg bg-white border-2 border-navy-dark/20 rounded-lg focus:border-gold-accent focus:outline-none transition-colors"
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-gold-accent animate-spin" />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="mt-4 w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-navy-dark text-navy-dark font-semibold rounded-lg hover:bg-navy-dark hover:text-parchment focus:bg-gold-accent focus:border-gold-accent focus:text-navy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSearching ? 'Analyzing...' : 'Analyze Document'}
            </button>
          </div>
        </form>

        {/* Parsing Chips */}
        {showChips && chips.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-navy-dark/60 mb-3 text-center">Structured Query Analysis:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {chips.map(([key, value], index) => (
                <div
                  key={key}
                  className="px-3 py-1 bg-white border border-gold-accent text-navy-dark text-sm rounded-full animate-slide-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <span className="font-medium">{formatChipLabel(key)}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchArea;