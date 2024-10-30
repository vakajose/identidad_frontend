import { Component } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-view-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, InputTextModule],
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent {
  providerAddress: string = '';
  documents: any[] = [];
  errorMessage: string = '';

  constructor(private web3Service: Web3Service) {}

  async getDocuments() {
    try {
      this.documents = await this.web3Service.getDocuments(this.providerAddress);
    } catch (error) {
      this.errorMessage = 'Error consultando documentos. Asegúrate de que la dirección del proveedor esté correcta.';
      console.error('Error consultando documentos', error);
    }
  }

  async getMyDocuments() {
    try {
      this.documents = await this.web3Service.getMyDocuments();
    } catch (error) {
      this.errorMessage = 'Error consultando tus documentos. Asegúrate de estar conectado a la red adecuada.';
      console.error('Error consultando documentos propios', error);
    }
  }
}
