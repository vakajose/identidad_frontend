import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterDocumentComponent } from './components/register-document/register-document.component';
import { AuthorizeConsumerComponent } from './components/authorize-consumer/authorize-consumer.component';
import { ViewDocumentsComponent } from './components/view-documents/view-documents.component';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { RevokeAuthorizationComponent } from './components/revoke-authorization/revoke-authorization.component';
import { ViewAuthorizedConsumersComponent } from './components/view-authorized-consumers/view-authorized-consumers.component';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardModule, RegisterDocumentComponent, AuthorizeConsumerComponent, ViewDocumentsComponent, AccountInfoComponent, RevokeAuthorizationComponent, ViewAuthorizedConsumersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'identidad_frontend';
}
