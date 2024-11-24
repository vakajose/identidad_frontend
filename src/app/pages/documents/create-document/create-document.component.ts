import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../../services/app.breadcrumb.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IdentityWeb3Service } from '../../../services/identity-web3.service';
import { Cedula } from '../../../models/token.model';
import { Nullable } from 'primeng/ts-helpers';
import { hexToText, jsonToObject, objectToJson, textToHex, toTokenDataCompatible } from '../../../utils/convert.utils';
import { DOCUMENT_TYPES } from '../../../constants/types.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, SelectButtonModule, InputTextModule, InputNumberModule],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss'
})
export class CreateDocumentComponent implements OnInit {
  cedulaForm: FormGroup;
  cedula: Cedula | Nullable = null;

  constructor(private breadcrumbService: AppBreadcrumbService, private fb: FormBuilder, private identityWeb3: IdentityWeb3Service, private router: Router) {
    this.breadcrumbService.setItems([
      { label: 'Gestion', routerLink: ['/'] },
      { label: 'Documentos', routerLink: ['/documents'] },
      { label: 'Crear documento' }
    ]);

    this.cedulaForm = this.fb.group({
      nombre: ['', Validators.required],
      numero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      profesion: ['', Validators.required],
      domicilio: ['', Validators.required],
      foto: [''],
      serie: ['', Validators.required],
      seccion: ['', Validators.required],
      fechaEmision: ['', Validators.required],
      fechaExpiracion: ['', Validators.required],
      codigoQr: ['']
    });
  }

  async ngOnInit() {
    await this.identityWeb3.initWeb3();
  }

  async onSubmit() {
    if (this.cedulaForm.valid) {
      this.cedula = this.cedulaForm.value;
      await this.createDocumentOnChain();

    }
  }

  async createDocumentOnChain() {
    try {
      if (this.cedula) {
        let hex = toTokenDataCompatible(this.cedula);
        await this.identityWeb3.mintToken(1, hex)
        this.router.navigate(['/documents']);
      }
    } catch (error: any) {
      console.error('Error createDocumentOnChain', error);
    }

  }


}
