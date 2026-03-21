const corsHandler = (origin, allowedOrigins, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');

    if (isAllowed) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
};

const runTests = (envVarValue, testCases) => {
    const allowedOrigins = envVarValue
        ? envVarValue.split(',').map(o => o.trim())
        : ['http://localhost:3000', 'http://localhost:5173'];

    console.log(`Testing with CORS_ORIGIN: "${envVarValue || 'DEFAULT'}"`);
    console.log(`  Processed allowedOrigins: [${allowedOrigins.join(', ')}]`);

    let allPassed = true;

    testCases.forEach(tc => {
        corsHandler(tc.origin, allowedOrigins, (err, allowed) => {
            const result = !err && allowed;
            console.log(`  Origin: ${tc.origin || 'None'}`);
            console.log(`    Allowed: ${result} (Expected: ${tc.expectedResult})`);
            if (result === tc.expectedResult) {
                console.log('    ✅ PASS');
            } else {
                console.log('    ❌ FAIL');
                allPassed = false;
            }
        });
    });

    return allPassed;
};

const allSuites = [
    {
        envVar: 'http://allowed.com, http://another-allowed.com ',
        testCases: [
            { origin: 'http://allowed.com', expectedResult: true },
            { origin: 'http://another-allowed.com', expectedResult: true },
            { origin: 'http://disallowed.com', expectedResult: false },
            { origin: null, expectedResult: true }
        ]
    },
    {
        envVar: '*',
        testCases: [
            { origin: 'http://anything.com', expectedResult: true },
            { origin: 'http://localhost:3000', expectedResult: true },
            { origin: null, expectedResult: true }
        ]
    },
    {
        envVar: null, // Test default behavior
        testCases: [
            { origin: 'http://localhost:3000', expectedResult: true },
            { origin: 'http://localhost:5173', expectedResult: true },
            { origin: 'http://disallowed.com', expectedResult: false }
        ]
    }
];

let overallPass = true;
allSuites.forEach(suite => {
    if (!runTests(suite.envVar, suite.testCases)) {
        overallPass = false;
    }
    console.log('---');
});

if (overallPass) {
    console.log('\nAll CORS refined logic unit tests passed!');
    process.exit(0);
} else {
    console.log('\nSome CORS tests failed!');
    process.exit(1);
}
