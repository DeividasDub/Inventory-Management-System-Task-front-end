import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMovement, CreateStockMovementRequest } from '../models/stock-movement.interface';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {
  private apiUrl = 'https://localhost:7001/api/stockmovement';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createStockMovement(movement: CreateStockMovementRequest): Observable<StockMovement> {
    return this.http.post<StockMovement>(this.apiUrl, movement, { headers: this.getHeaders() });
  }

  getProductStockMovements(productId: number, count: number = 10): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/product/${productId}?count=${count}`, { headers: this.getHeaders() });
  }
}
