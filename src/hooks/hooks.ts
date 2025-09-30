import { chromium, firefox, webkit, devices,Browser,BrowserContextOptions} from 'playwright';
import { Before, After, BeforeAll,AfterAll } from '@cucumber/cucumber';
import config from '../config/config.json';
import { POManager } from '../page_objects/POManager';
import { saveLoginState } from '../utils/login_helper';
import * as path from 'path';
import * as fs from 'fs';

const loginStorageStatePath: string = path.join(process.cwd(), 'src/artifacts/loginState.json');

BeforeAll(function () {
    try{
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
        for (const file of fs.readdirSync(screenshotsDir)) {
            fs.unlinkSync(path.join(screenshotsDir, file));
        }
    }
    } catch (err) {
        console.error("Error in Before All hook:", err);
    }
});

//Save login state for the features requiring login as a prerequisite
Before({ tags: '@sort or @ProductCheckout' }, async function () {
    try{
    const fs = require('fs');
    if (!fs.existsSync(loginStorageStatePath)) {
        await saveLoginState(config.credentials.username, config.credentials.password);
    }
    } catch (err) {
        console.error("Error in Before hook with tags:", err);
    }
});

Before (async function() {
    try {
    let contextOptions: BrowserContextOptions = {};
    
    //if storage path exists, add that into the context options
    if (fs.existsSync(loginStorageStatePath)) {
        contextOptions.storageState = loginStorageStatePath;    
    }

    const isCI = !!process.env.GITHUB_ACTIONS;
    let browserInstance: Browser;
    switch (config.browser.toLowerCase()) {
        case 'chromium':
            browserInstance = await chromium.launch({ headless: isCI });
            break;
        case 'firefox':
            browserInstance = await firefox.launch({ headless: isCI });
            break;
        case 'webkit':
            browserInstance = await webkit.launch({ headless: isCI });
            break;
        default:
            throw new Error(`Unsupported browser: ${config.browser}`);
    }
    this.browser=browserInstance;
    this.context = await browserInstance.newContext(contextOptions);
    this.page = await this.context.newPage(); 
    this.poManager= new POManager(this.page,this.context);
    await this.context.grantPermissions([], { origin: config.baseURL}); // to handle error popup
    await this.context.tracing.start({ screenshots: true, snapshots: true });
    } catch (err) {
        console.error("Error in Before hook:", err);
    }

});

After(async function (scenario  ) {
try {
    if (scenario.result && scenario.result.status === 'FAILED' && this.page) {
        const screenshot= await this.page.screenshot({path: `screenshots/${scenario.pickle.name}.png`});
        this.attach(screenshot, 'image/png');
    }
    if (this.context) {
        await this.context.tracing.stop({path: `traces/${scenario.pickle.name}.zip`});
    }
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
}catch(err){
    console.warn(`After hook failed for scenario ${scenario.pickle.name}:`,err);
}
});

//To delete the login storage state file after all tests are done
AfterAll(async function() { 
    if (fs.existsSync(loginStorageStatePath)) 
        fs.unlinkSync(loginStorageStatePath);
});