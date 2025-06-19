// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { InventoryService } from './inventory.service';

// /**
//  * Unit tests for InventoryService (Angular frontend).
//  */
// describe('InventoryService', () => {
//   let service: InventoryService;
//   let httpMock: HttpTestingController;
//   const apiUrl = '/api/inventory';

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [InventoryService]
//     });
//     service = TestBed.inject(InventoryService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should fetch all inventory items', () => {
//     const mockItems: InventoryItem[] = [
//       { id: 1, name: 'Test', sku: 'SKU1', category: 'Cat', price: 10, quantity: 5 }
//     ];
//     service.getAllItems().subscribe(items => {
//       expect(items.length).toBe(1);
//       expect(items[0].name).toBe('Test');
//     });
//     const req = httpMock.expectOne(apiUrl);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockItems);
//   });

//   it('should create an inventory item', () => {
//     const newItem: InventoryItem = { id: 2, name: 'New', sku: 'SKU2', category: 'Cat', price: 20, quantity: 10 };
//     service.createItem(newItem).subscribe(item => {
//       expect(item.sku).toBe('SKU2');
//     });
//     const req = httpMock.expectOne(apiUrl);
//     expect(req.request.method).toBe('POST');
//     req.flush(newItem);
//   });

//   it('should update an inventory item', () => {
//     const updatedItem: InventoryItem = { id: 1, name: 'Updated', sku: 'SKU1', category: 'Cat', price: 15, quantity: 8 };
//     service.updateItem(1, updatedItem).subscribe(item => {
//       expect(item.name).toBe('Updated');
//     });
//     const req = httpMock.expectOne(`${apiUrl}/1`);
//     expect(req.request.method).toBe('PUT');
//     req.flush(updatedItem);
//   });

//   it('should delete an inventory item', () => {
//     service.deleteItem(1).subscribe(res => {
//       expect(res).toBeNull();
//     });
//     const req = httpMock.expectOne(`${apiUrl}/1`);
//     expect(req.request.method).toBe('DELETE');
//     req.flush(null);
//   });

//   it('should search inventory items', () => {
//     const mockItems: InventoryItem[] = [
//       { id: 1, name: 'Test', sku: 'SKU1', category: 'Cat', price: 10, quantity: 5 }
//     ];
//     service.searchItems('Test').subscribe(items => {
//       expect(items.length).toBe(1);
//     });
//     const req = httpMock.expectOne(`${apiUrl}/search?query=Test`);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockItems);
//   });

//   it('should get low stock items', () => {
//     const mockItems: InventoryItem[] = [
//       { id: 1, name: 'Low', sku: 'SKU3', category: 'Cat', price: 5, quantity: 2 }
//     ];
//     service.getLowStockItems(5).subscribe(items => {
//       expect(items[0].quantity).toBeLessThan(5);
//     });
//     const req = httpMock.expectOne(`${apiUrl}/low-stock?threshold=5`);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockItems);
//   });

//   it('should get out of stock items', () => {
//     const mockItems: InventoryItem[] = [
//       { id: 2, name: 'Out', sku: 'SKU4', category: 'Cat', price: 0, quantity: 0 }
//     ];
//     service.getOutOfStockItems().subscribe(items => {
//       expect(items[0].quantity).toBe(0);
//     });
//     const req = httpMock.expectOne(`${apiUrl}/out-of-stock`);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockItems);
//   });
// });
