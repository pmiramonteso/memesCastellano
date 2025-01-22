import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Access } from '../interface/access';
import { Observable, map, catchError, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = `${environment.endpoint}`;
  private usuarioLogueado = new BehaviorSubject<any>(this.obtenerUsuario());
  usuarioLogueado$ = this.usuarioLogueado.asObservable();

  constructor(private http: HttpClient) {}

  actualizarUsuarioLogueado() {
    const usuario = this.obtenerUsuario();
    this.usuarioLogueado.next(usuario);
  }

  login(email: string, password: string): Observable<Access> {
    return this.http.post<Access>(`${this.apiURL}auth/login`, { email, password }, { withCredentials: true }).pipe(
      tap(response => console.log('Login response:', response)),
      map((response: Access) => {
        const token = response.accessToken;
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiURL}auth/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('apiKey');
        this.actualizarUsuarioLogueado();
      }),
      catchError((error) => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('apiKey');
        this.actualizarUsuarioLogueado();
        throw error;     
      })
    );
  }

  obtenerApiKey(): Observable<any> {
    return this.http.post<any>(`${this.apiURL}api/keys`, {}, { withCredentials: true }).pipe(
      map(response => {
        localStorage.setItem('apiKey', response.apiKey);
        return response;
      })
    );
  }

  revocarApiKey(): Observable<any> {
    const apiKey = localStorage.getItem('apiKey');
    return this.http.delete<any>(`${this.apiURL}api/keys`, {
      headers: { 'x-api-key': apiKey || '' }
    }).pipe(
      map(() => {
        localStorage.removeItem('apiKey');
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
 
  getApiKey() {
    return localStorage.getItem('apiKey');
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
