import { Component } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-authorize-consumer',
  standalone: true,
  imports: [CommonModule, FormsModule,ButtonModule,InputTextModule],
  templateUrl: './authorize-consumer.component.html',
  styleUrls: ['./authorize-consumer.component.css']
})
export class AuthorizeConsumerComponent {
  consumerAddress: string = '';

  constructor(private web3Service: Web3Service) {}

  async authorizeConsumer() {
    try {
      await this.web3Service.authorizeConsumer(this.consumerAddress);
      console.log('Consumidor autorizado exitosamente');
    } catch (error) {
      console.error('Error autorizando consumidor', error);
    }
  }
}
