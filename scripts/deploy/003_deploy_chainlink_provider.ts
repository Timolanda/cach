import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get Valuation contract address
  const valuation = await get('ValuationProxy');

  // Deploy ChainlinkProvider implementation
  const providerImplementation = await deploy('ChainlinkProvider', {
    from: deployer,
    args: [],
    log: true,
  });

  // Deploy proxy
  const proxy = await deploy('ChainlinkProviderProxy', {
    from: deployer,
    args: [
      providerImplementation.address,
      deployer,
      [], // initialization data
    ],
    log: true,
  });

  // Initialize provider
  const Provider = await hre.ethers.getContractFactory('ChainlinkProvider');
  const provider = Provider.attach(proxy.address);
  
  await provider.initialize(valuation.address);

  // Configure initial price feeds if needed
  const initialFeeds = {
    'ETH-USD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    'BTC-USD': '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    // Add more feeds as needed
  };

  for (const [asset, feed] of Object.entries(initialFeeds)) {
    const assetId = hre.ethers.utils.formatBytes32String(asset);
    await provider.setPriceFeed(assetId, feed);
    console.log(`Configured ${asset} feed: ${feed}`);
  }

  console.log('ChainlinkProvider deployed to:', proxy.address);
};

func.tags = ['ChainlinkProvider'];
func.dependencies = ['Valuation'];
export default func; 