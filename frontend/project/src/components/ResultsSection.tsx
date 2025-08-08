import React, { useRef, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import type { Clause, Decision } from '../App';

interface ResultsSectionProps {
  clauses: Clause[];
  decision: Decision;
  highlightedClause: string | null;
  onClauseReference: (clauseId: string) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  clauses,
  decision,
  highlightedClause,
  onClauseReference,
}) => {
  const clauseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (highlightedClause && clauseRefs.current[highlightedClause]) {
      clauseRefs.current[highlightedClause]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightedClause]);

  const getStatusIcon = (status: Decision['status']) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = (status: Decision['status']) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600';
      case 'Rejected':
        return 'text-red-600';
    }
  };

  // Group clauses by dataset
  const groupedClauses = clauses.reduce((acc, clause) => {
    if (!acc[clause.dataset]) {
      acc[clause.dataset] = [];
    }
    acc[clause.dataset].push(clause);
    return acc;
  }, {} as Record<string, Clause[]>);

  const renderJustificationWithLinks = (justification: string) => {
    // Find clause references in the justification text
    const clauseRefs = clauses.map(c => c.clause_ref);
    let result = justification;
    
    clauseRefs.forEach(ref => {
      if (result.includes(ref)) {
        result = result.replace(
          ref,
          `<button class="text-gold-accent hover:underline font-medium cursor-pointer" onclick="handleClauseClick('${ref}')">${ref}</button>`
        );
      }
    });
    
    return result;
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Retrieved Clauses */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-navy-dark mb-6">
              Retrieved Clauses
            </h3>
            
            {Object.entries(groupedClauses).map(([dataset, datasetClauses], datasetIndex) => (
              <div key={dataset} className="space-y-4">
                {/* Dataset Header */}
                <div className="flex items-center space-x-2 pb-2 border-b border-navy-dark/20">
                  <FileText className="w-5 h-5 text-gold-accent" />
                  <h4 className="font-serif text-lg font-semibold text-navy-dark">
                    {dataset}
                  </h4>
                </div>
                
                {/* Clauses in this dataset */}
                {datasetClauses.map((clause, clauseIndex) => (
                  <div
                    key={clause.id}
                    ref={(el) => (clauseRefs.current[clause.id] = el)}
                    className={`p-6 bg-white rounded-lg border-l-4 border-gold-accent shadow-sm animate-fade-in transition-all duration-300 ${
                      highlightedClause === clause.id
                        ? 'animate-highlight-flash bg-clause-highlight'
                        : ''
                    }`}
                    style={{ animationDelay: `${(datasetIndex * datasetClauses.length + clauseIndex) * 150}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-navy-dark">
                        {clause.clause_ref}
                      </h5>
                      <button className="flex items-center space-x-1 text-sm text-gold-accent hover:underline">
                        <span>View in full doc</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-navy-dark/80 leading-relaxed">
                      {clause.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right Panel - Decision Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="p-8 bg-white rounded-lg shadow-lg border border-navy-dark/10 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                {getStatusIcon(decision.status)}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-navy-dark">
                    Decision Summary
                  </h3>
                  <p className={`text-lg font-semibold ${getStatusColor(decision.status)}`}>
                    {decision.status}
                  </p>
                </div>
              </div>

              {decision.amount && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium mb-1">Approved Amount</p>
                  <p className="text-2xl font-bold text-green-700">{decision.amount}</p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold text-navy-dark mb-3">Justification</h4>
                <div className="text-navy-dark/80 leading-relaxed">
                  {decision.justification.split(/(\([^)]+\)|Section [^,]+|Clause [^,]+)/).map((part, index) => {
                    const matchingClause = clauses.find(clause => 
                      part.includes(clause.clause_ref) || clause.clause_ref.includes(part.trim())
                    );
                    
                    if (matchingClause) {
                      return (
                        <button
                          key={index}
                          onClick={() => onClauseReference(matchingClause.id)}
                          className="text-gold-accent hover:underline font-medium cursor-pointer"
                        >
                          {part}
                        </button>
                      );
                    }
                    return <span key={index}>{part}</span>;
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-navy-dark mb-3">Referenced Clauses</h4>
                <div className="space-y-2">
                  {clauses.map((clause) => (
                    <button
                      key={clause.id}
                      onClick={() => onClauseReference(clause.id)}
                      className="flex items-center justify-between w-full p-3 text-left bg-gray-50 hover:bg-clause-highlight border border-gray-200 rounded-lg transition-colors group"
                    >
                      <div className="text-left">
                        <div className="text-navy-dark font-medium text-sm">{clause.clause_ref}</div>
                        <div className="text-navy-dark/60 text-xs">{clause.dataset}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gold-accent group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;