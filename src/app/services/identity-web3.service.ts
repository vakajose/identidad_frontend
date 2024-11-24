import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../environments/environment';
import identityManagementArtifact from '../../assets/IdentityManagement.json';
import { AddressTokenIds, DocumentData } from '../models/token.model';


@Injectable({
  providedIn: 'root'
})
export class IdentityWeb3Service {

  private web3: Web3 | null = null;
  private contract: any = null;
  private account: string = '';
  private contractAddress: string = environment.contractAddress;

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

  // Crear un nuevo token
  async mintToken(tokenType: number, encryptedData: string): Promise<any> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .mintToken(tokenType, encryptedData)
      .send({ from: this.account,  gas: 3000000 });
  }

  // Actualizar un token existente
  async updateToken(tokenId: string, newEncryptedData: string): Promise<any> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .updateToken(tokenId, newEncryptedData)
      .send({ from: this.account,  gas: 3000000  });
  }

  // Autorizar múltiples tokens
  async authorizeMultiple(consumerAddress: string, tokenIds: string[]): Promise<any> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .authorizeMultiple(consumerAddress, tokenIds)
      .send({ from: this.account,  gas: 3000000  });
  }

  // Revocar múltiples autorizaciones
  async revokeMultiple(consumerAddress: string, tokenIds: string[]): Promise<any> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .revokeMultiple(consumerAddress, tokenIds)
      .send({ from: this.account,  gas: 3000000  });
  }

  // Obtener tokens de un proveedor
  async getTokensFromProvider(providerAddress: string): Promise<string[]> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .getTokensFromProvider(providerAddress)
      .call({ from: this.account });
  }

  //Obtener mis tokens
  async getMyTokens(): Promise<string[]> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .getMyTokens()
      .call({ from: this.account, gas: 3000000 });
  }

  // Obtener tokens por tipo
  async getTokensByType(tokenType: number): Promise<string[]> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .getTokensByType(tokenType)
      .call({ from: this.account });
  }

  // Obtener datos de un token
  async getTokenData(tokenId: string): Promise<DocumentData> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .getTokenData(tokenId)
      .call({ from: this.account, gas: 3000000 });
  }

  // Obtener consumidores autorizados por mí
  async getConsumers(): Promise<AddressTokenIds[]> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .getConsumers()
      .call({ from: this.account, gas: 3000000 });
  }

  // Obtener providers que me han autorizado a mi
  async getProviders(): Promise<AddressTokenIds[]> {
    this.ensureContractInitialized();
    return await this.contract.methods
      .getProviders()
      .call({ from: this.account, gas: 3000000 });
  }

  // Escuchar eventos del contrato
  listenToEvents(): void {
    this.ensureContractInitialized();
    this.contract.events.TokenCreated({}, (error: any, event: any) => {
      if (error) {
        console.error('Error al escuchar TokenCreated:', error);
      } else {
        console.log('Evento TokenCreated:', event);
      }
    });

    this.contract.events.TokenUpdated({}, (error: any, event: any) => {
      if (error) {
        console.error('Error al escuchar TokenUpdated:', error);
      } else {
        console.log('Evento TokenUpdated:', event);
      }
    });

    this.contract.events.AuthorizationGranted({}, (error: any, event: any) => {
      if (error) {
        console.error('Error al escuchar AuthorizationGranted:', error);
      } else {
        console.log('Evento AuthorizationGranted:', event);
      }
    });

    this.contract.events.AuthorizationRevoked({}, (error: any, event: any) => {
      if (error) {
        console.error('Error al escuchar AuthorizationRevoked:', error);
      } else {
        console.log('Evento AuthorizationRevoked:', event);
      }
    });
  }

  // Validación de inicialización del contrato
  private ensureContractInitialized(): void {
    if (!this.contract || !this.account || !this.web3) {
      throw new Error('El contrato o Web3 no están inicializados. Asegúrese de haber conectado MetaMask.');
    }
  }
}
