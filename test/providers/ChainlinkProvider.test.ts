import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('ChainlinkProvider', () => {
  let chainlinkProvider: Contract;
  let mockValuationContract: Contract;
  let mockPriceFeed: Contract;
  let owner: Signer;
  let nonOwner: Signer;
  let assetId: string;

  beforeEach(async () => {
    [owner, nonOwner] = await ethers.getSigners();
    
    // Deploy mock contracts
    const MockValuationContract = await ethers.getContractFactory('MockValuationContract');
    mockValuationContract = await MockValuationContract.deploy();

    const MockChainlinkFeed = await ethers.getContractFactory('MockChainlinkFeed');
    mockPriceFeed = await MockChainlinkFeed.deploy();

    // Deploy ChainlinkProvider
    const ChainlinkProvider = await ethers.getContractFactory('ChainlinkProvider');
    chainlinkProvider = await ChainlinkProvider.deploy();
    await chainlinkProvider.initialize(mockValuationContract.address);

    assetId = ethers.utils.formatBytes32String('TEST-ASSET');
  });

  describe('Initialization', () => {
    it('should initialize with correct parameters', async () => {
      const info = await chainlinkProvider.getProviderInfo();
      expect(info.name).to.equal('Chainlink');
      expect(info.details).to.equal('1.0.0');
    });

    it('should not allow reinitialization', async () => {
      await expect(
        chainlinkProvider.initialize(mockValuationContract.address)
      ).to.be.revertedWith('Initializable: contract is already initialized');
    });
  });

  describe('Price Feed Management', () => {
    it('should allow owner to set price feed', async () => {
      await expect(
        chainlinkProvider.connect(owner).setPriceFeed(assetId, mockPriceFeed.address)
      )
        .to.emit(chainlinkProvider, 'PriceFeedUpdated')
        .withArgs(assetId, mockPriceFeed.address);

      expect(await chainlinkProvider.priceFeeds(assetId)).to.equal(mockPriceFeed.address);
    });

    it('should reject invalid price feeds', async () => {
      await expect(
        chainlinkProvider.setPriceFeed(assetId, ethers.constants.AddressZero)
      ).to.be.revertedWithCustomError(chainlinkProvider, 'InvalidPriceFeed');
    });

    it('should allow owner to remove price feed', async () => {
      await chainlinkProvider.setPriceFeed(assetId, mockPriceFeed.address);
      
      await expect(
        chainlinkProvider.removePriceFeed(assetId)
      )
        .to.emit(chainlinkProvider, 'PriceFeedRemoved')
        .withArgs(assetId, mockPriceFeed.address);

      expect(await chainlinkProvider.priceFeeds(assetId)).to.equal(ethers.constants.AddressZero);
    });

    it('should prevent non-owners from managing price feeds', async () => {
      await expect(
        chainlinkProvider.connect(nonOwner).setPriceFeed(assetId, mockPriceFeed.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(
        chainlinkProvider.connect(nonOwner).removePriceFeed(assetId)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Price Updates', () => {
    beforeEach(async () => {
      await chainlinkProvider.setPriceFeed(assetId, mockPriceFeed.address);
    });

    it('should update price data correctly', async () => {
      const price = ethers.utils.parseUnits('1000', 8);
      await mockPriceFeed.setLatestRoundData(1, price, 0, await time.latest(), 1);

      await chainlinkProvider.updateDataSource();

      const latestPoint = await chainlinkProvider.getLatestDataPoint(assetId);
      expect(latestPoint.price).to.equal(price);
      expect(latestPoint.isValid).to.be.true;
    });

    it('should handle stale prices correctly', async () => {
      const oldTimestamp = (await time.latest()) - 2 * 60 * 60; // 2 hours old
      await mockPriceFeed.setLatestRoundData(1, 1000, 0, oldTimestamp, 1);

      await expect(
        chainlinkProvider.updateDataSource()
      ).to.emit(chainlinkProvider, 'ValidationFailed')
        .withArgs(assetId, "Price too old");
    });

    it('should calculate confidence based on price age', async () => {
      const price = ethers.utils.parseUnits('1000', 8);
      const timestamp = await time.latest();
      await mockPriceFeed.setLatestRoundData(1, price, 0, timestamp, 1);

      await chainlinkProvider.updateDataSource();
      const latestPoint = await chainlinkProvider.getLatestDataPoint(assetId);
      
      expect(latestPoint.confidence).to.equal(95); // Should be highest confidence for fresh data
    });

    it('should reject negative prices', async () => {
      await mockPriceFeed.setLatestRoundData(1, -1000, 0, await time.latest(), 1);

      await expect(
        chainlinkProvider.updateDataSource()
      ).to.emit(chainlinkProvider, 'ValidationFailed');
    });
  });

  describe('Data History', () => {
    it('should maintain correct history length', async () => {
      // Submit multiple data points
      for (let i = 0; i < 5; i++) {
        await mockPriceFeed.setLatestRoundData(
          i + 1,
          1000 + i,
          0,
          await time.latest(),
          i + 1
        );
        await chainlinkProvider.updateDataSource();
        await time.increase(300); // 5 minutes
      }

      const history = await chainlinkProvider.getHistoricalData(assetId, 5);
      expect(history.length).to.equal(5);
      expect(history[4].price).to.be.gt(history[0].price);
    });
  });

  describe('Error Handling', () => {
    it('should handle price feed errors gracefully', async () => {
      await mockPriceFeed.setSimulateError(true);

      await expect(
        chainlinkProvider.updateDataSource()
      ).to.emit(chainlinkProvider, 'ValidationFailed')
        .withArgs(assetId, "Price feed error");
    });
  });

  describe('Integration with Valuation Contract', () => {
    beforeEach(async () => {
      await chainlinkProvider.setPriceFeed(assetId, mockPriceFeed.address);
    });

    it('should forward price updates to valuation contract', async () => {
      const price = ethers.utils.parseUnits('1000', 8);
      const timestamp = await time.latest();
      await mockPriceFeed.setLatestRoundData(1, price, 0, timestamp, 1);

      await expect(chainlinkProvider.updateDataSource())
        .to.emit(mockValuationContract, 'DataPointReceived')
        .withArgs(assetId, price, timestamp, 95);
    });

    it('should handle valuation contract errors', async () => {
      await mockValuationContract.setShouldRevert(true);
      const price = ethers.utils.parseUnits('1000', 8);
      await mockPriceFeed.setLatestRoundData(1, price, 0, await time.latest(), 1);

      await expect(chainlinkProvider.updateDataSource())
        .to.be.revertedWith('Simulated error');
    });
  });

  describe('Pause Functionality', () => {
    it('should not allow updates when paused', async () => {
      await chainlinkProvider.pause();
      
      await expect(
        chainlinkProvider.updateDataSource()
      ).to.be.revertedWith('Pausable: paused');
    });

    it('should allow updates after unpause', async () => {
      await chainlinkProvider.pause();
      await chainlinkProvider.unpause();
      
      const price = ethers.utils.parseUnits('1000', 8);
      await mockPriceFeed.setLatestRoundData(1, price, 0, await time.latest(), 1);
      
      await expect(chainlinkProvider.updateDataSource()).to.not.be.reverted;
    });

    it('should only allow owner to pause/unpause', async () => {
      await expect(
        chainlinkProvider.connect(nonOwner).pause()
      ).to.be.revertedWith('Ownable: caller is not the owner');

      await expect(
        chainlinkProvider.connect(nonOwner).unpause()
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Price Deviation Checks', () => {
    beforeEach(async () => {
      await chainlinkProvider.setPriceFeed(assetId, mockPriceFeed.address);
    });

    it('should detect and reject sudden price spikes', async () => {
      // Set initial price
      await mockPriceFeed.setLatestRoundData(
        1,
        ethers.utils.parseUnits('1000', 8),
        0,
        await time.latest(),
        1
      );
      await chainlinkProvider.updateDataSource();

      // Try to update with a massive price increase
      await mockPriceFeed.setLatestRoundData(
        2,
        ethers.utils.parseUnits('2000', 8), // 100% increase
        0,
        await time.latest(),
        2
      );

      await expect(chainlinkProvider.updateDataSource())
        .to.emit(chainlinkProvider, 'ValidationFailed')
        .withArgs(assetId, "Price deviation too high");
    });

    it('should accept normal price movements', async () => {
      // Set initial price
      await mockPriceFeed.setLatestRoundData(
        1,
        ethers.utils.parseUnits('1000', 8),
        0,
        await time.latest(),
        1
      );
      await chainlinkProvider.updateDataSource();

      // Update with a reasonable price change
      await mockPriceFeed.setLatestRoundData(
        2,
        ethers.utils.parseUnits('1050', 8), // 5% increase
        0,
        await time.latest(),
        2
      );

      await expect(chainlinkProvider.updateDataSource()).to.not.be.reverted;
    });
  });

  describe('Gas Optimization', () => {
    it('should efficiently handle multiple updates', async () => {
      // Add multiple price feeds
      const assetCount = 5;
      const assets = Array.from({ length: assetCount }, (_, i) => 
        ethers.utils.formatBytes32String(`ASSET-${i}`)
      );

      for (const asset of assets) {
        await chainlinkProvider.setPriceFeed(asset, mockPriceFeed.address);
      }

      // Measure gas usage for multiple updates
      const tx = await chainlinkProvider.updateDataSource();
      const receipt = await tx.wait();
      
      // Gas used should be reasonable for multiple updates
      expect(receipt.gasUsed).to.be.lt(1000000); // Adjust threshold as needed
    });
  });
}); 