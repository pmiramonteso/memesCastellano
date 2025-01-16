import { Component, Input } from '@angular/core';
import { MemeService } from '../../services/meme.service';

@Component({
  selector: 'app-votaciones',
  imports: [],
  templateUrl: './votaciones.component.html',
  styleUrl: './votaciones.component.scss'
})
export class VotacionesComponent {
  @Input() categoria: string = '';
  memes: any[] = [];

  constructor(private memeService: MemeService) {}

  ngOnChanges() {
    if (this.categoria) {
      this.memeService.getMemesPorCategoria(this.categoria).subscribe((data: any) => {
        this.memes = data;
      });
    }
  }

  votarMeme(id: number, voto: string) {
    this.memeService.votarMeme(id, voto).subscribe(() => {
      alert('¡Voto registrado!');
    });
  }
}
