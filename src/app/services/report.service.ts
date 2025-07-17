import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';
import { StockMovement } from '../models/stock-movement.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'https://localhost:7001/api/report';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getLowStockProducts(threshold: number = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock?threshold=${threshold}`, { headers: this.getHeaders() });
  }

  getProductStockMovements(productId: number, count: number = 10): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/stock-movements/${productId}?count=${count}`, { headers: this.getHeaders() });
  }
}
