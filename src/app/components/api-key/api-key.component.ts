import { Component, OnInit } from '@angular/core';
import { ApiKeyService } from '../../services/api-key.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-key',
  imports: [CommonModule],
  templateUrl: './api-key.component.html',
  styleUrl: './api-key.component.scss'
})
export class ApiKeyComponent implements OnInit{
  apiKey: string | null = null;
  message: string = '';

  constructor(private apiKeyService: ApiKeyService) {}

  ngOnInit() {
    this.apiKey = localStorage.getItem('apiKey');
  }

  generarApiKey(): void {
    this.apiKeyService.generateApiKey().subscribe({
      next: (response) => {
        const nuevaApiKey = response.apiKey;
        if (nuevaApiKey) {
          this.apiKey = nuevaApiKey;
          localStorage.setItem('apiKey', nuevaApiKey);
          this.message = 'API Key generada correctamente';
        }
      },
      error: (err) => {
        this.message = err.error.message || 'Error al generar la API Key';
      },
    });
  }

  copiarApiKey(apiKey: string) {
    navigator.clipboard.writeText(apiKey).then(() => {
      this.message = 'API Key copiada al portapapeles!';
      setTimeout(() => this.message = '', 3000);
    }).catch(err => {
      console.error('Error al copiar la API Key', err);
    });
  }

  
  revokeApiKey(): void {
    if (this.apiKey) {
      this.apiKeyService.revokeApiKey(this.apiKey).subscribe({
        next: (response) => {
          this.message = response.message;
          this.apiKey = null;
        },
        error: (err) => {
          this.message = err.error.message || 'Error al revocar la API Key';
        },
      });
    }
  }
}
