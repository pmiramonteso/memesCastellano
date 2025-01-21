import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MemeService } from '../../services/meme.service';
import { CategoriaService } from '../../services/categoria.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Categoria } from '../../interface/categoria';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  imports: [RouterModule, FooterComponent, CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit{

  categorias: Categoria[] = [];
  categoriaSeleccionada: string = '';

  constructor(private memeService: MemeService, private router: Router, private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
    console.log(this.categorias);
  }

  obtenerCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.categorias = data.map(categoria => {
            categoria.imagen = categoria.imagen ? 
              `http://localhost:3000/assets/img/${categoria.imagen}` : 
              'URL_IMAGEN_DEFAULT';
            console.log(categoria.degradado);
            return categoria;
          });
          console.log(this.categorias); 
        } else {
          console.error('Los datos obtenidos no son válidos o están vacíos.');
        }
      },
      error: (err) => {
        console.error('Error al obtener las categorías:', err);
        alert('Hubo un error al cargar las categorías. Intenta de nuevo más tarde.');
      }
    });
  }
  
  

  abrirDocumentacion(categoria: Categoria): void {
    this.router.navigate(['/categorias', categoria.nombre]);
  }
}
