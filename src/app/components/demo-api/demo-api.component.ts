import { Component, Input } from '@angular/core';
import { MemeService } from '../../services/meme.service';
@Component({
  selector: 'app-demo-api',
  imports: [],
  templateUrl: './demo-api.component.html',
  styleUrl: './demo-api.component.scss'
})
export class DemoApiComponent {
  @Input() categoria: string = '';
  memeActual: any = null; 

constructor(private memeService: MemeService){}

  cargarMemeAlAzar(): void {
    if (!this.categoria) {
      alert('Por favor, selecciona una categoría.');
      return;
    }

    this.memeService.getPublicMemesPorCategoria(this.categoria).subscribe((memes) => {
      if (memes.length > 0) {
        const memesConUrl = memes.map(meme => {
          meme.imagen = meme.imagen ? `http://localhost:3000/assets/img/${meme.imagen}` : 'URL_IMAGEN_DEFAULT';
          return meme;
        });
        const indiceAleatorio = Math.floor(Math.random() * memesConUrl.length);
        this.memeActual = memesConUrl[indiceAleatorio];
      } else {
        this.memeActual = null; // No hay memes en esta categoría
      }
    });
  }
}
