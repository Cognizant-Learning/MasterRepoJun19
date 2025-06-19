import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemFormComponent } from './item-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

/**
 * Unit tests for ItemFormComponent (Angular frontend).
 */
describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemFormComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with required controls', () => {
    expect(component.form.contains('name')).toBeTrue();
    expect(component.form.contains('sku')).toBeTrue();
    expect(component.form.contains('category')).toBeTrue();
    expect(component.form.contains('price')).toBeTrue();
    expect(component.form.contains('quantity')).toBeTrue();
  });

  it('should be invalid when required fields are empty', () => {
    component.form.setValue({ name: '', sku: '', category: '', price: '', quantity: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('should emit submit event with form value', () => {
    spyOn(component.submit, 'emit');
    component.form.setValue({ name: 'Test', sku: 'SKU1', category: 'Cat', price: 10, quantity: 5 });
    component.onSubmit();
    expect(component.submit.emit).toHaveBeenCalledWith({ name: 'Test', sku: 'SKU1', category: 'Cat', price: 10, quantity: 5 });
  });
});
