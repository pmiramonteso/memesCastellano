import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Categoria } from '../interface/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiURL = `${environment.endpoint}api/categorias`;

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiURL);
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiURL}/${id}`);
  }

  crearCategoria(categoriaData: FormData): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiURL}`, categoriaData).pipe(
      tap(response => {
        console.log('Respuesta de la API al crear categoria:', response);
      })
    );
  }
  
  actualizarCategoria(id: number, categoriaData: FormData): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiURL}/${id}`, categoriaData);
  }
  
  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }
}
