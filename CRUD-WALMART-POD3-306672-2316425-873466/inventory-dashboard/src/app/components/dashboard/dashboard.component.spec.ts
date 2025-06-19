// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { DashboardComponent } from './dashboard.component';
// import { InventoryService } from '../../services/inventory.service';
// import { of } from 'rxjs';

// /**
//  * Unit tests for DashboardComponent (Angular frontend).
//  */
// describe('DashboardComponent', () => {
//   let component: DashboardComponent;
//   let fixture: ComponentFixture<DashboardComponent>;
//   let inventoryServiceSpy: jasmine.SpyObj<InventoryService>;

//   beforeEach(async () => {
//     const spy = jasmine.createSpyObj('InventoryService', ['getAllItems', 'getLowStockItems', 'getOutOfStockItems']);
//     await TestBed.configureTestingModule({
//       declarations: [DashboardComponent],
//       providers: [{ provide: InventoryService, useValue: spy }]
//     }).compileComponents();
//     inventoryServiceSpy = TestBed.inject(InventoryService) as jasmine.SpyObj<InventoryService>;
//   });

//   beforeEach(() => {
//     inventoryServiceSpy.getAllItems.and.returnValue(of([{ id: 1, name: 'A', sku: 'S1', category: 'C', price: 1, quantity: 2 }]));
//     inventoryServiceSpy.getLowStockItems.and.returnValue(of([{ id: 2, name: 'B', sku: 'S2', category: 'C', price: 2, quantity: 1 }]));
//     inventoryServiceSpy.getOutOfStockItems.and.returnValue(of([{ id: 3, name: 'C', sku: 'S3', category: 'C', price: 3, quantity: 0 }]));
//     fixture = TestBed.createComponent(DashboardComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should display key statistics', () => {
//     expect(component.keyStats.totalItems).toBe(1);
//     expect(component.keyStats.lowStock).toBe(1);
//     expect(component.keyStats.outOfStock).toBe(1);
//   });

//   it('should fetch inventory data on init', () => {
//     expect(inventoryServiceSpy.getAllItems).toHaveBeenCalled();
//     expect(inventoryServiceSpy.getLowStockItems).toHaveBeenCalled();
//     expect(inventoryServiceSpy.getOutOfStockItems).toHaveBeenCalled();
//   });
// });
