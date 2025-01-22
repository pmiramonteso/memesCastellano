import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Categoria } from '../interface/categoria';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiURL = `${environment.endpoint}api`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Métodos públicos
  obtenerCategoriasPublicas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiURL}/public/categorias`);
  }

  // Métodos protegidos por API Key
  obtenerCategorias(): Observable<Categoria[]> {
    const headers = this.getApiHeaders();
    return this.http.get<Categoria[]>(`${this.apiURL}/v1/categorias`, { headers });
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    const headers = this.getApiHeaders();
    return this.http.get<Categoria>(`${this.apiURL}/v1/categorias/${id}`, { headers });
  }

  // Métodos administrativos
  crearCategoria(categoriaData: FormData): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiURL}/admin/categorias`, categoriaData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('Respuesta de la API al crear categoria:', response);
      })
    );
  }
  
  actualizarCategoria(id: number, categoriaData: FormData): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiURL}/admin/categorias/${id}`, categoriaData);
  }
  
  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/admin/categorias/${id}`);
  }

  private getApiHeaders(): HttpHeaders {
    const apiKey = this.authService.getApiKey();
    return new HttpHeaders().set('x-api-key', apiKey || '');
  }
}
