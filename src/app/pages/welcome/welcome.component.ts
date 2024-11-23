import { Component } from '@angular/core';
import { AccountInfoComponent } from '../../components/account-info/account-info.component';
import { AppBreadcrumbService } from '../../services/app.breadcrumb.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [AccountInfoComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

  constructor(private breadcrumb:AppBreadcrumbService) {
    this.breadcrumb.setItems([
      {label: 'Gestion'},
      {label: 'Home'}
    ]);
  }

}
