
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Token } from '../types';
import { fetchTokens, calculateRiskScore } from '../services/tokenService';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';

interface TerminalProps {
  onTokenSelect: (token: Token) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onTokenSelect }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [pulsingMints, setPulsingMints] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    const data = await fetchTokens();
    
    // Simple diff to find "new" ones for the pulse effect
    const newMints = new Set<string>();
    data.forEach(t => {
      if (!tokens.find(existing => existing.mint === t.mint)) {
        newMints.add(t.mint);
      }
    });
    
    setPulsingMints(newMints);
    setTokens(data);
    setLoading(false);
    setLastUpdate(Date.now());
    
    // Clear pulsing after 2s
    setTimeout(() => setPulsingMints(new Set()), 2000);
  }, [tokens]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading && tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#A1A1AA]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest">Establishing Secure Feed...</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Live Terminal</h1>
          <p className="text-xs text-[#A1A1AA] uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Monitoring New Solana Deployments
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#A1A1AA] font-medium uppercase mono">
          <RefreshCw className="w-3 h-3 animate-spin-slow" />
          Last Update: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      <div className="bg-[#121212] border border-[#262626] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-[#262626]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#A1A1AA] font-bold">Token</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#A1A1AA] font-bold">Mkt Cap</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#A1A1AA] font-bold">Created</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#A1A1AA] font-bold">Risk Index</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#A1A1AA] font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#A1A1AA] text-sm italic">
                    No matching liquidity pools detected in the last scan.
                  </td>
                </tr>
              ) : (
                tokens.map((token) => {
                  const riskScore = calculateRiskScore(token);
                  const isPulsing = pulsingMints.has(token.mint);
                  
                  return (
                    <tr 
                      key={token.mint}
                      onClick={() => onTokenSelect(token)}
                      className={`hover:bg-[#1A1A1A] transition-colors duration-200 cursor-pointer group ${isPulsing ? 'animate-pulse-row' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={token.image_uri} 
                            alt={token.symbol} 
                            className="w-8 h-8 rounded-sm grayscale group-hover:grayscale-0 transition-all border border-[#262626]"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/32/32'; }}
                          />
                          <div>
                            <div className="font-bold text-sm tracking-tight">{token.name}</div>
                            <div className="text-[10px] text-[#A1A1AA] mono uppercase">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 mono text-sm font-medium">
                        {formatCurrency(token.usd_market_cap)}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#A1A1AA] font-medium">
                        {formatTimeAgo(token.created_timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 w-24 h-1 bg-[#262626] rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                riskScore > 70 ? 'bg-green-500' : riskScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${riskScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] mono font-bold">{riskScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] group-hover:text-[#3B82F6] transition-colors">
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#121212]/50 border border-[#262626] border-dashed rounded-sm flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-[#A1A1AA] uppercase tracking-wide">
          Notice: This terminal provides high-frequency data for newly deployed tokens. Risk scores are calculated based on metadata presence and on-chain heuristics. Always conduct institutional-grade diligence before committing capital.
        </p>
      </div>
    </div>
  );
};
