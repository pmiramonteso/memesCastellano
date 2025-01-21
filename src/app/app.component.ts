import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NotificacionesComponent } from './shared/notificaciones/notificaciones.component';
import { NavegacionComponent } from './shared/navegacion/navegacion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificacionesComponent, NavegacionComponent, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  showNavbar: boolean = true;
  title = 'memes_castellano';

  noNavbarRoutes: string[] = ['/login', '/registro', '/panel-admin'];
  excludeMargin = false;
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects.split('?')[0];
        this.showNavbar = !this.noNavbarRoutes.includes(currentUrl);
        this.excludeMargin = ['/home', '/panel-admin'].includes(currentUrl);
      }
    });
  }
}
