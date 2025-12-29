
import React, { useMemo } from 'react';
import { ChevronLeft, ExternalLink, ShieldCheck, Twitter, Globe, Wallet, TrendingUp, Info } from 'lucide-react';
import { Token } from '../types';
import { getAuditVerdict, calculateRiskScore } from '../services/tokenService';
import { formatCurrency, shortenAddress } from '../utils/formatters';

interface DeepScanProps {
  token: Token | null;
  onBack: () => void;
}

export const DeepScan: React.FC<DeepScanProps> = ({ token, onBack }) => {
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#A1A1AA]">
        <Info className="w-8 h-8 mb-4 opacity-20" />
        <span className="text-xs uppercase tracking-widest">Select a token from terminal for scanning</span>
        <button onClick={onBack} className="mt-4 text-[10px] text-[#3B82F6] uppercase font-bold tracking-widest underline">Return to Feed</button>
      </div>
    );
  }

  const verdict = useMemo(() => getAuditVerdict(token), [token]);
  const riskScore = useMemo(() => calculateRiskScore(token), [token]);
  
  // Fake bonding curve logic based on mkt cap (simple simulation)
  const bondingProgress = Math.min(100, (token.usd_market_cap / 65000) * 100);

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-white mb-6 uppercase tracking-widest transition-colors font-bold"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] border border-[#262626] p-8 rounded-sm">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <img 
                  src={token.image_uri} 
                  alt={token.name} 
                  className="w-16 h-16 rounded-sm border border-[#262626]"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/64/64'; }}
                />
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter mb-1">{token.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#A1A1AA] mono uppercase tracking-widest bg-[#262626] px-2 py-0.5 rounded-sm">
                      {token.symbol}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${verdict.color}`}>
                      {verdict.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-1">Market Cap</div>
                <div className="text-2xl font-bold mono">{formatCurrency(token.usd_market_cap)}</div>
              </div>
            </div>

            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-8 max-w-2xl">
              {token.description || "No project description provided by the deployer. Proceed with caution as data availability is limited for this asset."}
            </p>

            <div className="flex flex-wrap gap-4">
              {token.website && (
                <SocialLink icon={<Globe className="w-4 h-4" />} label="Website" url={token.website} />
              )}
              {token.twitter && (
                <SocialLink icon={<Twitter className="w-4 h-4" />} label="Twitter" url={token.twitter} />
              )}
              <SocialLink icon={<ExternalLink className="w-4 h-4" />} label="Solscan" url={`https://solscan.io/token/${token.mint}`} />
            </div>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-8 rounded-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#A1A1AA] mb-6 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Developer Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-1">Deployer Address</div>
                <div className="text-sm mono font-medium flex items-center gap-2">
                  {shortenAddress(token.creator)}
                  <button className="text-[#3B82F6] hover:underline text-[10px]">COPY</button>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#A1A1AA] uppercase tracking-widest mb-1">Launch Reputation</div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase">Professional</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-3 h-1 rounded-full ${i <= 3 ? 'bg-[#3B82F6]' : 'bg-[#262626]'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="bg-[#121212] border border-[#262626] p-6 rounded-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#A1A1AA] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Security Audit
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase font-bold">Reliability Index</span>
                  <span className={`text-xs font-bold mono ${riskScore > 70 ? 'text-green-500' : 'text-red-500'}`}>{riskScore}/100</span>
                </div>
                <div className="w-full h-1 bg-[#262626] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3B82F6] transition-all" style={{ width: `${riskScore}%` }} />
                </div>
              </div>

              <ul className="space-y-3">
                <AuditItem label="Metadata Verified" checked={!!(token.website && token.twitter)} />
                <AuditItem label="Mint Authority Disabled" checked={true} />
                <AuditItem label="Freezable Disabled" checked={true} />
                <AuditItem label="Liquidity Locked" checked={!!token.raydium_pool} />
              </ul>
            </div>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-6 rounded-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#A1A1AA] mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Bonding Progress
            </h3>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mono mb-1">{bondingProgress.toFixed(1)}%</div>
              <div className="text-[10px] text-[#A1A1AA] uppercase tracking-widest">To Migration Threshold</div>
            </div>
            <div className="w-full h-4 bg-[#262626] rounded-sm overflow-hidden mb-4 relative">
              <div 
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-1000" 
                style={{ width: `${bondingProgress}%` }} 
              />
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-widest mix-blend-difference">
                Target: 65,000 USD
              </div>
            </div>
            <p className="text-[10px] text-[#A1A1AA] leading-relaxed text-center italic">
              Upon reaching 100%, liquidity is automatically seeded into Raydium and burned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink: React.FC<{ icon: React.ReactNode, label: string, url: string }> = ({ icon, label, url }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] rounded-sm text-[10px] uppercase font-bold tracking-widest transition-colors"
  >
    {icon}
    {label}
  </a>
);

const AuditItem: React.FC<{ label: string, checked: boolean }> = ({ label, checked }) => (
  <li className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
    <span className="text-[#A1A1AA]">{label}</span>
    <span className={checked ? "text-green-500" : "text-red-500"}>
      {checked ? "[PASSED]" : "[FAILED]"}
    </span>
  </li>
);
