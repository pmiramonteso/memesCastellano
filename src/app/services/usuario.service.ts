import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { Usuario } from '../interface/usuario';
import { Access } from '../interface/access';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiURL = `${environment.endpoint}`;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) { }

  obtenerPerfil(): Observable<Access> {
    const token = localStorage.getItem('token') || '';
    console.log('Servicio: Obteniendo perfil');
    return this.http.get<Access>(`${this.apiURL}usuario/perfil`).pipe(
      tap(response => {
        console.log('Servicio: Respuesta recibida:', response);
        if (response?.data?.usuario) {
          console.log('Servicio: Usuario obtenido:', response.data.usuario);
          this.usuarioSubject.next(response.data.usuario);
        } else {
          console.warn('Servicio: No se encontró el usuario en la respuesta.');
        }
      })
    );
  }

  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiURL}usuario/${id}`);
  }

  actualizarUsuario(usuario: Partial<Usuario>): Observable<Access> {
    return this.http.patch<Access>(`${this.apiURL}usuario/perfil`, usuario, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response && response.data && response.data.usuario) {
          this.usuarioSubject.next(response.data.usuario);
        }
      })
    );
  }
}
