import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.obtenerUsuario();
  const token = authService.getToken();

  const roles: string[] = route.data['roles']; 

  if (token && usuario) { 
    console.log("Roles match:", roles.some(role => usuario['roles']?.includes(role)));
    if (roles.some(role => usuario['roles']?.includes(role))) {
      return true;
    }
}
router.navigate(['/login']);
return false;
};