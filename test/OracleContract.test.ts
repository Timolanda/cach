import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { deployOracleContract } from '@/contracts/deploy/OracleContract';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('OracleContract', () => {
  let oracleContract: Contract;
  let owner: Signer;
  let dataProvider: Signer;
  let maliciousActor: Signer;

  beforeEach(async () => {
    [owner, dataProvider, maliciousActor] = await ethers.getSigners();
    oracleContract = await deployOracleContract();
  });

  describe('Security', () => {
    it('should prevent unauthorized data providers', async () => {
      const assetId = '0x1234';
      await expect(
        oracleContract.connect(maliciousActor).submitDataPoint(
          assetId,
          1000,
          Date.now(),
          85
        )
      ).to.be.revertedWith('Unauthorized data provider');
    });

    it('should prevent data manipulation through rapid submissions', async () => {
      const assetId = '0x1234';
      await oracleContract.connect(dataProvider).submitDataPoint(
        assetId,
        1000,
        Date.now(),
        85
      );

      // Try to submit again immediately
      await expect(
        oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          2000, // Trying to manipulate price
          Date.now(),
          85
        )
      ).to.be.revertedWith('Submission too frequent');
    });

    it('should reject data points with unrealistic values', async () => {
      const assetId = '0x1234';
      await expect(
        oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          ethers.constants.MaxUint256, // Unrealistic price
          Date.now(),
          85
        )
      ).to.be.revertedWith('Invalid price value');
    });
  });

  describe('Data Quality', () => {
    it('should maintain data point history', async () => {
      const assetId = '0x1234';
      const dataPoints = [
        { price: 1000, confidence: 85 },
        { price: 1100, confidence: 90 },
        { price: 950, confidence: 88 },
      ];

      for (const point of dataPoints) {
        await oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          point.price,
          Date.now(),
          point.confidence
        );
        await time.increase(3600); // Advance time by 1 hour
      }

      const history = await oracleContract.getDataPointHistory(assetId);
      expect(history.length).to.equal(dataPoints.length);
    });

    it('should properly expire old data points', async () => {
      const assetId = '0x1234';
      await oracleContract.connect(dataProvider).submitDataPoint(
        assetId,
        1000,
        Date.now(),
        85
      );

      // Advance time beyond expiry
      await time.increase(8 * 24 * 60 * 60); // 8 days

      const history = await oracleContract.getDataPointHistory(assetId);
      expect(history.length).to.equal(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent submissions from multiple providers', async () => {
      const assetId = '0x1234';
      const [provider1, provider2, provider3] = await ethers.getSigners();
      
      // Add providers
      await oracleContract.connect(owner).addDataProvider(provider1.address);
      await oracleContract.connect(owner).addDataProvider(provider2.address);
      await oracleContract.connect(owner).addDataProvider(provider3.address);

      // Submit concurrently
      await Promise.all([
        oracleContract.connect(provider1).submitDataPoint(assetId, 1000, Date.now(), 85),
        oracleContract.connect(provider2).submitDataPoint(assetId, 1050, Date.now(), 87),
        oracleContract.connect(provider3).submitDataPoint(assetId, 975, Date.now(), 82),
      ]);

      const history = await oracleContract.getDataPointHistory(assetId);
      expect(history.length).to.equal(3);
    });

    it('should handle asset deletion correctly', async () => {
      const assetId = '0x1234';
      await oracleContract.connect(dataProvider).submitDataPoint(
        assetId,
        1000,
        Date.now(),
        85
      );

      await oracleContract.connect(owner).deleteAssetData(assetId);

      const history = await oracleContract.getDataPointHistory(assetId);
      expect(history.length).to.equal(0);

      // Should allow new submissions after deletion
      await oracleContract.connect(dataProvider).submitDataPoint(
        assetId,
        1100,
        Date.now(),
        90
      );
      
      const newHistory = await oracleContract.getDataPointHistory(assetId);
      expect(newHistory.length).to.equal(1);
    });
  });

  describe('Governance', () => {
    it('should allow owner to update data provider parameters', async () => {
      const newParams = {
        minSubmissionInterval: 1800, // 30 minutes
        maxPriceDeviation: 20, // 20%
        dataPointExpiry: 5 * 24 * 60 * 60, // 5 days
      };

      await oracleContract.connect(owner).updateProviderParameters(newParams);
      
      const params = await oracleContract.getProviderParameters();
      expect(params.minSubmissionInterval).to.equal(newParams.minSubmissionInterval);
      expect(params.maxPriceDeviation).to.equal(newParams.maxPriceDeviation);
      expect(params.dataPointExpiry).to.equal(newParams.dataPointExpiry);
    });

    it('should handle provider removal correctly', async () => {
      await oracleContract.connect(owner).removeDataProvider(dataProvider.address);

      await expect(
        oracleContract.connect(dataProvider).submitDataPoint(
          '0x1234',
          1000,
          Date.now(),
          85
        )
      ).to.be.revertedWith('Unauthorized data provider');
    });
  });
}); 