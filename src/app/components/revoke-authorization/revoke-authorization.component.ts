import { Component } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-revoke-authorization',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './revoke-authorization.component.html',
  styleUrls: ['./revoke-authorization.component.css']
})
export class RevokeAuthorizationComponent {
  consumerAddress: string = '';
  message: string = '';

  constructor(private web3Service: Web3Service) {}

  async revokeAuthorization() {
    try {
      await this.web3Service.revokeAuthorization(this.consumerAddress);
      this.message = `Acceso revocado para ${this.consumerAddress}`;
    } catch (error) {
      this.message = 'Error revocando acceso. Asegúrate de que el consumidor está autorizado.';
      console.error(error);
    }
  }
}
