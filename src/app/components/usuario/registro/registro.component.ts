import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  correoEnUso: string | null = null;
  registroForm: FormGroup;
  isModalOpen = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionesService,
    private modalService: ModalService
  ) {
    this.registroForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&.]{6,}$/)
      ])
    });
    this.modalService.isModalOpen$.subscribe((state) => {
      this.isModalOpen = state;
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.correoEnUso = null;
  
      const formData = {
        nombre: this.registroForm.value.nombre,
        apellidos: this.registroForm.value.apellidos,
        email: this.registroForm.value.email,
        password: this.registroForm.value.password
      };

      this.authService.registro(formData).subscribe({
        next: (response) => {
          if (response.accessToken) {
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
            this.authService.actualizarUsuarioLogueado();
            const userRole = response.data.usuario.roles;
  
            if (userRole === 'admin') {
              this.notificacionService.mostrarExito(`Registrado con éxito ${response.data.usuario.nombre}`);
              this.router.navigate(['admin']);
            } else {
              this.notificacionService.mostrarExito(`Registrado con éxito ${response.data.usuario.nombre}`);
              this.router.navigate(['perfil']);
            }
            this.closeModal();
          } else {
            alert('Error al registrar por token');
          }
        },
        error: (error) => {
          if (error.error?.errors) {
            this.correoEnUso = error.error.errors.find((err: any) => err.param === 'email')?.msg || null;
          }
        }
      });
    }
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
