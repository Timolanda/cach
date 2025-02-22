import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { deployValuationContract } from '@/contracts/deploy/ValuationContract';
import { deployOracleContract } from '@/contracts/deploy/OracleContract';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('Security Tests', () => {
  let valuationContract: Contract;
  let oracleContract: Contract;
  let owner: Signer;
  let attacker: Signer;
  let dataProvider: Signer;
  let mockReentrancyContract: Contract;

  beforeEach(async () => {
    [owner, attacker, dataProvider] = await ethers.getSigners();
    
    // Deploy contracts
    oracleContract = await deployOracleContract();
    valuationContract = await deployValuationContract();

    // Deploy mock malicious contract for reentrancy tests
    const MockReentrancy = await ethers.getContractFactory('MockReentrancyAttack');
    mockReentrancyContract = await MockReentrancy.deploy(valuationContract.address);
  });

  describe('Reentrancy Protection', () => {
    it('should prevent reentrancy in valuation requests', async () => {
      await expect(
        mockReentrancyContract.connect(attacker).attackValuationRequest('0x1234')
      ).to.be.revertedWith('ReentrancyGuard: reentrant call');
    });

    it('should prevent reentrancy in data point submissions', async () => {
      await expect(
        mockReentrancyContract.connect(attacker).attackDataSubmission('0x1234', 1000)
      ).to.be.revertedWith('ReentrancyGuard: reentrant call');
    });
  });

  describe('Integer Overflow Protection', () => {
    it('should handle large numbers safely in price calculations', async () => {
      const assetId = '0x1234';
      const largePrice = ethers.constants.MaxUint256.div(2);
      
      // Submit multiple large price points
      await oracleContract.connect(dataProvider).submitDataPoint(
        assetId,
        largePrice,
        Date.now(),
        85
      );

      // Verify no overflow in average calculation
      const history = await oracleContract.getDataPointHistory(assetId);
      expect(history[0].price).to.equal(largePrice);
    });

    it('should prevent overflow in confidence calculations', async () => {
      const assetId = '0x1234';
      await expect(
        oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          1000,
          Date.now(),
          101 // Over 100%
        )
      ).to.be.revertedWith('Invalid confidence value');
    });
  });

  describe('Access Control', () => {
    it('should prevent unauthorized contract upgrades', async () => {
      const NewImplementation = await ethers.getContractFactory('ValuationContract');
      const newImpl = await NewImplementation.deploy();

      await expect(
        valuationContract.connect(attacker).upgradeTo(newImpl.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should prevent unauthorized parameter changes', async () => {
      const newParams = {
        minDataPoints: 1,
        confidenceThreshold: 1,
        maxValidityPeriod: 1,
        updateDelay: 1
      };

      await expect(
        valuationContract.connect(attacker).updateParameters(newParams)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Data Validation', () => {
    it('should reject malformed input data', async () => {
      const assetId = '0x1234';
      
      await expect(
        oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          -1000, // Negative price
          Date.now(),
          85
        )
      ).to.be.revertedWith('Invalid price value');

      await expect(
        oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          1000,
          Date.now() + 1000000, // Future timestamp
          85
        )
      ).to.be.revertedWith('Invalid timestamp');
    });

    it('should prevent price manipulation through outliers', async () => {
      const assetId = '0x1234';
      
      // Submit normal prices
      await oracleContract.connect(dataProvider).submitDataPoint(assetId, 1000, Date.now(), 85);
      await time.increase(3600);
      await oracleContract.connect(dataProvider).submitDataPoint(assetId, 1050, Date.now(), 85);
      await time.increase(3600);
      
      // Try to submit outlier
      await expect(
        oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          100000, // Extreme outlier
          Date.now(),
          85
        )
      ).to.be.revertedWith('Price deviation too high');
    });
  });

  describe('DoS Protection', () => {
    it('should limit data point history size', async () => {
      const assetId = '0x1234';
      
      // Submit many data points
      for (let i = 0; i < 100; i++) {
        await oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          1000 + i,
          Date.now(),
          85
        );
        await time.increase(3600);
      }

      const history = await oracleContract.getDataPointHistory(assetId);
      expect(history.length).to.be.lte(50); // Assuming max history size is 50
    });

    it('should prevent gas-limit DoS in bulk operations', async () => {
      // Create many assets
      const assets = Array.from({ length: 100 }, (_, i) => ({
        id: ethers.utils.hexZeroPad(ethers.utils.hexlify(i), 32),
        price: 1000 + i
      }));

      // Bulk submission should work within gas limits
      await oracleContract.connect(dataProvider).submitBulkDataPoints(
        assets.map(a => ({
          assetId: a.id,
          price: a.price,
          timestamp: Date.now(),
          confidence: 85
        }))
      );
    });
  });
}); 