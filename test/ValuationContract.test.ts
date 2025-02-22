import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { deployValuationContract } from '@/contracts/deploy/ValuationContract';
import { deployOracleContract } from '@/contracts/deploy/OracleContract';

describe('ValuationContract', () => {
  let valuationContract: Contract;
  let oracleContract: Contract;
  let owner: Signer;
  let user: Signer;
  let dataProvider: Signer;

  beforeEach(async () => {
    [owner, user, dataProvider] = await ethers.getSigners();
    
    // Deploy Oracle first
    oracleContract = await deployOracleContract();
    
    // Deploy Valuation contract
    valuationContract = await deployValuationContract();
  });

  describe('Initialization', () => {
    it('should initialize with correct parameters', async () => {
      const params = await valuationContract.getParameters();
      expect(params.minDataPoints).to.equal(5);
      expect(params.confidenceThreshold).to.equal(80);
      expect(params.maxValidityPeriod).to.equal(7 * 24 * 60 * 60);
      expect(params.updateDelay).to.equal(12 * 60 * 60);
    });

    it('should set correct owner and oracle address', async () => {
      expect(await valuationContract.owner()).to.equal(await owner.getAddress());
      expect(await valuationContract.oracle()).to.equal(oracleContract.address);
    });
  });

  describe('Valuation', () => {
    it('should create new valuation request', async () => {
      const assetId = '0x1234';
      const tx = await valuationContract.connect(user).requestValuation(assetId);
      const receipt = await tx.wait();
      
      const event = receipt.events?.find(e => e.event === 'ValuationRequested');
      expect(event?.args?.assetId).to.equal(assetId);
      expect(event?.args?.requester).to.equal(await user.getAddress());
    });

    it('should process valuation with sufficient data points', async () => {
      const assetId = '0x1234';
      const dataPoints = [
        { price: 1000, timestamp: Date.now(), confidence: 85 },
        { price: 1100, timestamp: Date.now(), confidence: 90 },
        { price: 950, timestamp: Date.now(), confidence: 88 },
        { price: 1050, timestamp: Date.now(), confidence: 87 },
        { price: 1025, timestamp: Date.now(), confidence: 92 },
      ];

      // Submit data points through oracle
      for (const point of dataPoints) {
        await oracleContract.connect(dataProvider).submitDataPoint(
          assetId,
          point.price,
          point.timestamp,
          point.confidence
        );
      }

      // Request valuation
      await valuationContract.connect(user).requestValuation(assetId);
      
      // Process valuation
      const tx = await valuationContract.processValuation(assetId);
      const receipt = await tx.wait();
      
      const event = receipt.events?.find(e => e.event === 'ValuationCompleted');
      expect(event?.args?.assetId).to.equal(assetId);
      expect(event?.args?.value).to.be.gt(0);
      expect(event?.args?.confidence).to.be.gte(80);
    });

    it('should reject valuation with insufficient data points', async () => {
      const assetId = '0x1234';
      
      // Submit only 2 data points
      await oracleContract.connect(dataProvider).submitDataPoint(
        assetId,
        1000,
        Date.now(),
        85
      );
      await oracleContract.connect(dataProvider).submitDataPoint(
        assetId,
        1100,
        Date.now(),
        90
      );

      await expect(
        valuationContract.processValuation(assetId)
      ).to.be.revertedWith('Insufficient data points');
    });
  });

  describe('Governance', () => {
    it('should allow owner to update parameters', async () => {
      const newParams = {
        minDataPoints: 3,
        confidenceThreshold: 75,
        maxValidityPeriod: 5 * 24 * 60 * 60,
        updateDelay: 6 * 60 * 60,
      };

      await valuationContract.connect(owner).updateParameters(newParams);
      
      const params = await valuationContract.getParameters();
      expect(params.minDataPoints).to.equal(newParams.minDataPoints);
      expect(params.confidenceThreshold).to.equal(newParams.confidenceThreshold);
      expect(params.maxValidityPeriod).to.equal(newParams.maxValidityPeriod);
      expect(params.updateDelay).to.equal(newParams.updateDelay);
    });

    it('should reject parameter updates from non-owner', async () => {
      const newParams = {
        minDataPoints: 3,
        confidenceThreshold: 75,
        maxValidityPeriod: 5 * 24 * 60 * 60,
        updateDelay: 6 * 60 * 60,
      };

      await expect(
        valuationContract.connect(user).updateParameters(newParams)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
}); 