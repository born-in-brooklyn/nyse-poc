describe('Stock directory page', () => {

    waitUntilGreaterThanZero = (selector) => {
        browser.waitUntil(() => {
            var retval = $$(selector);
            return retval.length > 0;
        });
        return $$(selector);
    };

    links = () => waitUntilGreaterThanZero("//tr/td[1]/a");

    pagerItem = (itemText) => $(`//ul[@class='pagination']/li[not(contains(@class,'disabled'))][a[text()='${itemText}']]`); 
    pagerItemDisabled = (itemText) => $(`//ul[@class='pagination']/li[contains(@class,'disabled')][a[text()='${itemText}']]`); 

    pagerFirst = () => pagerItem('First');
    pagerPrevious = () => pagerItem('Previous');
    pagerNext = () => pagerItem('Next');
    pagerLast = () => pagerItem('Last');
    pagerFirstDisabled = () => pagerItemDisabled('First');
    pagerPreviousDisabled = () => pagerItemDisabled('Previous');
    pagerNextDisabled = () => pagerItemDisabled('Next');
    pagerLastDisabled = () => pagerItemDisabled('Last');

    beforeEach(() => {
        browser.url('https://www.nyse.com/listings_directory/stock');
    });

    it('must display Symbol and Name for the corresponding company', () => {
        let symbolHeader = $("//tr/th[1][text()='Symbol']");
        let nameHeader = $("//tr/th[2][text()='Name']");
        expect(symbolHeader).toBeDisplayed();
        expect(nameHeader).toBeDisplayed();
    });


    it('must display data sorted by Symbol (ascending)', () => {
        let elements = links();
        let actual = elements.map((v,i) => v.getText());
        let expected = [...actual].sort();
        expect(actual).toEqual(expected);
    });

    it('must display 10 records per page', () => {
        let actual = links();
        expect(actual.length).toEqual(10);
    });

    it('must provide a pager', () => {
        let pager = $("//ul[@class='pagination']");
        expect(pager).toBeDisplayed();
    });

    it('must start on the first page', () => {
        expect(pagerFirstDisabled()).toBeDisplayed();
        expect(pagerPreviousDisabled()).toBeDisplayed();
        expect(pagerItemDisabled('1')).toBeDisplayed();
        expect(pagerNext()).toBeDisplayed();
        expect(pagerLast()).toBeDisplayed();
    });

    it('takes you to the next page when you click the next page link', () => {
        pagerNext().click();
        expect(pagerFirst()).toBeDisplayed();
        expect(pagerPrevious()).toBeDisplayed();
        expect(pagerItem('1')).toBeDisplayed();
        expect(pagerItemDisabled('2')).toBeDisplayed();
    });

    it('takes you to the last page when you click the last page link', () => {
        pagerLast().click();
        expect(pagerLastDisabled()).toBeDisplayed();
        expect(pagerNextDisabled()).toBeDisplayed();
    });

    it('takes you to the previous page when you click the previous page link', () => {
        pagerNext().click();
        expect(pagerFirst()).toBeDisplayed();
        expect(pagerPrevious()).toBeDisplayed();
        pagerPrevious().click();
        expect(pagerFirstDisabled()).toBeDisplayed();
        expect(pagerPreviousDisabled()).toBeDisplayed();
        expect(pagerItemDisabled('1')).toBeDisplayed();
    });

    it('takes you to the first page when you click the first page link', () => {
        pagerLast().click();
        expect(pagerLastDisabled()).toBeDisplayed();
        expect(pagerNextDisabled()).toBeDisplayed();
        pagerFirst().click();
        expect(pagerFirstDisabled()).toBeDisplayed();
        expect(pagerPreviousDisabled()).toBeDisplayed();
        expect(pagerItemDisabled('1')).toBeDisplayed();
    });
});