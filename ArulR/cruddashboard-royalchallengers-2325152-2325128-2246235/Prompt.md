Prompt:
"Create a new React web application named inventory-crud-app using Create React App."
 
 
"Install the following dependencies in the React project:
 
react
react-router-dom
react-redux"
 
"Create a login page in React with two input fields (username and password) and a login button.
Use hardcoded credentials:
 
Username: admin
Password: admin123
On successful login, store a flag in localStorage and redirect to /dashboard. On failure, show an alert."
 
 
"Create a dashboard page in React that includes:
 
A form to add a new product (just a name input is fine)
A list of added products
A delete button for each product
A logout button that clears the login flag from localStorage and redirects to the login page."
 
 
"Fix Git push issues by:
 
Verifying the remote URL with git remote -v
Setting the correct remote URL if needed
Using git add ., git commit -m "message", and git push origin main
If authentication fails, use a personal access token or SSH key."


Design instructuctions:

Heder color should be aligned with table colors

Prompt for testing :-

1. Asked Co-pilot to explain application code. 
2. Asked use cases to test the application
3. Asked co pilot for basic framework set up. 
    - npm init playwright@latest
    - agent - install allure. 
    - asked to craete a base page that contains page initialization and testinfo (for logger)
    - agent - asked copilot to implement logger that takes screenshot for every action/step
