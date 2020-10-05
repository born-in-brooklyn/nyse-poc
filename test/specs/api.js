describe('Stock directory page', () => {

    firstLink = () => $("//tr[1]/td[1]/a");
    lastLink = () => $("//tr[last()]/td[1]/a");

    firstName = () => $("//tr[1]/td[2]");

    beforeEach(() => {
        browser.url('https://www.nyse.com/listings_directory/stock');

        browser.addCommand('makeStockFilterRequest', function (filter) {
            var request = require('request-promise');
        
            var args = {
                encoding: 'utf8',
                uri: 'https://www.nyse.com/api/quotes/filter',
                method: 'POST',
                json: true,
                body: { 
                "instrumentType": "EQUITY",
                "pageNumber": 1,
                "sortColumn": "NORMALIZED_TICKER",
                "sortOrder": "ASC",
                "maxResultsPerPage": 10,
                "filterToken": `${filter}`
                },
                headers: { "Content-Type": "application/json" }
            };
        
            return request(args).then((result) => {
                return result;
            }).catch((result) => {
                console.log(result);
            });
        });
    });

    it('symbol link matched api url', () => {

        //get the expected name and symbol
        var expectedName = firstName().getText();
        var expectedSymbol = firstLink().getText();
        var expectedUrl = firstLink().getAttribute('href');

        var response = browser.makeStockFilterRequest(expectedSymbol);
        expect(response).toBeDefined();
        expect(response.length).toEqual(1);
        expect(response[0].instrumentName).toEqual(expectedName);
        expect(response[0].url).toEqual(expectedUrl);
    });
});