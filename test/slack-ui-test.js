const { createForbiddenExclusivityError } = require("mocha/lib/errors");
const { Builder, By, Key } = require("selenium-webdriver");
const { exists } = require("selenium-webdriver/io");
let should = require("chai").should();

//describe block
describe(" Add slack UI test", function () {
    let driver;
    let message = "Hello Everyone have a nice day";
    let serachValue = "has:star";
    let search = 'selenium-test-automation';
    let login = async () => {
        const slackUrl = "https://app.slack.com/client/T036TPN2B0S/C036TPNUPUJ";
        const workspaceName = "testautomation-vr.slack.com";
        const userName = "vaishali.rao08@gmail.com";
        const password = "test12345";

        // load the browser and give workspace, username and password
        await driver.get(slackUrl);
        await driver.sleep(2000);
        await driver.findElement(By.css("input[data-qa='signin_domain_input']")).sendKeys(workspaceName, Key.RETURN);
        await driver.findElement(By.css("input#email")).sendKeys(userName, Key.RETURN);
        await driver.findElement(By.css("input#password")).sendKeys(password, Key.RETURN);
        await driver.sleep(5000);

        //assert using chai should
        let textHeaderValue = await driver.findElement(By.css('div[class="p-view_header__text"] > div[id="c-coachmark-anchor"]')).getText().then(function (value) {
            return value;
        });
        console.log('textHeaderValue ' + textHeaderValue);
        textHeaderValue.should.equal(search);
    }

    before(async function () {
        // launch browser
        driver = await new Builder().forBrowser('chrome').build();
        await login();
    });

    after(async function () {
        //closing browser
        await driver.close();
        await driver.quit();
    });

    //it block
    it("sending message to channel", async function () {
        let messageBox = await driver.findElement(By.css('div[data-qa="message_input"] > div.ql-editor.ql-blank'));
        await messageBox.sendKeys(message, Key.RETURN);
        await driver.sleep(2000);
        let messageboxValue = await driver.findElement(By.css('.c-message_kit__message.p-message_pane_message__message--last'));
        await messageboxValue.click();
        await driver.sleep(5000);

        let savedMsgButton = messageboxValue.findElement(By.css('.c-icon.c-icon--bookmark'));
        await savedMsgButton.click();
        await driver.sleep(5000);


    });

    it("checking saved item in sidebar", async function () {
        let saveitem = await driver.findElement(By.id('Psaved'));
        await saveitem.click();
        await driver.sleep(5000);

        let saveBody = await driver.findElement(By.css('.p-workspace__primary_view_body'));
        let saveBodyListItem = await saveBody.findElement(By.css('.p-saved_page__item--first'));
        let text = await saveBodyListItem.findElement(By.css('.p-rich_text_block')).getText();
        console.log(" text " + text);
        text.should.equal(message);

    });

    it("search message in search bar", async function () {
        await driver.sleep(5000);
        let searchBox = await driver.findElement(By.css('.p-top_nav__search__text')).click();
        let searchInput = await driver.findElement(By.css('.c-search__input_box'));
        let messageField = await searchInput.findElement(By.css('.ql-editor'));
        await messageField.sendKeys(serachValue, Key.RETURN);
        await driver.sleep(15000);

        let messageCount;
        for (let index = 0; index < 100; index++) {
            messageCount = await driver.findElement(By.css('button[id="messages"] > span.c-tabs__tab_count')).getText();
            console.log('messageCount ' + messageCount);
            if (messageCount > 0) {
                break;
            }
            await driver.navigate().refresh();

        }

        if (messageCount > 0) {
            let messageGroup = await driver.findElements(By.css('.c-message_kit__hover'));
            console.log(messageGroup.length);
            if (messageGroup.length > 0) {
                let text = await messageGroup[0].findElement(By.css('.c-message__message_blocks')).getText();
                console.log('Text value = ' + text);
                text.should.equal(message);
                await driver.sleep(5000);
            }

            let buttonClose = await driver.findElement(By.css('button[data-qa="search_page_close_button"]')).click();
            await driver.sleep(1000);
            let buttonsearch = await driver.findElement(By.css('button[data-qa="top_nav_search_clear"]')).click();
            await driver.sleep(1000);
        }
        else {
            throw new Error('No search found');
        }

    });

});