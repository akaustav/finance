# finance
Solving a financial problem statement

## How to Use:

1. Open the index.html file in a browser.
1. On the text box labeled Symbol, input one stock symbol only (I have not enabled it for multiple symbols at the moment). Example of stock symbols are: IBM, AAPL, MSFT, GOOG, etc.
1. Click the Generate Summary button to download the CSV file containing the Summary data for that symbol.
For instance, for AAPL, the CSV will contain data for stocks of Apple Inc as described on the following page at:
http://finance.yahoo.com/q?s=AAPL

Note: The summary data is being generated from the JSON response at Yahoo Finance API end point at this URL:
http://query.yahooapis.com/v1/public/yql

For instance, for the symbol, IBM, I am using the JSON response at the following URL to create the CSV file:
http://query.yahooapis.com/v1/public/yql?env=http:%2F%2Fdatatables.org%2Falltables.env&format=json&q=select+*+from+yahoo.finance.quotes+where+symbol+in+(%22IBM%22)


## Pending Taks and Possible Enhancements:

1. Fix date format to be a variable instead of hard coding on the filters.
1. Accept multiple stock symbols and generate:
    a. One file each (summary, calls and puts) each for all the stock symbols? Or
    b. One file each for each stock symbol?
1. Research REST end point URL for Fetching Calls and Puts Data from the Yahoo API or any other API. 
