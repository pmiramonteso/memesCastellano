import { Component } from '@angular/core';
import { NavegacionComponent } from '../../shared/navegacion/navegacion.component';


@Component({
  selector: 'app-home',
  imports: [ NavegacionComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
