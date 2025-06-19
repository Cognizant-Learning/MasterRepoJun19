import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  itemForm!: FormGroup;
  isEditMode = false;
  itemId?: number;
  isLoading = false;
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Toys', 'Books',
    'Sports', 'Health & Beauty', 'Automotive', 'Grocery', 'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.loadItem(this.itemId);
      }
    });
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      sku: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadItem(id: number): void {
    this.isLoading = true;
    this.itemService.getItemById(id).subscribe(
      (item) => {
        this.itemForm.patchValue({
          name: item.name,
          sku: item.sku,
          category: item.category,
          price: item.price,
          quantity: item.quantity
        });
        
        // Load image if available
        if (item.imageUrl) {
          this.imagePreviewUrl = item.imageUrl;
        }
        
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading item', error);
        this.snackBar.open('Error loading item details', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const itemData: Item = this.itemForm.value;
    
    const submitAction = this.isEditMode
      ? this.itemService.updateItem(this.itemId!, itemData)
      : this.itemService.createItem(itemData);
    
    submitAction.subscribe(
      (item) => {
        // If there's a file selected, upload it
        if (this.selectedFile) {
          this.uploadImage(item.id!);
        } else {
          this.completeSubmission();
        }
      },
      (error) => {
        console.error('Error saving item', error);
        let errorMsg = 'Error saving item';
        
        if (error.error && error.error.details) {
          const detailsArray = Object.entries(error.error.details)
            .map(([field, message]) => `${field}: ${message}`);
          errorMsg = detailsArray.join(', ');
        } else if (error.error && error.error.error) {
          errorMsg = error.error.error;
        }
        
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    );
  }
  
  uploadImage(itemId: number): void {
    if (!this.selectedFile) {
      this.completeSubmission();
      return;
    }
    
    this.itemService.uploadImage(itemId, this.selectedFile).subscribe(
      () => {
        this.completeSubmission();
      },
      (error) => {
        console.error('Error uploading image', error);
        this.snackBar.open('Item saved but image upload failed', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    );
  }
  
  completeSubmission(): void {
    const action = this.isEditMode ? 'updated' : 'created';
    this.snackBar.open(`Item ${action} successfully`, 'Close', { duration: 3000 });
    this.isLoading = false;
    this.router.navigate(['/dashboard']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Check file type
      if (!file.type.match(/image\/jpeg|image\/png/)) {
        this.snackBar.open('Only JPEG and PNG images are allowed', 'Close', { duration: 3000 });
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('Image exceeds maximum size of 2MB', 'Close', { duration: 3000 });
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  clearImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }
}
