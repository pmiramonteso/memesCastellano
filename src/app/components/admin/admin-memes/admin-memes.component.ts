import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemeService } from '../../../services/meme.service';
import { CategoriaService } from '../../../services/categoria.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Meme } from '../../../interface/meme';
import { Categoria } from '../../../interface/categoria';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-memes',
  imports: [ReactiveFormsModule, CommonModule],
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
  categorias: Categoria[] = [];
  categoriaSeleccionada: Categoria | null = null;
  selectedFile: File | null = null;
  defaultImageUrl: string = 'assets/img/default-meme.jpg';

  constructor(
    private fb: FormBuilder,
    private memeService: MemeService,
    private categoriasService: CategoriaService,
    private authService: AuthService,
    private notificationService: NotificacionesService
  ) {
    this.memeForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria_nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.categoriasService.obtenerCategoriasPublicas().subscribe({
      next: (data: Categoria[]) => {
        if (data && Array.isArray(data)) {
          this.categorias = data.map((categoria) => ({
            ...categoria,
            imagen: categoria.imagen ? 
              `http://localhost:3000/assets/img/${categoria.imagen}` : 
              'URL_IMAGEN_DEFAULT',
          }));
        } else {
          console.error('Los datos obtenidos no son válidos o están vacíos.');
        }
      },
      error: (err) => {
        console.error('Error al obtener las categorías:', err);
      },
    });
  }

  seleccionarCategoria(categoria: Categoria): void {
  this.categoriaSeleccionada = categoria;
  this.memes = [];
  this.obtenerMemesPorCategoria(categoria.nombre);
  }

  obtenerMemesPorCategoria(categoria: string): void {
    this.memeService.getPublicMemesPorCategoria(categoria).subscribe(
      (data) => {
        this.memes = data.map(meme => {
          meme.imagen = meme.imagen ? `http://localhost:3000/assets/img/${meme.imagen}` : this.defaultImageUrl;
          return meme;
        });
        this.mostrarFormularioMeme = false;
      },
      (error) => {
        console.error('Error al obtener memes por categoría:', error);
        this.memes = [];
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

    if (!this.selectedFile) {
      this.notificationService.mostrarError('La imagen es obligatoria.');
      return;
    }

    if (this.memeForm.valid) {
      const memeData = new FormData();
      memeData.append('titulo', this.memeForm.get('titulo')?.value);
      memeData.append('descripcion', this.memeForm.get('descripcion')?.value);
      memeData.append('imagen', this.selectedFile);
      memeData.append('categoria_nombre', this.memeForm.get('categoria_nombre')?.value);

      const usuario = this.authService.obtenerUsuario();
      if (this.editando && this.memeEditando) {
        this.memeService.actualizarMeme(this.memeEditando.id as number, memeData).subscribe(
          () => {
            this.notificationService.mostrarExito('Meme actualizado con éxito');
            this.resetFormulario();
            if (this.categoriaSeleccionada?.nombre) {
              this.obtenerMemesPorCategoria(this.categoriaSeleccionada.nombre);
            }
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
            if (this.categoriaSeleccionada?.nombre) {
              this.obtenerMemesPorCategoria(this.categoriaSeleccionada.nombre);
            }
            
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

  volverACategorias(): void {
    this.categoriaSeleccionada = null;
    this.memes = [];
    this.mostrarFormularioMeme = false;
  }

  editarMeme(meme: Meme): void {
    this.editando = true;
    this.agregando = false;
    this.memeEditando = meme;
    this.memeForm.patchValue({
      titulo: meme.titulo,
      descripcion: meme.descripcion,
      categoria_nombre: meme.categoria_nombre,
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
          if (this.categoriaSeleccionada?.nombre) {
            this.obtenerMemesPorCategoria(this.categoriaSeleccionada.nombre);
          }
        },
        (error) => {
          console.error('Error al eliminar el meme:', error);
        }
      );
    }
  }
}
