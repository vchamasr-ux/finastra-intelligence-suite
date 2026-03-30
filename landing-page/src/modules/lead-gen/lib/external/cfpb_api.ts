export async function fetchCfpbComplaints(bankName: string): Promise<number> {
  // Strip out common suffixes to improve match rate to CFPB entities without being too generic
  let searchName = bankName
    .replace(/,?\s*(?:INC\.|LLC|CORP\.|CORPORATION|COMPANY|CO\.|NATIONAL ASSOCIATION|N\.A\.|TRUST)\s*$/i, '')
    .trim();
    
  if (searchName.length === 0) searchName = bankName;

  const url = `/api/cfpb/data-research/consumer-complaints/search/api/v1/?searchField=company&searchRegex=true&searchRegexPattern=${encodeURIComponent(searchName)}&size=0`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CFPB API failed with status ${res.status}`);
  }
  
  const data = await res.json();
  return data.hits?.total?.value || 0;
}
