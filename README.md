# Sauce_Playwright
Sauce web testing
To see the report, download both allure report and allure results in one directory and run the command "allure open allure-report" from that directory. The html will 
show as loading if you try to open the html file directly or from an incorrect directory or if you keep the allure-results and allure-report in separate directories.

State of login is used only for sort and product features as we are not testing the login feature for sort/product feature files.

Few issues I came across are-
 - Lets user place an order even when no products are added
 - Cannot add more than 1 qty
 - A product added from one login is shown in another login
 - There is a data breach pop up shown with every login, I am just handling it to proceed with the scenarios under test

There are more tests that could be added however I added the tests that I could finish within the time constraints.
