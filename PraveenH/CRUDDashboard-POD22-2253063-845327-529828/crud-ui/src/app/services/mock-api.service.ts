import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Data } from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private items: Data[] = [
    {
      id: 1,
      name: 'Item 1',
      description: 'This is the first sample item',
      status: 'active',
      createdAt: new Date('2025-06-10'),
      updatedAt: new Date('2025-06-10')
    },
    {
      id: 2,
      name: 'Item 2',
      description: 'This is the second sample item with a longer description to test wrapping and display of longer content in the UI components.',
      status: 'active',
      createdAt: new Date('2025-06-12'),
      updatedAt: new Date('2025-06-15')
    },
    {
      id: 3,
      name: 'Item 3',
      description: 'This is an inactive item',
      status: 'inactive',
      createdAt: new Date('2025-06-14'),
      updatedAt: new Date('2025-06-14')
    },
    {
      id: 4,
      name: 'Item 4',
      description: 'Another sample item for testing',
      status: 'active',
      createdAt: new Date('2025-06-18'),
      updatedAt: new Date('2025-06-18')
    },
    {
      id: 5,
      name: 'Item 5',
      description: 'The last sample item in our mock data set',
      status: 'inactive',
      createdAt: new Date('2025-06-19'),
      updatedAt: new Date('2025-06-19')
    }
  ];

  // Simulate network delay
  private delay = 500;

  getAllData(): Observable<Data[]> {
    return of([...this.items]).pipe(delay(this.delay));
  }

  getData(id: number): Observable<Data> {
    const item = this.items.find(item => item.id === id);
    
    if (item) {
      return of({...item}).pipe(delay(this.delay));
    }
    
    return throwError(() => new Error(`Item with id ${id} not found`));
  }

  createData(data: Data): Observable<Data> {
    // Generate a new ID (in a real app this would be done by the server)
    const newId = Math.max(...this.items.map(item => item.id), 0) + 1;
    
    const newItem: Data = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.items.push(newItem);
    
    return of({...newItem}).pipe(delay(this.delay));
  }

  updateData(id: number, data: Data): Observable<Data> {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      const updatedItem: Data = {
        ...this.items[index],
        ...data,
        id: id, // Ensure ID doesn't change
        updatedAt: new Date()
      };
      
      this.items[index] = updatedItem;
      
      return of({...updatedItem}).pipe(delay(this.delay));
    }
    
    return throwError(() => new Error(`Item with id ${id} not found`));
  }

  deleteData(id: number): Observable<void> {
    const index = this.items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      this.items.splice(index, 1);
      return of(undefined).pipe(delay(this.delay));
    }
    
    return throwError(() => new Error(`Item with id ${id} not found`));
  }
}
