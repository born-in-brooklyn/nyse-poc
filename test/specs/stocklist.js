describe('Stock directory page', () => {

    waitUntilGreaterThanZero = (selector) => {
        browser.waitUntil(() => {
            var retval = $$(selector);
            return retval.length > 0;
        });
    };

    symbolHeader = () => $("//tr/th[1][text()='Symbol']");
    nameHeader = () => $("//tr/th[2][text()='Name']");


    links = () => {
        var linkSelector="//tr/td[1]/a";
        waitUntilGreaterThanZero(linkSelector);   
        return $$(linkSelector);
    }

    firstLink = () => $("//tr[1]/td[1]/a");
    lastLink = () => $("//tr[last()]/td[1]/a");

    firstName = () => $("//tr[1]/td[2]");
    lastName = () => $("//tr[last()]/td[2]");

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
        expect(symbolHeader()).toBeDisplayed();
        expect(nameHeader()).toBeDisplayed();
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

    waitUntilFirstLink = (comparisonFunc) => {
        browser.waitUntil(() => {
            var current = firstLink();
            if(!current.isExisting())
            {
                return false;    
            }
            
            currentText = current.getText();
            return comparisonFunc(currentText);
        });
    };

    it('sorts in symbol reverse order when you click the symbol header', () => {

        var firstSymbol = firstLink().getText();

        pagerLast().click();
        waitUntilFirstLink((currentText) => firstSymbol != currentText)

        var lastSymbol = lastLink().getText();

        pagerFirst().click();
        waitUntilFirstLink((currentText) => firstSymbol == currentText)

        symbolHeader().click();
        waitUntilFirstLink((currentText) => lastSymbol == currentText)

        expect(firstLink().getText()).toEqual(lastSymbol);

        symbolHeader().click();
        waitUntilFirstLink((currentText) => firstSymbol == currentText)
    });

    waitUntilFirstName = (comparisonFunc) => {
        browser.waitUntil(() => {
            var current = firstName();
            if(!current.isExisting())
            {
                return false;    
            }
            
            currentText = current.getText();
            return comparisonFunc(currentText);
        });
    };

    it('sorts in name reverse order when you click the name header', () => {

        var firstNameSortBySymbol = firstName().getText();

        //forward sort by Name
        nameHeader().click();
        waitUntilFirstName((currentText) => firstNameSortBySymbol != currentText)

        var expectedFirstName = firstName().getText();
        
        pagerLast().click();
        waitUntilFirstName((currentText) => expectedFirstName != currentText)

        var actualLastName = lastName().getText();

        //reverse sort by name
        nameHeader().click();
        waitUntilFirstName((currentText) => actualLastName == currentText)

        expect(firstName().getText()).toEqual(actualLastName);

        // forward sort again 
        nameHeader().click();
        waitUntilFirstName((currentText) => expectedFirstName == currentText)
    });

});