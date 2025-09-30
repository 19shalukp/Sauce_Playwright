# Sauce_Playwright
To see the report generated from Github actions, 
download both allure report and allure results ( from Summary tab --> artifacts) in one directory 
Run the command "allure open allure-report" from that directory. 
The html will show as loading if you try to open the html file directly or from an incorrect directory or if you keep the allure-results and 
allure-report in separate directories.

To see the report, if you run locally, run the commands from the root directory of the project.
"npm run test-regression-default"
"allure generate reports/allure-results --clean -o reports/allure-report"
"allure open reports/allure-report"

State of login is used only for sort and product features as we are not testing the login feature for sort/product feature files.

Few issues I came across are-
 - Lets user place an order even when no products are added
 - Cannot add more than 1 qty
 - A product added from one login is shown in another login
 - There is a data breach pop up shown with every login, I am just handling it to proceed with the scenarios under test

There are more tests that could be added however I added the tests that I could finish within the time constraints.
Failures shown in the report are expected ones.
