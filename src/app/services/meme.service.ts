import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Meme } from '../interface/meme';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../interface/categoria';
@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private apiURL = `${environment.endpoint}api/memes`;

  constructor(private http: HttpClient, private categoriaService: CategoriaService) {}

  getMemesPorCategoria(categoria?: string): Observable<Meme[]> {
    const url = categoria ? `${this.apiURL}/categorias/${categoria}` : this.apiURL;
    return this.http.get<Meme[]>(url).pipe(
      tap({
        next: (response) => console.log('Memes recibidos:', response),
        error: (err) => console.error('Error al obtener memes:', err)
      })
    );
  }

  getMemePorId(id: number): Observable<Meme> {
    return this.http.get<Meme>(`${this.apiURL}/${id}`);
  }

  crearMeme(memeData: FormData): Observable<Meme> {
    return this.http.post<Meme>(`${this.apiURL}`, memeData).pipe(
      tap(response => {
        console.log('Respuesta de la API al crear meme:', response);
      })
    );;
  }

  actualizarMeme(id: number, memeData: FormData): Observable<Meme> {
    return this.http.patch<Meme>(`${this.apiURL}/${id}`, memeData);
  }

  eliminarMeme(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }

  votarMeme(id: number, voto: string): Observable<any> {
    return this.http.post(`${this.apiURL}/votos`, { id, voto });
  }

  obtenerCategorias(): Observable<Categoria[]> {
    return this.categoriaService.obtenerCategorias();
  }
}

