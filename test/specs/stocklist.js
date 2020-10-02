describe('Stock directory page', () => {
    beforeEach(async () => {
        await browser.url('https://www.nyse.com/listings_directory/stock');
    });

    it('must display Symbol and Name for the corresponding company', async () => {
        let symbolHeader = await $("//tr/th[1][text()='Symbol']");
        let nameHeader = await $("//tr/th[2][text()='Name']");
        expect(symbolHeader).toBeDisplayed();
        expect(nameHeader).toBeDisplayed();
    });


    it('must display data sorted by Symbol (ascending)', async () => {
        let elements = await $$('//tr/td[1]/a');
        let actual = elements.map((v,i) => v.getText());
        let expected = [...actual].sort();
        expect(actual).toEqual(expected);
    });


    it(' must display 10 records per page', async () => {
        let lastRow = await $('//tr[10]'); 
        expect(lastRow).toBeDisplayed();
        
        let actual = await await $$('//tr/td[1]/a');
        expect(actual.length).toEqual(10);
    });

    it(' must provide a pager', async () => {
        let pager = await $("//ul[@class='pagination']");
        expect(pager).toBeDisplayed();
    });

});