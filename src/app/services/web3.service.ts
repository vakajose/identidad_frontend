import { Injectable } from '@angular/core';
import Web3 from 'web3';
import identityManagementArtifact from '../../assets/IdentityManagement.json';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: any;
  private contract: any;
  private contractAddress: string = environment.contractAddress;
  public account: string = '';

  constructor() {
    this.initWeb3();
  }

  async initWeb3(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.web3 = new Web3(window.ethereum);
          this.account = (await this.web3.eth.getAccounts())[0];
          this.initContract();
          resolve();
        } catch (error) {
          console.error('Usuario rechazó acceso a MetaMask');
          reject('Usuario rechazó acceso a MetaMask');
        }
      } else if (window.web3) {
        this.web3 = new Web3(window.web3.currentProvider);
        this.account = (await this.web3.eth.getAccounts())[0];
        this.initContract();
        resolve();
      } else {
        console.log('No se encontró un proveedor de web3. Por favor, instala MetaMask');
        reject('No se encontró un proveedor de web3. Por favor, instala MetaMask');
      }
    });
  }

  initContract() {
    if (!this.web3 || !this.account) {
      console.error('Web3 no está inicializado correctamente. El contrato no puede ser inicializado.');
      return;
    }

    const abi = (identityManagementArtifact as any).abi;
    this.contract = new this.web3.eth.Contract(abi, this.contractAddress);
  }

  async getAccountInfo() {
    if (!this.web3 || !this.account) {
      throw new Error('Web3 no está inicializado correctamente. Asegúrate de que MetaMask esté conectado.');
    }

    const balanceWei = await this.web3.eth.getBalance(this.account);
    const balanceEth = this.web3.utils.fromWei(balanceWei, 'ether');
    return {
      address: this.account,
      balance: balanceEth
    };
  }

  async registerDocument(docType: string, docHash: string) {
    if (!this.web3 || !this.account || !this.contract) {
      throw new Error('Web3 o el contrato no están inicializados correctamente. Asegúrate de que MetaMask esté conectado.');
    }
    return await this.contract.methods.registerProvider(docType, docHash).send({ from: this.account });
  }

  async authorizeConsumer(consumerAddress: string) {
    if (!this.web3 || !this.account || !this.contract) {
      throw new Error('Web3 o el contrato no están inicializados correctamente. Asegúrate de que MetaMask esté conectado.');
    }
    return await this.contract.methods.authorizeConsumer(consumerAddress).send({ from: this.account });
  }

  async getDocuments(providerAddress: string) {
    if (!this.web3 || !this.account || !this.contract) {
      throw new Error('Web3 o el contrato no están inicializados correctamente. Asegúrate de que MetaMask esté conectado.');
    }
    return await this.contract.methods.getDocuments(providerAddress).call({ from: this.account });
  }

  async getMyDocuments() {
    if (!this.web3 || !this.account || !this.contract) {
      throw new Error('Web3 o el contrato no están inicializados correctamente. Asegúrate de que MetaMask esté conectado.');
    }
    return await this.contract.methods.getMyDocuments().call({ from: this.account });
  }

  async revokeAuthorization(consumerAddress: string) {
    if (!this.web3 || !this.account || !this.contract) {
      throw new Error('Web3 o el contrato no están inicializados correctamente. Asegúrate de que MetaMask esté conectado.');
    }
    return await this.contract.methods.revokeAuthorization(consumerAddress).send({ from: this.account });
  }
  
  async getAuthorizedConsumers() {
    if (!this.web3 || !this.account || !this.contract) {
      throw new Error('Web3 o el contrato no están inicializados correctamente. Asegúrate de que MetaMask esté conectado.');
    }
    return await this.contract.methods.getAuthorizedConsumers().call({ from: this.account });
  }
  
  
}
