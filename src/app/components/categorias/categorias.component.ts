import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MemeService } from '../../services/meme.service';

@Component({
  selector: 'app-categorias',
  imports: [RouterModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  @Input() categorias: string[] = [];
  @Output() categoriaSeleccionada = new EventEmitter<string>();
  

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada.emit(categoria);
  }
}
