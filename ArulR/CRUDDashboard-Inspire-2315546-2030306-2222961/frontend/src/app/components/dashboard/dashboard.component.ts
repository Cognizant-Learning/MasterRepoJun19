import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';

import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { Stats } from '../../models/stats.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dataSource = new MatTableDataSource<Item>([]);
  displayedColumns: string[] = ['select', 'name', 'sku', 'category', 'price', 'quantity', 'actions'];
  selection = new SelectionModel<Item>(true, []);
  stats: Stats | null = null;
  isLoading = true;
  lowStockThreshold = 10;
  searchText = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.itemService.getItems().subscribe(
      (items) => {
        this.dataSource.data = items;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching items', error);
        this.snackBar.open('Error loading items', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );

    this.itemService.getStats().subscribe(
      (stats) => {
        this.stats = stats;
      },
      (error) => {
        console.error('Error fetching stats', error);
      }
    );
  }

  createFilter(): (data: Item, filter: string) => boolean {
    return (data: Item, filter: string): boolean => {
      const searchTerms = filter.toLowerCase().split(' ');
      const dataStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          const val = data[key as keyof Item];
          return currentTerm + (val ? val.toString().toLowerCase() : '');
        }, '')
        .toLowerCase();

      return searchTerms.every(term => dataStr.indexOf(term) !== -1);
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isLowStock(quantity: number): boolean {
    return quantity > 0 && quantity < this.lowStockThreshold;
  }

  isOutOfStock(quantity: number): boolean {
    return quantity === 0;
  }

  deleteItem(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Delete Item', message: 'Are you sure you want to delete this item?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.deleteItem(id).subscribe(
          () => {
            this.loadData();
            this.snackBar.open('Item deleted successfully', 'Close', { duration: 3000 });
          },
          (error) => {
            console.error('Error deleting item', error);
            this.snackBar.open('Error deleting item', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  deleteSelectedItems(): void {
    const selectedIds = this.selection.selected.map(item => item.id as number);
    
    if (selectedIds.length === 0) {
      this.snackBar.open('No items selected', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Bulk Delete', 
        message: `Are you sure you want to delete ${selectedIds.length} item(s)?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.bulkDeleteItems(selectedIds).subscribe(
          () => {
            this.loadData();
            this.selection.clear();
            this.snackBar.open('Items deleted successfully', 'Close', { duration: 3000 });
          },
          (error) => {
            console.error('Error deleting items', error);
            this.snackBar.open('Error deleting items', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
