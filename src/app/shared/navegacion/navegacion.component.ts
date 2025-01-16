import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { RegistroComponent } from '../../components/usuario/registro/registro.component';
import { LoginComponent } from '../../components/usuario/login/login.component';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-navegacion',
  imports: [RouterModule, RegistroComponent, LoginComponent],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.scss'
})
export class NavegacionComponent {

  menuMovilAbierto = false;
  menuMovil = false;
  mostrarModal: 'login' | 'registro' | 'none' = 'none';
  esAdmin = false;
  Logeado = false;
  nombreUsuario = '';
  dropdownMenuAbierto = false;
  
 constructor( public router: Router, private authService: AuthService, private modalService: ModalService ) {}

 ngOnInit() {
  this.authService.usuarioLogueado$.subscribe((usuario) => {
    this.Logeado = !!usuario;
    this.dropdownMenuAbierto = false;
    if (this.Logeado) {
      this.nombreUsuario = usuario.nombre || '';
      this.esAdmin = Array.isArray(usuario['roles']) && usuario['roles'].includes('admin');
    } else {
      this.nombreUsuario = '';
      this.esAdmin = false;
    }
  });
}

  toggleMobileMenu(): void {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }
  closeMobileMenu(): void {
    this.menuMovilAbierto = false;
  }

toggleDropdownMenu(): void {
  this.dropdownMenuAbierto = !this.dropdownMenuAbierto;
}

logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.Logeado = false;
        this.esAdmin = false;
        this.nombreUsuario = '';
        //this.userImage = '/assets/img/avatar-IG.png';
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
  
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error cerrando sesión:', err);
      },
    });
  }

  openModal(modalType: 'login' | 'registro'): void {
    this.mostrarModal = modalType;
    this.modalService.openModal();
  }
  closeModal(): void {
    this.mostrarModal = 'none';
    this.modalService.closeModal();
  }

}
