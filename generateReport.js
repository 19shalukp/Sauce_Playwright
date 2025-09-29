const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonDir: 'reports/cucumber-json', 
    output: 'reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    launchReport: false,
};

reporter.generate(options);


