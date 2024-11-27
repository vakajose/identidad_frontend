import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CedulaImageRequest } from '../models/backend-dto.model';
import { Cedula } from '../models/token.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcrOpenaiService {

  path = `${environment.apiUrl}/image`;

  constructor(private http: HttpClient) { }

  ocrCedula(images:any): Observable<Cedula> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(images);
    return this.http.post<Cedula>(`${this.path}/procesar-cedula`, images, { headers });
  }



}


