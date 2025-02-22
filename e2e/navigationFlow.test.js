describe('Navigation Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    // Assume we're logged in for this test
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.text('Login')).tap();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate through main tabs', async () => {
    await expect(element(by.text('Welcome to Cach'))).toBeVisible();
    
    await element(by.text('Marketplace')).tap();
    await expect(element(by.text('Active Listings'))).toBeVisible();
    
    await element(by.text('Wallet')).tap();
    await expect(element(by.text('Total Balance'))).toBeVisible();
    
    await element(by.text('Crowdfunding')).tap();
    await expect(element(by.text('Active Campaigns'))).toBeVisible();
    
    await element(by.text('Profile')).tap();
    await expect(element(by.text('Account Settings'))).toBeVisible();
  });

  it('should navigate to asset details', async () => {
    await element(by.text('Marketplace')).tap();
    await element(by.text('Asset 1')).tap();
    await expect(element(by.text('Asset Details'))).toBeVisible();
  });

  it('should navigate to campaign details', async () => {
    await element(by.text('Crowdfunding')).tap();
    await element(by.text('Campaign 1')).tap();
    await expect(element(by.text('Campaign Details'))).toBeVisible();
  });
});

