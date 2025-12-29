
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Terminal } from './components/Terminal';
import { DeepScan } from './components/DeepScan';
import { Governance } from './components/Governance';
import { Whitelist } from './components/Whitelist';
import { ViewState, Token } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('terminal');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
    setCurrentView('scan');
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'terminal' && (
        <Terminal onTokenSelect={handleSelectToken} />
      )}
      {currentView === 'scan' && (
        <DeepScan token={selectedToken} onBack={() => setCurrentView('terminal')} />
      )}
      {currentView === 'governance' && (
        <Governance />
      )}
      {currentView === 'whitelist' && (
        <Whitelist />
      )}
    </Layout>
  );
};

export default App;
