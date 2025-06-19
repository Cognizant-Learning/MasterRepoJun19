import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InventoryDashboardComponent } from './inventory-dashboard.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const mockInventory = [
  { name: 'Test Item', sku: 'SKU-001', category: 'Electronics', price: 10, quantity: 5 },
  { name: 'Another Item', sku: 'SKU-002', category: 'Toys', price: 20, quantity: 0 }
];

describe('InventoryDashboardComponent', () => {
  let component: InventoryDashboardComponent;
  let fixture: ComponentFixture<InventoryDashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [InventoryDashboardComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(InventoryDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load inventory on init', fakeAsync(() => {
    const req = httpMock.expectOne('http://localhost:3001/api/inventory');
    req.flush(mockInventory);
    tick();
    expect(component.items.length).toBe(2);
    expect(component.items[0].name).toBe('Test Item');
  }));

  it('should add a new item', () => {
    component.newItem = { name: 'New', sku: 'SKU-003', category: 'Home', price: 5, quantity: 2 };
    component.items = [...mockInventory];
    component.addItem();
    expect(component.items.length).toBe(3);
    expect(component.items[2].name).toBe('New');
  });

  it('should not add duplicate item', () => {
    component.newItem = { name: 'Test Item', sku: 'SKU-001', category: 'Electronics', price: 10, quantity: 5 };
    component.items = [...mockInventory];
    component.addItem();
    expect(component.errorMsg).toContain('already exists');
  });

  it('should delete an item', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.items = [...mockInventory];
    component.deleteItem(0);
    expect(component.items.length).toBe(1);
    expect(component.items[0].name).toBe('Another Item');
  });

  it('should start and cancel edit', () => {
    component.items = [...mockInventory];
    component.startEdit(0);
    expect(component.editingIndex).toBe(0);
    component.cancelEdit();
    expect(component.editingIndex).toBeNull();
  });

  it('should update an item', () => {
    component.items = [...mockInventory];
    component.startEdit(0);
    component.editItem.name = 'Updated';
    component.saveEdit();
    expect(component.items[0].name).toBe('Updated');
  });

  it('should filter items by search term', () => {
    component.items = [...mockInventory];
    component.searchTerm = 'Test';
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].name).toBe('Test Item');
  });

  it('should sort items by name', () => {
    component.items = [...mockInventory];
    component.setSort('name');
    expect(component.sortColumn).toBe('name');
    expect(component.filteredItems[0].name).toBe('Another Item');
  });

  it('should paginate items', () => {
    component.items = Array.from({ length: 25 }, (_, i) => ({ name: 'Item ' + i, sku: 'SKU-' + i, category: 'Cat', price: 1, quantity: 1 }));
    component.itemsPerPage = 10;
    component.currentPage = 2;
    expect(component.pagedItems.length).toBe(10);
    expect(component.pagedItems[0].name).toBe('Item 10');
  });

  it('should select and bulk delete items', () => {
    component.items = [...mockInventory];
    component.pagedItems.forEach(item => (item.selected = true));
    component.selectedCount = 2;
    spyOn(window, 'confirm').and.returnValue(true);
    component.confirmBulkDelete();
    expect(component.items.length).toBe(0);
  });
});
