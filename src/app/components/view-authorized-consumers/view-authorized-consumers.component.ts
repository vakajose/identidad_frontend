import { Component } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-view-authorized-consumers',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './view-authorized-consumers.component.html',
  styleUrls: ['./view-authorized-consumers.component.css']
})
export class ViewAuthorizedConsumersComponent {
  authorizedConsumers: string[] = [];
  errorMessage: string = '';

  constructor(private web3Service: Web3Service) {}

  async getAuthorizedConsumers() {
    try {
      this.authorizedConsumers = await this.web3Service.getAuthorizedConsumers();
    } catch (error) {
      this.errorMessage = 'Error consultando consumidores autorizados';
      console.error(error);
    }
  }
}
