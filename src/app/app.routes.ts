import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/usuario/login/login.component';
import { RegistroComponent } from './components/usuario/registro/registro.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component';
//import { AuthGuard } from './guards/auth.guard';
import { AdminMemesComponent } from './components/admin/admin-memes/admin-memes.component';
import { PanelAdminComponent } from './components/admin/panel-admin/panel-admin.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },

    { path: 'categorias', component: CategoriasComponent },
    { path: 'categorias/:categoria', component: VotacionesComponent },
    { path: 'votaciones', component: VotacionesComponent },
    
    { path: 'memes-admin', component: AdminMemesComponent },
    { path: 'panel-admin', component: PanelAdminComponent },

    { path: '**', redirectTo: '/home' },
];
