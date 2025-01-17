describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully', async () => {
    await expect(element(by.text('Login to Cach'))).toBeVisible();
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.text('Login')).tap();
    await expect(element(by.text('Welcome to Cach'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await expect(element(by.text('Login to Cach'))).toBeVisible();
    await element(by.id('email-input')).typeText('invalid@example.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.text('Login')).tap();
    await expect(element(by.text('Invalid email or password'))).toBeVisible();
  });
});

