import { Component, Inject } from '@angular/core';
import { InventoryItem } from '../services/inventory';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.scss'
})
export class ItemForm {
  item: Partial<InventoryItem>;
  constructor(
    public dialogRef: MatDialogRef<ItemForm>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Partial<InventoryItem> }
  ) {
    this.item = { ...data.item };
  }

  onSubmit() {
    if (this.item.name && this.item.sku && this.item.category && this.item.price != null && this.item.quantity != null) {
      this.dialogRef.close(this.item as InventoryItem);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
