import { Routes } from '@angular/router';
import { AppMainComponent } from './layout/app.main/app.main.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CreateDocumentComponent } from './pages/documents/create-document/create-document.component';
import { AuthorizationsComponent } from './pages/authorizations/authorizations.component';
import { ConsumersComponent } from './pages/consumers/consumers.component';
import { CreateAuthorizationComponent } from './pages/authorizations/create-authorization/create-authorization.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
    {
        path: '', component: AppMainComponent,
        children: [
            { path: 'landing', component: LandingComponent },
            { path: 'home', component: WelcomeComponent },
            { path: 'documents', component: DocumentsComponent },
            { path: 'documents/create', component: CreateDocumentComponent},
            { path: 'authorizations', component: AuthorizationsComponent },
            { path: 'authorizations/create', component: CreateAuthorizationComponent },
            { path: 'providers', component: ConsumersComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    
    { path: '**', redirectTo: '/' }
];
