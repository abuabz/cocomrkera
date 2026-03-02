// Quick test script to verify backend connectivity
// Run with: node test-backend.js

const https = require('https');

const BACKEND_URL = 'https://mrkerabackend.metrotoystore.com';

const testEndpoint = (path) => {
    return new Promise((resolve, reject) => {
        const url = `${BACKEND_URL}${path}`;
        console.log(`\n🔍 Testing: ${url}`);
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ SUCCESS (${res.statusCode})`);
                    try {
                        const json = JSON.parse(data);
                        console.log('Response:', JSON.stringify(json, null, 2).substring(0, 200));
                    } catch (e) {
                        console.log('Response:', data.substring(0, 200));
                    }
                    resolve(true);
                } else {
                    console.log(`❌ FAILED (${res.statusCode})`);
                    console.log('Response:', data.substring(0, 200));
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.log(`❌ ERROR: ${err.message}`);
            reject(err);
        });
    });
};

const runTests = async () => {
    console.log('🚀 Backend Connectivity Test');
    console.log('=' .repeat(50));
    
    const tests = [
        { name: 'Root', path: '/' },
        { name: 'Health Check', path: '/api/health' },
        { name: 'Dashboard Stats', path: '/api/stats/dashboard' },
        { name: 'Employees', path: '/api/employees' },
        { name: 'Customers', path: '/api/customers' },
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        try {
            const result = await testEndpoint(test.path);
            if (result) passed++;
            else failed++;
        } catch (err) {
            failed++;
        }
        await new Promise(r => setTimeout(r, 500)); // Wait between requests
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('\n✅ Backend is fully operational!');
        console.log('👉 Issue is with frontend environment variables in Vercel');
        console.log('👉 Follow instructions in FIX_LIVE_DEPLOYMENT.md');
    } else {
        console.log('\n⚠️  Backend has issues!');
        console.log('👉 Check Render logs for errors');
    }
};

runTests();
