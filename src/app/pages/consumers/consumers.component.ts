import { Component, OnInit } from '@angular/core';
import { AddressTokenIds } from '../../models/token.model';
import { Router } from '@angular/router';
import { IdentityWeb3Service } from '../../services/identity-web3.service';
import { AppBreadcrumbService } from '../../services/app.breadcrumb.service';
import { addressTokenToObjectListAuth } from '../../utils/convert.utils';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-consumers',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, FormsModule, InputTextModule, TableModule, CheckboxModule],
  templateUrl: './consumers.component.html',
  styleUrl: './consumers.component.scss'
})
export class ConsumersComponent implements OnInit{
  autorizados: AddressTokenIds[] = [];
  revokeAddress: string = '';
  tokensSelected: any[] = [];
  isValidSelection: boolean = false;
  expandedRows = {};

  constructor(private router: Router, private identityWeb3Service: IdentityWeb3Service, private breadcrumb: AppBreadcrumbService) {
    this.breadcrumb.setItems([
      { label: 'Gestion Externa', routerLink: ['/providers'] },
      { label: 'Proveedores' }
    ]);
  }

  async ngOnInit() {
    try {
      await this.identityWeb3Service.initWeb3();
    } catch (error: any) {
      console.error('Error inicializando Web3', error);
    }

    try {
      this.autorizados = await this.identityWeb3Service.getProviders();
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




}
