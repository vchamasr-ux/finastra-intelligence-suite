import type { BankIntel } from './engine';
import { buildAccountHypothesis } from './hypothesis';

export function downloadCampaignCsv(banks: BankIntel[], pillar: 'all' | 'lending' | 'payments', productFilter: string = 'all') {
  if (banks.length === 0) {
    console.warn('No banks to export.');
    return;
  }

  const isProductMode = productFilter !== 'all';

  const headers = [
    'FDIC_Cert',
    'Bank_Name',
    'State',
    'Total_Assets_Thousands',
    'Asset_Tier',
    'Primary_Entry_Point',
    'Top_Product_Match',
    'Product_Fit_Score',
    'Score_Reason_1',
    'Score_Reason_2',
    'Score_Reason_3',
    '2nd_Product_Match',
    '2nd_Product_Score',
    '3rd_Product_Match',
    '3rd_Product_Score',
    'Outreach_Hook',
    'Export_Date'
  ];

  const exportDate = new Date().toISOString().split('T')[0];

  const rows = banks.map(b => {
    let topProduct = '';
    let productScore = '';
    let reasons: string[] = [];

    if (isProductMode) {
      const prod = b.productScores?.find(p => p.productName === productFilter);
      topProduct = productFilter;
      productScore = prod ? prod.score.toString() : '0';
      reasons = prod?.reasons || [];
    } else {
      topProduct = b.productScores?.[0]?.productName || '';
      productScore = (b.productScores?.[0]?.score || 0).toString();
      reasons = b.productScores?.[0]?.reasons || [];
    }

    const reason1 = reasons[0] || '';
    const reason2 = reasons[1] || '';
    const reason3 = reasons[2] || '';

    const second = b.productScores?.[1];
    const third = b.productScores?.[2];

    const hypothesis = buildAccountHypothesis(b);

    const esc = (str: string) => `"${str.replace(/"/g, '""')}"`;

    return [
      b.fdicCert,
      esc(b.name),
      b.state,
      b.totalAssets.toString(),
      b.assetTier,
      b.primaryEntryPoint,
      esc(topProduct),
      productScore,
      esc(reason1),
      esc(reason2),
      esc(reason3),
      second ? esc(second.productName) : '',
      second ? second.score.toString() : '',
      third ? esc(third.productName) : '',
      third ? third.score.toString() : '',
      esc(hypothesis.hook),
      exportDate
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const safeName = isProductMode ? productFilter.replace(/[^a-zA-Z0-9]/g, '_') : pillar;
  link.setAttribute('download', `finastra_campaign_${safeName}_${exportDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
