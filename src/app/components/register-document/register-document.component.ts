import { Component } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-register-document',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './register-document.component.html',
  styleUrls: ['./register-document.component.css']
})
export class RegisterDocumentComponent {
  docType: string = '';
  docHash: string = '';
  docTypes = [
    { label: 'DNI', value: 'DNI' },
    { label: 'Licencia', value: 'Licencia' }
  ];

  constructor(private web3Service: Web3Service) {}

  async registerDocument() {
    try {
      await this.web3Service.registerDocument(this.docType, this.docHash);
      console.log('Documento registrado exitosamente');
    } catch (error) {
      console.error('Error registrando documento', error);
    }
  }
}
