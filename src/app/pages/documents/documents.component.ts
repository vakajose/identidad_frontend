import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../services/app.breadcrumb.service';
import { IdentityWeb3Service } from '../../services/identity-web3.service';
import { DocumentData } from '../../models/token.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

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
  
  constructor(private breadcrumb:AppBreadcrumbService, private identityWeb3Service: IdentityWeb3Service, private router: Router) {
    this.breadcrumb.setItems([
      { label: 'Gestion', routerLink: ['/'] },
      { label: 'Documentos' }
    ]);
  }

  async ngOnInit() {
    try {
      await this.identityWeb3Service.initWeb3();
      this.myTokensIds = await this.identityWeb3Service.getMyTokens();
      console.log('Mis tokens', this.myTokensIds);
      if (this.myTokensIds.length > 0) {
        await this.getAllDocumentData();
      }
    } catch (error: any) {
      console.error('Error inicializando Web3', error);
    }
  }

  async getAllDocumentData() { 
    this.myTokens = [];
    for (let i = 0; i < this.myTokensIds.length; i++) {
      this.myTokens.push(await this.identityWeb3Service.getTokenData(this.myTokensIds[i]));
    }
  
  }

  navigateToCreate() {
    this.router.navigate(['/documents/create']);
  }

}
