import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-panel-admin',
  imports: [],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.scss'
})
export class PanelAdminComponent implements OnInit {
  usuario: any;
  userImage: string = "/assets/img/avatar-IG.png";

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const usuarioData = localStorage.getItem('usuario');
    this.usuario = usuarioData ? JSON.parse(usuarioData) : null;

    if (this.usuario?.photo) {
      this.userImage = `http://localhost:3000/assets/img/${this.usuario.photo}`;
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['home']);
  }
}

