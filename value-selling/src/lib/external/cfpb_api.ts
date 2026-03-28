export async function fetchCfpbComplaints(bankName: string): Promise<number> {
  // Use the full bank name with search_term to safely perform a text search
  // instead of searchRegexPattern which can catastrophically match the entire DB
  const url = `/api/cfpb/data-research/consumer-complaints/search/api/v1/?search_term=${encodeURIComponent(bankName)}&size=0`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CFPB API failed with status ${res.status}`);
  }
  
  const data = await res.json();
  return data.hits?.total?.value || 0;
}
