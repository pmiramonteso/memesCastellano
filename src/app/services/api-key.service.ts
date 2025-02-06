import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {
  private apiURL = `${environment.endpoint}api/keys`;

  constructor(private http: HttpClient) {}

generateApiKey(): Observable<any> {
    return this.http.post(`${this.apiURL}/generate`, {}, { 
      withCredentials: true
    });
  }

  revokeApiKey(apiKey: string): Observable<any> {
    const headers = new HttpHeaders().set('x-api-key', apiKey);
    return this.http.post(`${this.apiURL}/revoke`, {}, { headers,
      withCredentials: true
    });
  }
}