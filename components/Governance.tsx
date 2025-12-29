
import React from 'react';
import { BookOpen, Shield, Zap, Lock } from 'lucide-react';

export const Governance: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 animate-in fade-in duration-700">
      <div className="mb-16 border-b border-[#262626] pb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Protocol Governance</h1>
        <p className="text-[#A1A1AA] text-lg leading-relaxed">
          The structural framework for institutional-grade token monitoring and liquidity protection on the Solana network.
        </p>
      </div>

      <div className="space-y-16">
        <Section 
          title="Liquidity Protection" 
          icon={<Shield className="w-5 h-5 text-[#3B82F6]" />}
          content="Black Pocket employs a series of non-custodial monitoring agents that track real-time liquidity fluctuations across all major SPL token deployments. Our system identifies anomalous behavior, such as sudden liquidity removal or suspicious developer wallet patterns, providing early warning signals to our whitelisted partners."
        />

        <Section 
          title="Dark Pool Trading" 
          icon={<Lock className="w-5 h-5 text-[#3B82F6]" />}
          content="To minimize market impact for institutional entries, Black Pocket utilizes a decentralized 'Dark Pool' mechanism. This enables large-volume orders to be processed via private transaction channels on Solana, bypassing the public mempool and preventing MEV bot front-running."
        />

        <Section 
          title="Risk Orchestration" 
          icon={<Zap className="w-5 h-5 text-[#3B82F6]" />}
          content="The Risk Index (RI) is a proprietary multi-factor algorithm. It analyzes 48 unique data points, including social media sentiment, developer historical success rates, mint authority status, and smart contract complexity. A score below 40 indicates high-probability insolvency or exploit potential."
        />

        <div className="bg-[#121212] border border-[#262626] p-8 rounded-sm">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold">Standard Operating Procedures</h3>
          </div>
          <ul className="space-y-4 text-sm text-[#A1A1AA]">
            <li className="flex gap-4">
              <span className="mono text-white text-[10px] mt-1">01</span>
              <span>Daily protocol audits are performed by the Black Pocket DAO to ensure feed integrity.</span>
            </li>
            <li className="flex gap-4">
              <span className="mono text-white text-[10px] mt-1">02</span>
              <span>Emergency halts are triggered if gas prices exceed the threshold of 50,000 Lamports to prevent predatory transaction fee spikes.</span>
            </li>
            <li className="flex gap-4">
              <span className="mono text-white text-[10px] mt-1">03</span>
              <span>All metadata verified by the Deep Scan module is hashed on-chain for perpetual immutability.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; content: string }> = ({ title, icon, content }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]">
      {icon}
      <span>{title}</span>
    </div>
    <p className="text-[#A1A1AA] leading-relaxed">
      {content}
    </p>
  </section>
);
