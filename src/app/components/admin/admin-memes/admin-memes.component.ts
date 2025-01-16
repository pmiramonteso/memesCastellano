import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemeService } from '../../../services/meme.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Meme } from '../../../interface/meme';

@Component({
  selector: 'app-admin-memes',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-memes.component.html',
  styleUrl: './admin-memes.component.scss'
})
export class AdminMemesComponent implements OnInit {
  memeForm!: FormGroup;
  editando = false;
  agregando = false;
  mostrarFormularioMeme: boolean = false;
  memeEditando: Meme | null = null;
  memes: Meme[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private memeService: MemeService,
    private notificationService: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.memeForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', Validators.required],
    });
    this.cargarMemes();
  }

  cargarMemes(): void {
    this.getMemesPorCategoria('todas'); // establecer algo que sea todas.. o poner todos los memes, o poner todas las categorias?
  }

  getMemesPorCategoria(categoria: string): void {
    this.memeService.getMemesPorCategoria(categoria).subscribe(
      (memes) => {
        this.memes = memes;
      },
      (error) => {
        console.error('Error al obtener memes:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  agregarMeme(): void {
    this.mostrarFormularioMeme = !this.mostrarFormularioMeme;
    this.editando = true;
    this.agregando = true;

    if (this.memeForm.valid) {
      const memeData = new FormData();
      memeData.append('titulo', this.memeForm.get('titulo')?.value);
      memeData.append('descripcion', this.memeForm.get('descripcion')?.value);
      memeData.append('categoria', this.memeForm.get('categoria')?.value);

      if (this.selectedFile) {
        memeData.append('imagen', this.selectedFile);
      }

      if (this.editando && this.memeEditando) {
        this.memeService.actualizarMeme(this.memeEditando.id as number, memeData).subscribe(
          () => {
            this.notificationService.mostrarExito('Meme actualizado con éxito');
            this.resetFormulario();
            this.cargarMemes();
          },
          (error) => {
            console.error('Error al actualizar el meme:', error);
          }
        );
      } else {
        this.memeService.crearMeme(memeData).subscribe(
          () => {
            this.notificationService.mostrarExito('Meme creado con éxito');
            this.resetFormulario();
            this.cargarMemes();
          },
          (error) => {
            console.error('Error al crear el meme:', error);
          }
        );
      }
    }
  }

  resetFormulario(): void {
    this.mostrarFormularioMeme = false;
    this.memeForm.reset();
    this.editando = false;
    this.agregando = false;
    this.memeEditando = null;
  }

  editarMeme(meme: Meme): void {
    this.editando = true;
    this.agregando = false;
    this.memeEditando = meme;
    this.memeForm.patchValue({
      titulo: meme.titulo,
      descripcion: meme.descripcion,
      categoria: meme.categoria,
    });
    this.mostrarFormularioMeme = true;
  }

  eliminarMeme(meme: Meme): void {
    
    if (meme.id === undefined) {
      console.error('El ID del meme es indefinido. No se puede eliminar el meme.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este meme?')) {
      this.memeService.eliminarMeme(meme.id).subscribe(
        () => {
          this.notificationService.mostrarExito('Meme eliminado con éxito');
          this.cargarMemes();
        },
        (error) => {
          console.error('Error al eliminar el meme:', error);
        }
      );
    }
  }
}
