1. ## User Story

**As a store manager, I want to see all my items in a central dashboard, be able to add, update, and remove stock instantly, and get quick insights into my inventory's health, so I can make smarter decisions and stop wasting time on manual data entry.**

### Acceptance Criteria

- The dashboard displays a list of all inventory items with key details (name, quantity, status).
- The manager can add new items to the inventory from the dashboard.
- The manager can update existing item details (e.g., quantity, name, status).
- The manager can remove items from the inventory.
- The dashboard provides quick insights (e.g., low stock alerts, total items, out-of-stock items).
- All changes are reflected instantly without manual refresh.

---

#### EXTRA feature added
bulk delete functionality
download report
pagination

# Prompts and Feature Requests

- create a dashboard where i can add an inventory to ther stock for central dashboard
- add a delete functionality for the inventory to the stock for central dashboard
- add validation to check if stock quantity is minmum 1 to add
- show the alert if quantity is less than 1 while adding stock
- add mandatory field validation for "Name" and "Quantity" and highlight the field with RED color when user clicks on add button
- I want a custom error msg considering both fileds
- validation msg should come in next line
- only show the combined custom msg in new line, not beside button
- remove individual field validation msg
- add a edit functionality for the inventory to the stock for central dashboard
- change save to update
- all buttons should be in same row
- if edit is clicked, delete button should be hidden
- stock dropdown should not come up while editing also, based on the quantity updated per inventory, it should show updated value in the dashboard
- before deleting, ask
- update inventory should accept 0 also
- beautify the UI
- color of the button should be like APC.com
- please apply professional look
- Please restart Angular app
- get full screen size
- height and width should be according to the screen size
- remove alert popup for quantity
- add 100 items to the inventory
- where did you store all 100 items?
- create a sample json with 100 items and read from there
- read and update inventory to json
- fix the uncaughtException HttpErrorResponse error
- '<pre>Cannot GET /assets/inventory-sample.json</pre>\n' + - fix this
- add paginations for 10 items per page
- when update any inventory, update in json as well
- add search functionality and filter at the starting of the table
- add all prompts in the prompts.md
- check if "name" exists while adding new inventory. if exists show validation msg
- add sorting functionality to the tabl
- sorting icon should present by default

- paginate the table to show 10 items per page

-A header showing Total Unique Items, Items Low on Stock, and Items Out of Stock
- update table and json with below fields : Name, SKU, Category, Price, Quantity.
-visually highlighted (a yellow background) if low in stock

- visually highlighted (a red background) if out of stock
- Add validation to check if inventory item exist before adding. If exist, show the validation message
- Please make different category in sample json data
- add a functionality download whole table in xls format
- TS2307: Cannot find module 'xlsx' or its corresponding type declarations.
- download button should be right top of the table with an icon
- download Report button and seacrh bar should be in same row
- download report button should be in same size of other buttons
- implement bulk delete functionality
- no checkbox should be checked by default in page refresh
- search bar width should 80%, delete selected should be same color of other buttons
- update search functionality with name, sku and category
- give some relistic names to "name"

























