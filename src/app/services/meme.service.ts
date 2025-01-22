import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Meme } from '../interface/meme';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../interface/categoria';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private apiURL = `${environment.endpoint}api`;

  constructor(private http: HttpClient, private categoriaService: CategoriaService,
    private authService: AuthService) {}

    private getApiHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    }

  // Métodos públicos (demo)
  getPublicMemes(): Observable<Meme[]> {
    return this.http.get<Meme[]>(`${this.apiURL}/public/all`);
  }

  getPublicMemesPorCategoria(categoria: string): Observable<Meme[]> {
    return this.http.get<Meme[]>(`${this.apiURL}/public/categoria/${categoria}`).pipe(
      tap({
        next: (response) => console.log('Memes recibidos:', response),
        error: (err) => console.error('Error al obtener memes:', err)
      })
    );;
  }

 /* private getApiHeaders(): HttpHeaders {
    const apiKey = this.authService.getApiKey();
    return new HttpHeaders().set('x-api-key', apiKey || '');
  }*/

getMemesPorCategoria(categoria?: string): Observable<Meme[]> {
    const headers = this.getApiHeaders();
    const url = categoria ? 
      `${this.apiURL}/v1/memes/categorias/${categoria}` : 
      `${this.apiURL}/v1/memes`;
    
    return this.http.get<Meme[]>(url, { headers }).pipe(
      tap({
        next: (response) => console.log('Memes recibidos:', response),
        error: (err) => console.error('Error al obtener memes:', err)
      })
    );
  }

  getMemePorId(id: number): Observable<Meme> {
    const headers = this.getApiHeaders();
    return this.http.get<Meme>(`${this.apiURL}/v1/memes/${id}`, { headers });
  }

 crearMeme(memeData: FormData): Observable<Meme> {
    return this.http.post<Meme>(`${this.apiURL}/admin/memes`, memeData, {
      withCredentials: true
    }).pipe(
      tap({
        next: (response) => console.log('Respuesta exitosa:', response),
        error: (error) => console.log('Error en la petición:', error)
      })
    );
  }

  actualizarMeme(id: number, memeData: FormData): Observable<Meme> {
    return this.http.patch<Meme>(`${this.apiURL}/admin/memes/${id}`, memeData, {
      withCredentials: true 
    });
  }

  eliminarMeme(id: number): Observable<any> {
    const headers = this.getApiHeaders();
    return this.http.delete<any>(`${this.apiURL}/admin/memes/${id}`, {
      withCredentials: true
    });
  }

  votarMeme(id: number, voto: string): Observable<any> {
    return this.http.post(`${this.apiURL}/votos`, { id, voto });
  }

  obtenerCategorias(): Observable<Categoria[]> {
    return this.categoriaService.obtenerCategorias();
  }
}

