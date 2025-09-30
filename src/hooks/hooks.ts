import { chromium, firefox, webkit, devices,Browser,BrowserContextOptions} from 'playwright';
import { Before, After, BeforeAll,AfterAll } from '@cucumber/cucumber';
import config from '../config/config.json';
import { POManager } from '../page_objects/POManager';
import { saveLoginState } from '../utils/login_helper';
import * as path from 'path';
import * as fs from 'fs';

const loginStorageStatePath: string = path.join(process.cwd(), 'src/artifacts/loginState.json');

BeforeAll(function () {
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
        for (const file of fs.readdirSync(screenshotsDir)) {
            fs.unlinkSync(path.join(screenshotsDir, file));
        }
    }
});

//Save login state for the features requiring login as a prerequisite
Before({ tags: '@sort or @ProductCheckout' }, async function () {
    const fs = require('fs');
    if (!fs.existsSync(loginStorageStatePath)) {
        await saveLoginState(config.credentials.username, config.credentials.password);
    }
});

Before (async function() {
    let contextOptions: BrowserContextOptions = {};
    
    //if storage path exists, add that into the context options
    if (fs.existsSync(loginStorageStatePath)) {
        contextOptions.storageState = loginStorageStatePath;    
    }
    
    let browserInstance: Browser;
    switch (config.browser.toLowerCase()) {
        case 'chromium':
            browserInstance = await chromium.launch({ headless: false });
            break;
        case 'firefox':
            browserInstance = await firefox.launch({ headless: false });
            break;
        case 'webkit':
            browserInstance = await webkit.launch({ headless: false });
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

});

After(async function (scenario  ) {
try {
    if (scenario.result && scenario.result.status === 'FAILED' && this.page) {
        await this.page.screenshot({path: `screenshots/${scenario.pickle.name}.png`});
        const screenshot = await this.page.screenshot();
        const screenshotBuffer = await this.page.screenshot();
        this.attach(screenshotBuffer, 'image/png');
    }
    if (this.context) {
        await this.context.tracing.stop({path: `traces/${scenario.pickle.name}.zip`});
    }
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
}catch(err){
    console.warn(`After hook failed for scenario ${scenario.pickle.name}:`);
}
});

//To delete the login storage state file after all tests are done
AfterAll(async function() { 
    if (fs.existsSync(loginStorageStatePath)) 
        fs.unlinkSync(loginStorageStatePath);
});