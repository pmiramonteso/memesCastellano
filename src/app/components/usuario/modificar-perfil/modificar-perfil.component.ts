import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interface/usuario';
import { Access } from '../../../interface/access';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-modificar-perfil',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modificar-perfil.component.html',
  styleUrl: './modificar-perfil.component.scss'
})
export class ModificarPerfil implements OnInit {
  usuarioForm!: FormGroup;
  usuario!: Usuario;
  editando: boolean = false;

  constructor(private fb: FormBuilder, private UsuarioService: UsuarioService) {}

  ngOnInit() {
    this.obtenerUsuario();
    this.initForm();
    this.UsuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          email: usuario.email
        });
      }
    });
  }
  

initForm() {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: ['']
    });
  }

  obtenerUsuario() {
    console.log('Llamando a obtenerPerfil');
    this.UsuarioService.obtenerPerfil().subscribe({
      next: (response: Access) => {
        console.log('Respuesta obtenerPerfil:', response); // Para debugging
        if (response?.data?.usuario) {
          this.usuario = response.data.usuario;
          this.usuarioForm.patchValue({
            nombre: this.usuario.nombre,
            apellidos: this.usuario.apellidos,
            email: this.usuario.email
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
      }
    });
  }

  activarEdicion() {
    this.editando = true;
  }

  actualizarUsuario() {
    if (this.usuarioForm.invalid) return;

    const datosActualizados = {
      nombre: this.usuarioForm.value.nombre,
      apellidos: this.usuarioForm.value.apellidos,
      ...(this.usuarioForm.value.password && { password: this.usuarioForm.value.password })
    };

    this.UsuarioService.actualizarUsuario(datosActualizados).subscribe({
      next: (response: Access) => {
        alert('Usuario actualizado correctamente');
        this.editando = false;
        this.obtenerUsuario();
      },
      error: (error) => console.error('Error al actualizar usuario:', error)
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioForm.patchValue({
      nombre: this.usuario.nombre,
      apellidos: this.usuario.apellidos,
      email: this.usuario.email
    });
  }
}
