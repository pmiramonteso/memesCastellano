import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interface/categoria';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-categorias-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './categorias-admin.component.html',
  styleUrl: './categorias-admin.component.scss'
})
export class CategoriasAdminComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriaForm: FormGroup;
  editando = false;
  categoriaEditando: Categoria | null = null;
  selectedFile: File | null = null;
  defaultImageUrl: string = 'assets/img/default-meme.jpg';
  formVisible = false;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriaService,
    private notificacionesService: NotificacionesService
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      color_fondo: [''],
      degradado: [''],
      posicion_imagen: [''],
      imagen: [''],
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }
  mostrarFormulario(): void {
    this.formVisible = true;
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }
  obtenerCategorias(): void {
    this.categoriasService.obtenerCategoriasPublicas().subscribe(
      (data) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }

  agregarCategoria(): void {
    if (this.categoriaForm.valid) {
      const categoriaData = this.categoriaForm.value;
  
      const formData = new FormData();
      formData.append('nombre', categoriaData.nombre);
      formData.append('color_fondo', categoriaData.color_fondo);
      formData.append('degradado', categoriaData.degradado);
      formData.append('posicion_imagen', categoriaData.posicion_imagen);
      formData.append('descripcion', categoriaData.descripcion);
  
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }
  
      if (this.editando && this.categoriaEditando) {
        this.categoriasService.actualizarCategoria(this.categoriaEditando.id!, formData).subscribe(
          () => {
            this.notificacionesService.mostrarExito('Categoría actualizada con éxito');
            this.resetFormulario();
            this.obtenerCategorias();
          },
          (error) => {
            console.error('Error al actualizar categoría:', error);
          }
        );
      } else {
        this.categoriasService.crearCategoria(formData).subscribe(
          () => {
            this.notificacionesService.mostrarExito('Categoría creada con éxito');
            this.resetFormulario();
            this.obtenerCategorias();
          },
          (error) => {
            console.error('Error al crear categoría:', error);
          }
        );
      }
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.editando = true;
    this.categoriaEditando = categoria;
    this.categoriaForm.patchValue(categoria);
  }

  eliminarCategoria(categoria: Categoria): void {
    if (categoria.id === undefined) {
      console.error('El ID de la categoría es indefinido. No se puede eliminar la categoría.');
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`)) {
      this.categoriasService.eliminarCategoria(categoria.id).subscribe(
        () => {
          this.notificacionesService.mostrarExito('Categoría eliminada con éxito');
          this.obtenerCategorias();
        },
        (error) => {
          console.error('Error al eliminar categoría:', error);
        }
      );
    }
  }
  resetFormulario(): void {
    this.categoriaForm.reset();
    this.editando = false;
    this.categoriaEditando = null;
    this.formVisible = false;
  }
}