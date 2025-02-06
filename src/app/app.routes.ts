import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home.component';

import { LoginComponent } from './components/usuario/login/login.component';
import { RegistroComponent } from './components/usuario/registro/registro.component';
import { DashboardComponent } from './components/usuario/dashboard/dashboard.component';
import { ApiKeyComponent } from './components/api-key/api-key.component';

import { CategoriasComponent } from './components/categorias/categorias.component';
import { DocApiComponent } from './components/doc-api/doc-api.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component';

import { AdminMemesComponent } from './components/admin/admin-memes/admin-memes.component';
import { PanelAdminComponent } from './components/admin/panel-admin/panel-admin.component';
import { CategoriasAdminComponent } from './components/admin/categorias-admin/categorias-admin.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },

    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'panel-usuario', component: DashboardComponent, canActivate: [authGuard], data: { roles: ['usuario'] }},
    { path: 'api-key', component: ApiKeyComponent },

    { path: 'categorias', component: CategoriasComponent },
    { path: 'categorias/:categoria', component: DocApiComponent },
    { path: 'votaciones', component: VotacionesComponent },
    
    { path: 'memes-admin', component: AdminMemesComponent, canActivate: [authGuard], data: { roles: ['admin']  }},
    { path: 'panel-admin', component: PanelAdminComponent, canActivate: [authGuard], data: { roles: ['admin']  }},
    { path: 'categorias-admin', component: CategoriasAdminComponent, canActivate: [authGuard], data: { roles: ['admin']  } },

    { path: '**', redirectTo: '/home' },
];
