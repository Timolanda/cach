import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { config } from '@/config';
import { ValuationContract } from '@/types/contracts';

export async function deployValuationContract(): Promise<Contract> {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying ValuationContract with account:', deployer.address);

  const ValuationContract = await ethers.getContractFactory('ValuationContract');
  const contract = await ValuationContract.deploy(
    config.oracle.address,
    config.governance.address
  );

  await contract.deployed();
  console.log('ValuationContract deployed to:', contract.address);

  // Initialize contract with initial parameters
  await contract.initialize({
    minDataPoints: 5,
    confidenceThreshold: 80,
    maxValidityPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
    updateDelay: 12 * 60 * 60, // 12 hours in seconds
  });

  return contract;
} 