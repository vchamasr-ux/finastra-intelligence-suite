export async function fetchCfpbComplaints(bankName: string): Promise<number> {
  // We take the first word to ensure broader matching, e.g., "JPMORGAN CHASE BANK" -> "JPMORGAN"
  const searchName = bankName.split(' ')[0];
  const url = `/api/cfpb/data-research/consumer-complaints/search/api/v1/?searchField=company&searchRegex=true&searchRegexPattern=${encodeURIComponent(searchName)}&size=0`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CFPB API failed with status ${res.status}`);
  }
  
  const data = await res.json();
  return data.hits?.total?.value || 0;
}
