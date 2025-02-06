import { Component } from '@angular/core';
import { ApiKeyComponent } from '../../api-key/api-key.component';
import { ModificarPerfil } from '../modificar-perfil/modificar-perfil.component';

@Component({
  selector: 'app-dashboard',
  imports: [ApiKeyComponent, ModificarPerfil],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
