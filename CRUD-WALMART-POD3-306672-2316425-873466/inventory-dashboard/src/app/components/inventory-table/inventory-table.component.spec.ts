// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// /**
//  * Unit tests for InventoryTableComponent (Angular frontend).
//  */
// describe('InventoryTableComponent', () => {
//   let component: InventoryTableComponent;
//   let fixture: ComponentFixture<InventoryTableComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [InventoryTableComponent],
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(InventoryTableComponent);
//     component = fixture.componentInstance;
//     component.items = [
//       { id: 1, name: 'Low', sku: 'SKU1', category: 'Cat', price: 10, quantity: 2 },
//       { id: 2, name: 'Out', sku: 'SKU2', category: 'Cat', price: 5, quantity: 0 },
//       { id: 3, name: 'Normal', sku: 'SKU3', category: 'Cat', price: 20, quantity: 15 }
//     ];
//     fixture.detectChanges();
//   });

//   it('should display all items in the table', () => {
//     const rows = fixture.debugElement.queryAll(By.css('tr'));
//     // 1 header + 3 data rows
//     expect(rows.length).toBe(4);
//   });

//   it('should highlight low stock items in yellow', () => {
//     const lowStockRow = fixture.debugElement.queryAll(By.css('tr'))[1];
//     expect(lowStockRow.nativeElement.classList).toContain('low-stock');
//   });

//   it('should highlight out of stock items in red', () => {
//     const outOfStockRow = fixture.debugElement.queryAll(By.css('tr'))[2];
//     expect(outOfStockRow.nativeElement.classList).toContain('out-of-stock');
//   });

//   it('should emit edit event when edit button is clicked', () => {
//     spyOn(component.edit, 'emit');
//     const editBtn = fixture.debugElement.query(By.css('.edit-btn'));
//     editBtn.triggerEventHandler('click', null);
//     expect(component.edit.emit).toHaveBeenCalled();
//   });

//   it('should emit delete event when delete button is clicked', () => {
//     spyOn(component.delete, 'emit');
//     const deleteBtn = fixture.debugElement.query(By.css('.delete-btn'));
//     deleteBtn.triggerEventHandler('click', null);
//     expect(component.delete.emit).toHaveBeenCalled();
//   });
// });
