import { Routes } from '@angular/router';
import { AppMainComponent } from './layout/app.main/app.main.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CreateDocumentComponent } from './pages/documents/create-document/create-document.component';

export const routes: Routes = [
    {
        path: '', component: AppMainComponent,
        children: [
            { path: 'home', component: WelcomeComponent },
            { path: 'documents', component: DocumentsComponent },
            { path: 'documents/create', component: CreateDocumentComponent},
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '/' }
];
