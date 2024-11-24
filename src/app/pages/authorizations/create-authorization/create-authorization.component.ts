import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityWeb3Service } from '../../../services/identity-web3.service';
import { AppBreadcrumbService } from '../../../services/app.breadcrumb.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { tokenIdsToObjectList } from '../../../utils/convert.utils';

@Component({
  selector: 'app-create-authorization',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, FormsModule, InputTextModule, TableModule, CheckboxModule],
  templateUrl: './create-authorization.component.html',
  styleUrl: './create-authorization.component.scss'
})
export class CreateAuthorizationComponent implements OnInit {

  myTokensIds: string[] = [];
  authorizationAddress: string = '';
  tokensSelected: any[] = [];

  tokenIdObject: any[] = [];

  constructor(private router: Router, private identityWeb3Service: IdentityWeb3Service, private breadcrumb: AppBreadcrumbService) { 
    this.breadcrumb.setItems([
      { label: 'Gestion Externa', routerLink: ['/authorizations'] },
      { label: 'Autorizaciones', routerLink: ['/authorizations'] },
      { label: 'Crear Autorización' }
    ]);
  }

  async ngOnInit() {
    try {
      await this.identityWeb3Service.initWeb3();
    } catch (error: any) {
      console.error('Error inicializando Web3', error);
    }

    try {
      this.myTokensIds = await this.identityWeb3Service.getMyTokens();
    } catch (error) {
      console.error('Error obteniendo Tokens', error);
    }
    
    this.tokenIdObject = tokenIdsToObjectList(this.myTokensIds);
    console.log(this.tokenIdObject);
    
  }

  async onSubmit() {
    try{
      let stringIds = this.tokensSelected.map((token: any) => token.tokenId);
      await this.identityWeb3Service.authorizeMultiple(this.authorizationAddress, stringIds);
      this.router.navigate(['/authorizations']);
    }catch(error){
      console.error('Error creando autorización', error);
    }
  }

  onRowSelect(event: any) {
    console.log(this.tokensSelected);
  }


}
