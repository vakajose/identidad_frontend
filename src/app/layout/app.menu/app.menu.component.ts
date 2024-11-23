import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {AppMainComponent} from '../app.main/app.main.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [AppMenuitemComponent, CommonModule],
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.scss'
})
export class AppMenuComponent  implements OnInit{

  model: any[] | undefined;

  constructor(public app: AppComponent, public appMain: AppMainComponent) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Gestion', icon: 'pi pi-fw pi-home',
        items: [
          {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/home']},
          {label: 'Documentos', icon: 'pi pi-fw pi-folder', routerLink: ['/documents']}
        ]
      }

    ];
  }
  onMenuClick() {
    this.appMain.menuClick = true;
  }
}
