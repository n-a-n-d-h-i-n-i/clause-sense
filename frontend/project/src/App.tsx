import { useState } from 'react';
import Header from './components/Header';
import SearchArea from './components/SearchArea';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';

export interface ParsedQuery {
  age?: number;
  location?: string;
  procedure?: string;
  policy_duration?: string;
  [key: string]: string | number | undefined;
}

export interface ClauseData {
  dataset: string;
  clause_ref: string;
  excerpt: string;
}

export interface BackendResponse {
  parsed_query: ParsedQuery;
  decision: Decision;
  clauses_used: ClauseData[];
}

export interface Clause extends ClauseData {
  id: string;
  highlighted?: boolean;
}

export interface Decision {
  status: 'Approved' | 'Rejected' | 'Pending';
  amount?: string;
  justification: string;
}

// ✅ Use env var for backend URL (Render/Netlify) or fallback to local
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function App() {
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery>({});
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedClause, setHighlightedClause] = useState<string | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);

  const convertToClauseFormat = (clausesData: ClauseData[]): Clause[] => {
    return clausesData.map((clause, index) => ({
      ...clause,
      id: `clause-${index + 1}`,
    }));
  };

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setShowResults(false);

    try {
      const res = await fetch(`${API_BASE}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: BackendResponse = await res.json();

      setParsedQuery(data.parsed_query || {});
      setClauses(convertToClauseFormat(data.clauses_used || []));
      setDecision(data.decision || null);

    } catch (error) {
      console.error("Error fetching from backend:", error);
      setParsedQuery({});
      setClauses([]);
      setDecision({
        status: 'Rejected',
        justification: 'Error contacting backend or processing query.',
      });
    } finally {
      setIsSearching(false);
      setShowResults(true);
    }
  };

  const handleClauseReference = (clauseRef: string) => {
    const targetClause = clauses.find(clause =>
      clause.clause_ref === clauseRef
    );

    if (targetClause) {
      setHighlightedClause(targetClause.id);
      setTimeout(() => {
        setHighlightedClause(null);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-parchment text-navy-dark font-sans">
      <Header />

      <main className="pt-20 pb-20">
        <SearchArea
          onSearch={handleSearch}
          isSearching={isSearching}
          parsedQuery={parsedQuery}
        />

        {showResults && decision && (
          <ResultsSection
            clauses={clauses}
            decision={decision}
            highlightedClause={highlightedClause}
            onClauseReference={handleClauseReference}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

