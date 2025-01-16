import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private apiURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiURL}/categorias`);
  }

  getMemesPorCategoria(categoria: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/memes?categoria=${categoria}`);
  }

  getMemePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/memes/${id}`);
  }

  crearMeme(memeData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/memes`, memeData);
  }

  actualizarMeme(id: number, memeData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/memes/${id}`, memeData);
  }

  eliminarMeme(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/memes/${id}`);
  }

  votarMeme(id: number, voto: string): Observable<any> {
    return this.http.post(`${this.apiURL}/votos`, { id, voto });
  }
}

