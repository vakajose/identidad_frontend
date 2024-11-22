import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityWeb3Service } from '../../services/identity-web3.service';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  account: string = '';
  balance: string = '';
  errorMessage: string = '';

  constructor(private web3Service: IdentityWeb3Service) {}

  async ngOnInit() {
    try {
      await this.web3Service.initWeb3();
      await this.loadAccountInfo();
    } catch (error: any) {
      this.errorMessage = error;
    }
  }

  async loadAccountInfo() {
    try {
      const accountInfo = await this.web3Service.getAccountInfo();
      this.account = accountInfo.address;
      this.balance = accountInfo.balance;
    } catch (error) {
      this.errorMessage = 'Error obteniendo información de la cuenta. Asegúrate de que MetaMask esté conectado.';
      console.error('Error obteniendo información de la cuenta', error);
    }
  }
}
