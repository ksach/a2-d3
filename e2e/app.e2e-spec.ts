import { A2D3Page } from './app.po';

describe('a2-d3 App', function() {
  let page: A2D3Page;

  beforeEach(() => {
    page = new A2D3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
