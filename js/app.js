angular.module('finance', ['ngSanitize', 'ngCsv'])
.controller('FinanceController', ['$scope', 'yahooFinanceService',
  function ($scope, yahooFinanceService) {
    // ---
    // PUBLIC PROPERTIES.
    // ---

    $scope.separator = ',';
    $scope.decimalSeparator = '.';
    $scope.today = new Date();

    $scope.summaryBtnDisabled = false;
    $scope.callsBtnDisabled = false;
    $scope.putsBtnDisabled = false;

    $scope.summaryBtnText = 'Generate Summary';
    $scope.callsBtnText = 'Generate Calls';
    $scope.putsBtnText = 'Generate Puts';
    $scope.symbol = 'AAPL';



    // Summary Data
    $scope.summaryHeader = ['Previous Close', 'Open', 'Bid', 'Ask', '1y Target Estimate', 'Beta', 'Earnings Date', "Day's Range", '52 week Range', 'Volume', 'Average Volume (3 months)', 'Market Cap', 'P/E', 'EPS', 'Dividend & Yield'];
    $scope.summaryData = [];

    // Store the summaryData in a 2-dimensional array
    // Each row in the 2-dimensional array is a row on the csv file
    /*
    $scope.summaryData = [
      [94.83, 94.00, 93.79, 93.79, 125.95]
    ];*/

    // Calls Data
    $scope.callsHeader = ['Option', 'Expiration Date', 'Strike Price', 'Contract Name', 'Previous Close', 'Open', 'Bid', 'Ask', "Day's Range", 'Volume', 'Open Interest'];

    // Puts Data
    $scope.putsHeader = ['Option', 'Expiration Date', 'Strike Price', 'Contract Name', 'Previous Close', 'Open', 'Bid', 'Ask', "Day's Range", 'Volume', 'Open Interest'];


    // ---
    // PUBLIC METHODS.
    // ---

    $scope.cancel = function(e) {
      if (e.keyCode == 27) {
        $scope.userForm.userName.$rollbackViewValue();
      }
    };

    $scope.callsData = function() {
      var data = [
        {option: 'AAPL160506C00055000', expirationDate: '2016-05-06', strikePrice: 55.00, contractName: 'AAPL160506C00055000', prevClose: null, open: 38.40, bid: 38.60, ask: 38.90, daysRange: 0.00, volume: 1, openInterest: 0},
        {option: 'AAPL160506C00080000', expirationDate: '2016-05-06', strikePrice: 80.00, contractName: 'AAPL160506C00080000', prevClose: null, open: 12.85, bid: 13.65, ask: 13.90, daysRange: 0.00, volume: 5, openInterest: 0}
      ];

      getCallsData();

      return data;
    };

    $scope.putsData = function() {
      var data = [
        {option: 'AAPL160506P00075000', expirationDate: '2016-05-06', strikePrice: 75.00, contractName: 'AAPL160506P00075000', prevClose: null, open: 0.01, bid: 0.00, ask: 0.02, daysRange: 0.00, volume: 2, openInterest: 4},
        {option: 'AAPL160506P00076000', expirationDate: '2016-05-06', strikePrice: 76.00, contractName: 'AAPL160506P00076000', prevClose: null, open: 0.01, bid: 0.00, ask: 0.02, daysRange: 0.00, volume: 1, openInterest: 0}
      ];

      getPutsData();

      return data;
    };

    $scope.getData = function() {
      // If symbol has a value then 
      if ($scope.symbol) {
        // Call function to fetch Summary data
        $scope.getSummaryData();
        // Call function to fetch Calls data
        // Call function to fetch Puts data
      }
    };

    // I load the symbol summary data from the remote server.
    $scope.getSummaryData = function() {
      // Disable Summary button
      disableSummaryBtn();

      // Change the text on the summary button to 'Fetching...'
      $scope.summaryBtnText = 'Fetching...';

      // The yahooFinanceService returns a promise.
      yahooFinanceService.getSymbolSummary($scope.symbol)
      .then(function( responseData ) {
        // Clean the summary data array
        $scope.summaryData.length = 0;

        var quote = responseData.query.results.quote;
        if ( Array.isArray(quote) ) {
          quote.forEach(function(e) {
            $scope.summaryData.push(convertQuoteObjIntoReqColumns(e));
          });
        } else {
          $scope.summaryData.push(convertQuoteObjIntoReqColumns(quote));
        }

        // Change the text on the summary button back to 'Generate Summary'
        $scope.summaryBtnText = 'Generate Summary';

        // Enable the summary button
        enableSummaryBtn();
      });
    }

    // Call the method to get the data for the default symbol
    $scope.getData();

    // ---
    // PRIVATE METHODS.
    // ---

    function enableSummaryBtn() {
      $scope.summaryBtnDisabled = false;
    }

    function disableSummaryBtn() {
      $scope.summaryBtnDisabled = true;
    }

    function enableCallsBtn() {
      $scope.callsBtnDisabled = false;
    }

    function disableCallsBtn() {
      $scope.callsBtnDisabled = true;
    }

    function enablePutsBtn() {
      $scope.putsBtnDisabled = false;
    }

    function disablePutsBtn() {
      $scope.putsBtnDisabled = true;
    }

    function enableBtns() {
      enableSummaryBtn();
      enableCallsBtn();
      enablePutsBtn();
    }

    function disableBtns() {
      disableSummaryBtn();
      disableCallsBtn();
      disablePutsBtn();
    }

    // I map the quote object returned by Yahoo service into the required Columns Array.
    function convertQuoteObjIntoReqColumns(quote) {
      var newQuote = [];
          newQuote.push(quote.PreviousClose); //Previous Close
          newQuote.push(quote.Open); // Open
          newQuote.push(quote.Bid);  // Bid
          newQuote.push(quote.Ask);  // Ask
          newQuote.push(quote.OneyrTargetPrice); // 1y Target Estimate
          newQuote.push(quote.Change); // Beta
          newQuote.push(quote.LastTradeDate); // Earnings Date
          newQuote.push(quote.DaysRange); // Day’s Range
          newQuote.push(quote.YearRange); // 52 week Range
          newQuote.push(quote.Volume); // Volume
          newQuote.push(quote.AverageDailyVolume); // Average Volume (3 months)
          newQuote.push(quote.MarketCapitalization); // Market Cap
          newQuote.push(quote.PERatio); // P/E
          newQuote.push(quote.EarningsShare); // EPS
          newQuote.push(quote.DividendShare + ' (' + quote.DividendYield + '%)'); // Dividend & Yield

      return newQuote;
    }

    // I load the symbol calls data from the remote server.
    function getCallsData() {
      alert('Unable to find a suitable REST service for fetching the Calls Options Data. Hence serving hard-coded data.');
    }

    // I load the symbol Puts data from the remote server.
    function getPutsData() {
      alert('Unable to find a suitable REST service for fetching the Puts Options Data.  Hence serving hard-coded data.');
    }

  }
])
.service('yahooFinanceService', ['$http', '$q', function($http, $q) {
  return ({
    getSymbolSummary: getSymbolSummary/*,
    getSymbolCalls: getSymbolCalls,
    getSymbolPuts: getSymbolPuts*/
  });

  function getSymbolSummary(symbol) {
    // Query for the Yahoo API call to be used in the params
    var query = 'select * from yahoo.finance.quotes where symbol in ("' + symbol + '")';

    // Params for the Yahoo API call to be used in the getObject
    var params = {};
    params.format = 'json';
    params.env = 'http://datatables.org/alltables.env';
    params.q = query;

    // getObject for the Yahoo API call to be used in the request
    var getObject = {};
    getObject.method = 'GET';
    getObject.url = 'http://query.yahooapis.com/v1/public/yql';
    getObject.params = params;

    var request = $http(getObject);
    return ( request.then( handleSuccess, handleError ) );
  }


  // ---
  // PRIVATE METHODS.
  // ---

  // I transform the successful response, unwrapping the application data
  // from the API response payload.
  function handleSuccess( response ) {
      return( response.data );
  }

  // I transform the error response, unwrapping the application data from
  // the API response payload.
  function handleError( response ) {
      // The API response from the server should be returned in a
      // nomralized format. However, if the request was not handled by the
      // server (or what not handles properly - ex. server error), then we
      // may have to normalize it on our end, as best we can.
      if (
          ! angular.isObject( response.data ) ||
          ! response.data.message
      ) {
          return( $q.reject( "An unknown error occurred." ) );
      }

      // Otherwise, use expected error message.
      return( $q.reject( response.data.message ) );
  }

}]);
