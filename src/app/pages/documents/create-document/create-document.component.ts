import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../../services/app.breadcrumb.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IdentityWeb3Service } from '../../../services/identity-web3.service';
import { Cedula } from '../../../models/token.model';
import { Nullable } from 'primeng/ts-helpers';
import { toTokenDataCompatible } from '../../../utils/convert.utils';
import { FileUploadModule } from 'primeng/fileupload';
import { Router } from '@angular/router';
import { OcrOpenaiService } from '../../../services/ocr-openai.service';
import { CommonModule } from '@angular/common';
import { CedulaImageRequest } from '../../../models/backend-dto.model';


@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, SelectButtonModule, InputTextModule, InputNumberModule, FileUploadModule],
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss'
})
export class CreateDocumentComponent implements OnInit {
  cedulaForm: FormGroup;
  cedula: Cedula | Nullable = null;
  modeImages = true;
  frontal!:File ;
  trasera!:File ;
  cedulaImageRequest!: CedulaImageRequest;


  constructor(private breadcrumbService: AppBreadcrumbService, private fb: FormBuilder, private identityWeb3: IdentityWeb3Service, private router: Router, private ocr: OcrOpenaiService) {
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

  changeModeImages() {
    this.modeImages = !this.modeImages;
  }

  async onConfirmImages() {
    this.cedulaImageRequest = new CedulaImageRequest('', '');

    await this.fileToBase64(this.frontal).then((res) => this.cedulaImageRequest.anverso = res.toString())
    await this.fileToBase64(this.trasera).then((res) => this.cedulaImageRequest.reverso = res.toString())

    this.ocr.ocrCedula(this.cedulaImageRequest).subscribe({
      next: (res) => {
        this.cedula = res;
        console.log('Cedula', this.cedula);
        this.cedulaForm.patchValue(this.cedula);
        this.changeModeImages();
      },
      error: (error) => {
        console.error('Error ocrCedula', error);
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (input.id === 'trasera') {
        this.trasera = input.files[0];
      } else { 
        this.frontal = input.files[0];
      }
    }
  }
  
   fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

}
