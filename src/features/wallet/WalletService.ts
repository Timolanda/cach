import { ethers } from 'ethers';
import { Asset, Transaction } from '@/types/asset';

export class WalletService {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
  }

  async connectWallet(): Promise<string> {
    await this.provider.send("eth_requestAccounts", []);
    return await this.signer.getAddress();
  }

  async getBalance(tokenAddress: string): Promise<string> {
    const contract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );
    const balance = await contract.balanceOf(await this.signer.getAddress());
    return ethers.utils.formatEther(balance);
  }

  async transfer(tokenAddress: string, to: string, amount: string): Promise<Transaction> {
    const contract = new ethers.Contract(
      tokenAddress,
      ['function transfer(address, uint256) returns (bool)'],
      this.signer
    );
    const tx = await contract.transfer(to, ethers.utils.parseEther(amount));
    return await tx.wait();
  }
} 