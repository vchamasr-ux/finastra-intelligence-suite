import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '.env') });
import { fetchFedFundsRate, fetchPopulationGrowth } from './src/lib/external/fred_api';
import { fetchCFPBComplaints } from './src/lib/external/cfpb_api';

async function testAll() {
  console.log('Testing APIs...');
  try {
    const fedFunds = await fetchFedFundsRate();
    console.log('[FRED] Fed Funds Rate:', fedFunds);
  } catch (err: any) {
    console.error('[FRED] Fed Funds Rate Error:', err.message);
  }

  try {
    const popNY = await fetchPopulationGrowth('NY');
    console.log('[FRED Census] NY Population Growth:', popNY);
  } catch (err: any) {
    console.error('[FRED Census] NY Population Growth Error:', err.message);
  }

  try {
    const popTX = await fetchPopulationGrowth('TX');
    console.log('[FRED Census] TX Population Growth:', popTX);
  } catch (err: any) {
    console.error('[FRED Census] TX Population Growth Error:', err.message);
  }

  try {
    const cfpb = await fetchCFPBComplaints('JPMorgan Chase Bank, National Association');
    console.log('[CFPB] JPM Complaints:', cfpb);
  } catch(err: any){
    console.error('[CFPB] Error:', err.message);
  }
}

testAll();
