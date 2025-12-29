
import { Token } from '../types';

const PROXY = 'https://corsproxy.io/?';
const API_URL = 'https://frontend-api.pump.fun/coins?offset=0&limit=25&sort=created_timestamp&order=DESC';

export const fetchTokens = async (): Promise<Token[]> => {
  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(API_URL)}`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    
    // Filter out tokens that are already on Raydium for 'New Created' feel
    // and those without basic info
    return (data as Token[]).filter(coin => !coin.raydium_pool && coin.symbol);
  } catch (error) {
    console.error('Failed to fetch tokens:', error);
    return [];
  }
};

export const calculateRiskScore = (token: Token): number => {
  let score = 100;
  if (!token.website) score -= 30;
  if (!token.twitter) score -= 20;
  if (!token.telegram) score -= 10;
  
  // Basic heuristics for "shady" names
  const lowerName = token.name.toLowerCase();
  if (lowerName.includes('rug') || lowerName.includes('scam')) score -= 40;
  
  return Math.max(0, score);
};

export const getAuditVerdict = (token: Token): { status: string; color: string } => {
  if (token.twitter && token.website) {
    return { status: "VERIFIED ORIGIN", color: "text-[#A1A1AA]" };
  }
  if (!token.twitter && !token.website) {
    return { status: "ANONYMOUS DEPLOYER", color: "text-red-500/80" };
  }
  return { status: "UNVERIFIED ENTITY", color: "text-yellow-500/80" };
};
