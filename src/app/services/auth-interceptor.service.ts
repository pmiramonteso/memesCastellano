import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap, catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let clonedReq = req;

  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    clonedReq = req.clone({
      setHeaders: {
        Authorization: formattedToken
      },
      withCredentials: true
    });
  }

  console.log('Petición saliente:', {
    url: clonedReq.url,
    withCredentials: clonedReq.withCredentials,
    headers: clonedReq.headers.keys(),
    token: token ? 'presente' : 'ausente'
  });

  return next(clonedReq).pipe(
    tap({
      next: (event) => console.log('Respuesta:', event),
      error: (error) => {
        console.log('Error en la petición:', error);
        if (error.status === 401 || error.status === 403) {
          // Token inválido o expirado
          authService.logout();  // Limpia el token y redirige al login
        }
      }
    }),
    catchError(error => {
      return throwError(() => error);
    })
  );
};