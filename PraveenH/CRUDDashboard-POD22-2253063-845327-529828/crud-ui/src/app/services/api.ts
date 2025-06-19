import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Data } from '../models/data';
import { environment } from '../../environments/environment';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = environment.apiUrl;
  private useMockData = true; // Set to false when your real backend is ready
  constructor(
    private http: HttpClient,
    private mockService: MockApiService
  ) { }

  // Get all data items
  getAllData(): Observable<Data[]> {
    if (this.useMockData) {
      return this.mockService.getAllData();
    }
    return this.http.get<Data[]>(`${this.apiUrl}/data`);
  }

  // Get a single data item by ID
  getData(id: number): Observable<Data> {
    if (this.useMockData) {
      return this.mockService.getData(id);
    }
    return this.http.get<Data>(`${this.apiUrl}/data/${id}`);
  }

  // Create new data item
  createData(data: Data): Observable<Data> {
    if (this.useMockData) {
      return this.mockService.createData(data);
    }
    return this.http.post<Data>(`${this.apiUrl}/data`, data);
  }

  // Update existing data item
  updateData(id: number, data: Data): Observable<Data> {
    if (this.useMockData) {
      return this.mockService.updateData(id, data);
    }
    return this.http.put<Data>(`${this.apiUrl}/data/${id}`, data);
  }

  // Delete data item
  deleteData(id: number): Observable<any> {
    if (this.useMockData) {
      return this.mockService.deleteData(id);
    }
    return this.http.delete<any>(`${this.apiUrl}/data/${id}`);
  }
}
