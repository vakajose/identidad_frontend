import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityWeb3Service } from '../../services/identity-web3.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AppBreadcrumbService } from '../../services/app.breadcrumb.service';
import { AddressTokenIds } from '../../models/token.model';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { addressTokenToObjectListAuth, tokenIdsToObjectList } from '../../utils/convert.utils';


@Component({
  selector: 'app-authorizations',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, FormsModule, InputTextModule, TableModule, CheckboxModule],
  templateUrl: './authorizations.component.html',
  styleUrl: './authorizations.component.scss'
})
export class AuthorizationsComponent implements OnInit {
  autorizados: AddressTokenIds[] = [];
  revokeAddress: string = '';
  tokensSelected: any[] = [];
  isValidSelection: boolean = false;
  expandedRows = {};

  constructor(private router: Router, private identityWeb3Service: IdentityWeb3Service, private breadcrumb: AppBreadcrumbService) {
    this.breadcrumb.setItems([
      { label: 'Gestion Externa', routerLink: ['/authorizations'] },
      { label: 'Autorizaciones' }
    ]);
  }

  async ngOnInit() {
    try {
      await this.identityWeb3Service.initWeb3();
    } catch (error: any) {
      console.error('Error inicializando Web3', error);
    }

    try {
      this.autorizados = await this.identityWeb3Service.getConsumers();
      console.log(this.autorizados);
    } catch (error) {
      console.error('Error obteniendo autorizados', error);
    }
    this.autorizados.forEach(auth => auth.addressTokenIds = addressTokenToObjectListAuth(auth));
  }


  collapseAll() {
    this.expandedRows = {};
    console.log(this.expandedRows);
  }

  navigateToCreate() {
    this.router.navigate(['/authorizations/create']);
  }

  onRowSelect(event: any) {
    console.log(event.data);
    console.log(this.tokensSelected);
    console.log(this.isValidSelection);
    this.validateSelection();
  }

  onRowUnselect(event: any) {
    this.validateSelection();
  }

  validateSelection() {
    const uniqueAddresses = new Set(this.tokensSelected
      .map(token => token.tokenId.split('|')[0]))
    this.isValidSelection = uniqueAddresses.size === 1;
  }

  async revokeAuthorization() {

    if(this.isValidSelection){
      try {
        this.revokeAddress = this.tokensSelected[0].tokenId.split('|')[0];
        let stringIds = this.tokensSelected
        .map(token => token.tokenId.split('|')[1]);
        await this.identityWeb3Service.revokeMultiple(this.revokeAddress, stringIds);
        this.router.navigate(['/authorizations']);
      } catch (error) {
        console.error('Error revocando autorización', error);
      }
    }
  }

}
