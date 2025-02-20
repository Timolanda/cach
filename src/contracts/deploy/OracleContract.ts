import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { config } from '@/config';

export async function deployOracleContract(): Promise<Contract> {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying OracleContract with account:', deployer.address);

  const OracleContract = await ethers.getContractFactory('OracleContract');
  const contract = await OracleContract.deploy(
    config.governance.address,
    config.dataProviders
  );

  await contract.deployed();
  console.log('OracleContract deployed to:', contract.address);

  return contract;
} 