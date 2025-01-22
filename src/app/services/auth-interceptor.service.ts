import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Petición saliente:', {
    url: req.url,
    withCredentials: req.withCredentials,
    headers: req.headers.keys()
  });

  return next(req).pipe(
    tap({
      next: (event) => console.log('Respuesta:', event),
      error: (error) => console.log('Error en la petición:', error)
    })
  );
};