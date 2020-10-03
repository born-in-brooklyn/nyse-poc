describe('Stock directory page', () => {

    links = () => {
        var linksSelector ="//tr/td[1]/a";
        browser.waitUntil(() => {
            var retval = $$(linksSelector);
            return retval.length > 0;
        });
        return $$(linksSelector);
    };

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
});