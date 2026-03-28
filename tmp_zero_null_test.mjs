import fs from 'fs';
import https from 'https';

const URL2 = 'https://api.fdic.gov/banks'; // What is in the code currently

const fetchUrl = (url) => new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node/Test' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try { resolve(JSON.parse(data)); }
            catch(e) { resolve({ error: 'JSON Parse Error', raw: data.substring(0, 500) }); }
        });
    }).on('error', err => reject(err));
});

async function run() {
    let output = {};
    
    // TD Bank check
    const finUrl = `${URL2}/financials?filters=CERT:33653&fields=CERT,REPDTE,ASSET,DEP,EEFFR,ROA,ROE,ROEQ,ROAA,NIMY,NETINC,LNLSNET,NONII,NONIX&sort_by=REPDTE&sort_order=DESC&limit=1`;
    const finData = await fetchUrl(finUrl);
    if (finData.data && finData.data.length > 0) {
        output.tdBank = finData.data[0].data;
    } else {
        output.tdBank = { error: 'No financials returned', raw: finData };
    }

    // Top 100 banks zero/null check
    const instUrl = `${URL2}/institutions?fields=CERT,NAME&sort_by=ASSET&sort_order=DESC&limit=100`;
    const instData = await fetchUrl(instUrl);
    if (!instData.data) { console.log('Failed fetching insts'); return; }

    const certs = instData.data.map(i => i.data.CERT);
    const names = {};
    instData.data.forEach(i => names[i.data.CERT] = i.data.NAME);
    
    const coreMetrics = ['ASSET', 'DEP', 'ROE', 'ROA', 'EEFFR', 'NETINC'];
    const missingMetrics = [];

    // Batch in 20s
    for (let i = 0; i < certs.length; i += 20) {
        const chunk = certs.slice(i, i+20).join(' OR CERT:');
        const filterStr = `(CERT:${chunk})`;
        const url = `${URL2}/financials?filters=${encodeURIComponent(filterStr)}&fields=CERT,REPDTE,${coreMetrics.join(',')}&sort_by=REPDTE&sort_order=DESC&limit=100`;
        const res = await fetchUrl(url);

        if (res.data) {
            const mapByCert = {};
            for (let r of res.data) {
                const c = r.data.CERT;
                if (!mapByCert[c]) mapByCert[c] = r.data; // take most recent REPDTE
            }

            for (let c of certs.slice(i, i+20)) {
                const data = mapByCert[c];
                if (!data) {
                    missingMetrics.push({ CERT: c, NAME: names[c], Missing: ['All Data'] });
                    continue;
                }
                const missingForBank = [];
                for (let m of coreMetrics) {
                    if (data[m] === null || data[m] === undefined || data[m] === '') missingForBank.push(m);
                }
                if (missingForBank.length > 0) {
                    missingMetrics.push({ CERT: c, NAME: names[c], Missing: missingForBank, REPDTE: data.REPDTE });
                }
            }
        } else {
           missingMetrics.push({ error: 'Failed batch fetching', chunk: filterStr, response: res});
        }
        await new Promise(r => setTimeout(r, 500));
    }

    output.missingMetrics = missingMetrics;
    fs.writeFileSync('result.json', JSON.stringify(output, null, 2));
    console.log('Results written to result.json');
}

run();
