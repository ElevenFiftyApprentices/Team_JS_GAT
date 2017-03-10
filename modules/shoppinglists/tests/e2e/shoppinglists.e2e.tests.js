'use strict';

describe('Shoppinglists E2E Tests:', function () {
  describe('Test Shoppinglists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/shoppinglists');
      expect(element.all(by.repeater('shoppinglist in shoppinglists')).count()).toEqual(0);
    });
  });
});
