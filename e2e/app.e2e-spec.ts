import { AngularTwitterPage } from './app.po';

describe('angular-twitter App', () => {
  let page: AngularTwitterPage;

  beforeEach(() => {
    page = new AngularTwitterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
