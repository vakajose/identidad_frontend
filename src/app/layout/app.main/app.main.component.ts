import { Component } from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {AppComponent} from '../../app.component';
import {RouterOutlet} from '@angular/router';
import {AppMenuComponent} from '../app.menu/app.menu.component';
import {CommonModule} from '@angular/common';
import {AppTopbarComponent} from '../app.topbar/app.topbar.component';
import { AppMenuService } from '../../services/app.menu.service';
import { AppBreadcrumbComponent } from '../app.breadcrumb/app.breadcrumb.component';
import { AppFooterComponent } from '../app.footer/app.footer.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AppTopbarComponent, AppMenuComponent, AppBreadcrumbComponent, AppFooterComponent],
  templateUrl: './app.main.component.html',
  styleUrl: './app.main.component.scss'
})
export class AppMainComponent {
  menuClick: boolean | undefined;

  menuButtonClick: boolean | undefined;

  topbarMenuButtonClick: boolean | undefined;

  topbarMenuClick: boolean | undefined;

  topbarMenuActive: boolean | undefined;

  activeTopbarItem: Element | undefined | null;

  sidebarActive: boolean | undefined;

  mobileMenuActive: boolean | undefined;

  menuHoverActive: boolean | undefined;

  resetMenu: boolean | undefined;

  configActive: boolean | undefined;

  configClick: boolean | undefined;

  constructor(private menuService: AppMenuService, private primengConfig: PrimeNGConfig, public app: AppComponent) {}

  onWrapperClick() {
    if (!this.menuClick && !this.menuButtonClick) {
      this.mobileMenuActive = false;
    }

    if (!this.topbarMenuClick && !this.topbarMenuButtonClick) {
      this.topbarMenuActive = false;
      this.activeTopbarItem = null;
    }

    if (!this.menuClick) {
      if (this.isHorizontal()) {
        this.menuService.reset();
      }

      this.menuHoverActive = false;
    }

    if (this.configActive && !this.configClick) {
      this.configActive = false;
    }

    this.configClick = false;
    this.menuClick = false;
    this.menuButtonClick = false;
    this.topbarMenuClick = false;
    this.topbarMenuButtonClick = false;
  }

  onMenuButtonClick(event: Event) {
    this.menuButtonClick = true;

    if (this.isMobile()) {
      this.mobileMenuActive = !this.mobileMenuActive;
    }

    event.preventDefault();
  }

  onTopbarMobileMenuButtonClick(event: Event) {
    this.topbarMenuButtonClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;
    event.preventDefault();
  }

  onTopbarRootItemClick(event: Event, item: Element) {
    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null; } else {
      this.activeTopbarItem = item; }

    event.preventDefault();
  }

  onTopbarMenuClick(event: Event) {
    this.topbarMenuClick = true;
  }

  onSidebarClick(event: Event) {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onConfigClick(event : any) {
    this.configClick = true;
  }

  onRippleChange(event : any) {
    this.app.ripple = event.checked;
    this.primengConfig = event.checked;
  }

  onToggleMenuClick(event: Event) {
    this.app.layoutMode = this.app.layoutMode !== 'static' ? 'static' : 'overlay';
    event.preventDefault();
  }

  isMobile() {
    return window.innerWidth <= 1024;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isHorizontal() {
    return this.app.layoutMode === 'horizontal';
  }

  isOverlay() {
    return this.app.layoutMode === 'overlay';
  }
}
