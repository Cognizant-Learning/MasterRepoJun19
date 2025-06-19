# Prompts for COBOL to JavaScript Migration

## ASK (Claude Sonet 3.7)

### Prompt 1
**Added Context:** `data.cob`, `main.cob`, `operations.cob`  
@workspace /explain  
Go through the application codebase including `README.md`, `data.cob`, `main.cob`, and `operations.cob` and explain the key components used.

### Prompt 2
Based on the above analysis, please draft requirements for a `requirements.md` file considering we have to convert this legacy COBOL application to a modern JavaScript application.

---

## EDIT (Claude Sonet 3.7)

### Prompt 3
The above COBOL to JavaScript Migration Requirements look too broad and are not mapped to the current features/functionalities of the COBOL application.  
Please generate a migration requirement ensuring that it will cover all the functionalities of the COBOL application.

### Prompt 4
**Added Context:** `requirements.md`

---

## AGENT (Claude Sonet 3.7)

### Prompt 5
**Added Context:** `requirements.md`  
Go through the existing legacy COBOL application and `requirements.md` file. Convert all the functionalities into the new UI project. Keep it simple and interactive, and make sure to map all the functionalities and key components.

### Prompt 6
- Initially, the user should not view the Current Balance directly. Add a "View Current Balance" button to display the amount.
- Add an "Exit" button. Upon clicking, it should display an alert, and on clicking "Yes," it will close the tab.

### Prompt 7
- Add an entry page or modal with a "Start" button. Upon clicking, it should take the user to the actual application.
- When clicking the Credit or Debit button, the updated amount should not be displayed at the bottom or on the transaction history page.
- Fix the "Exit" button; it is not working as expected.
- Improve the UI of the application and make it fully responsive.

### Prompt 8
- Add a "Clear Transaction" button and enhance the application UI.
- Try to keep all components on the same screen so that the user does not have to scroll to find buttons or components.