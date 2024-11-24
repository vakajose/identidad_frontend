import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../services/app.breadcrumb.service';
import { IdentityWeb3Service } from '../../services/identity-web3.service';
import { Cedula, DocumentData } from '../../models/token.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { blockTimestampToDate, documentDataToCedula } from '../../utils/convert.utils';
import { DOCUMENT_TYPES } from '../../constants/types.constants';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {

  myTokensIds: string[] = [];
  myTokens: DocumentData[] = [];
  cedulas: Cedula[] = [];
  DOCUMENT_TYPES = DOCUMENT_TYPES;

  constructor(private breadcrumb:AppBreadcrumbService, private identityWeb3Service: IdentityWeb3Service, private router: Router) {
    this.breadcrumb.setItems([
      { label: 'Gestion', routerLink: ['/'] },
      { label: 'Documentos' }
    ]);
  }

  async ngOnInit() {
    try {
      await this.identityWeb3Service.initWeb3();
    } catch (error: any) {
      console.error('Error inicializando Web3', error);
    }

    try{
      this.myTokensIds = await this.identityWeb3Service.getMyTokens();
      if (this.myTokensIds.length > 0) {
        await this.getAllDocumentData();
      }
    }catch(error){
      console.error('Error obteniendo tokens', error);
    }

    this.toCedula();

  }

  async getAllDocumentData() { 
    this.myTokens = [];
    for (let i = 0; i < this.myTokensIds.length; i++) {
      this.myTokens.push(await this.identityWeb3Service.getTokenData(this.myTokensIds[i]));
    }
  
  }

  toCedula() {
    for (let i = 0; i < this.myTokens.length; i++) {
      this.cedulas.push(documentDataToCedula(this.myTokens[i],this.myTokensIds[i]));
    }
  }
  navigateToCreate() {
    this.router.navigate(['/documents/create']);
  }

  blockTimestampToDate(timestamp: number): Date {
    return blockTimestampToDate(Number(timestamp));
  }

}
