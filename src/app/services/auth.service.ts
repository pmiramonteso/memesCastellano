import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Access } from '../interface/access';
import { Observable, map, catchError, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = `${environment.endpoint}`;
  private isAuthenticated = false;
  private usuarioLogueado = new BehaviorSubject<any>(this.obtenerUsuario());
  usuarioLogueado$ = this.usuarioLogueado.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  actualizarUsuarioLogueado() {
    const usuario = this.obtenerUsuario();
    this.usuarioLogueado.next(usuario);
  }

  login(email: string, password: string): Observable<Access> {
    return this.http.post<Access>(`${this.apiURL}auth/login`, { email, password }, { withCredentials: true }).pipe(
      map((response: Access) => {
        const { accessToken, data } = response;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        this.actualizarUsuarioLogueado();
        return response;
      })
    );
  }

  registro(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}auth/registro`, data).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error en el registro:', error);
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiURL}auth/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
      }),
      catchError((error) => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.actualizarUsuarioLogueado();
        throw error;
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken() {
    return localStorage.getItem('token');
  }
  obtenerUsuario(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        return usuario;
      } catch {
        return null;
      }
    }
    return null;
  }
}
