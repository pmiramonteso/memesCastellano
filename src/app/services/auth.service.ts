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
    console.log('Actualizando usuario logueado:', usuario);
    this.usuarioLogueado.next(usuario);
  }

  login(email: string, password: string): Observable<Access> {
    return this.http.post<Access>(`${this.apiURL}auth/login`, { email, password }, { withCredentials: true }).pipe(
      tap(response => {
        if (response && response.data) {
          const token = response.data.accessToken;
          const apiKey = response.data.apiKey;
          if (token) {
            localStorage.setItem('token', token);
            if (apiKey) {
              localStorage.setItem('apiKey', apiKey);
            }
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
            this.actualizarUsuarioLogueado();

          } else {
            console.warn('Respuesta del login no contiene el token esperado');
          }
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  //Se recupera el token, sale en consola
  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
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
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.usuarioLogueado.next(null);
      }),
      catchError(error => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.usuarioLogueado.next(null);
        throw error;
      })
    );
  }
  
  isLoggedIn(): boolean {
    const loggedIn = !!this.getToken();
    console.log('¿Está logueado?:', loggedIn);
    return loggedIn;
  }
 
  getApiKey() {
    const apiKey = localStorage.getItem('apiKey');
    console.log('API Key recuperada:', apiKey);
    return apiKey;
  }
  
  //Aqui se obtiene el usuario, en consola sale 
  obtenerUsuario(): any {
    const usuarioStr = localStorage.getItem('usuario');
    try {
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
      return usuario;
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      return null;
    }
  }
}
