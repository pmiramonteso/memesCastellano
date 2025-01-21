import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent implements OnInit{
  mensaje: string | null = null;
  tipo: 'success' | 'error' | null = null;

  constructor(private notificationService: NotificacionesService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(({ message, type }) => {
      this.mensaje = message;
      this.tipo = type;
    });
  }
}

