
import React, { useState } from 'react';
import { Shield, Loader2, CheckCircle2 } from 'lucide-react';

export const Whitelist: React.FC = () => {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    
    setStatus('processing');
    // Simulate mainnet interaction
    setTimeout(() => {
      setStatus('success');
    }, 3500);
  };

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto py-24 text-center animate-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Application Received</h2>
        <p className="text-[#A1A1AA] text-sm mb-8 leading-relaxed">
          Your wallet address has been submitted for institutional verification. Our compliance engine will review your on-chain history within 24 hours.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#3B82F6] hover:underline"
        >
          Submit Another Address
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <Shield className="w-12 h-12 mx-auto mb-6 text-white" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Institutional Access</h1>
        <p className="text-[#A1A1AA] text-sm uppercase tracking-widest font-medium">
          Request Whitelist For Dark Pool Access
        </p>
      </div>

      <div className="bg-[#121212] border border-[#262626] p-10 rounded-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#A1A1AA] mb-3">
              Solana Wallet Address
            </label>
            <input 
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or Solana Base58 Address"
              className="w-full bg-[#050505] border border-[#262626] px-4 py-3 rounded-sm text-sm mono focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          <div className="p-4 bg-[#1A1A1A] border border-[#262626] rounded-sm">
            <h4 className="text-[10px] uppercase font-bold tracking-widest mb-2">Verification Terms</h4>
            <p className="text-[10px] text-[#A1A1AA] leading-relaxed">
              By submitting this request, you authorize Black Pocket to perform a non-custodial scan of your transaction history to verify accreditation status. Access is subject to regional regulatory compliance.
            </p>
          </div>

          <button 
            type="submit"
            disabled={status === 'processing'}
            className="w-full py-4 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#1A1A1A] disabled:text-[#A1A1AA] transition-all rounded-sm text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing On Mainnet...
              </>
            ) : (
              'Request Institutional Access'
            )}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-center text-[10px] text-[#A1A1AA] uppercase tracking-widest">
        Secured by Black Pocket Multi-Sig Compliance Engine
      </p>
    </div>
  );
};
