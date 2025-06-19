class BankAccount:
    def __init__(self, balance=0.0):
        self.balance = float(balance)
        self.transactions = []

    def credit(self, amount):
        if not self._is_valid_amount(amount):
            return False, "Invalid amount."
        if amount <= 0:
            return False, "Credit amount must be positive."
        self.balance += amount
        self.transactions.append(('credit', amount))
        return True, f"New balance: {self.balance:.2f}"

    def debit(self, amount):
        if not self._is_valid_amount(amount):
            return False, "Invalid amount."
        if amount <= 0:
            return False, "Debit amount must be positive."
        if amount > self.balance:
            return False, "Insufficient funds."
        self.balance -= amount
        self.transactions.append(('debit', amount))
        return True, f"New balance: {self.balance:.2f}"

    def view_balance(self):
        return self.balance

    def view_transactions(self):
        return self.transactions

    @staticmethod
    def _is_valid_amount(amount):
        try:
            float(amount)
            return True
        except (TypeError, ValueError):
            return False


def test_scenarios():
    account = BankAccount(100.0)
    print("Scenario 1: View Account Balance")
    print(f"Balance: {account.view_balance():.2f}")

    print("\nScenario 2: Credit Account (valid)")
    success, msg = account.credit(50.0)
    print(msg)

    print("\nScenario 3: Credit Account (invalid - negative)")
    success, msg = account.credit(-10.0)
    print(msg)

    print("\nScenario 3: Credit Account (invalid - non-numeric)")
    success, msg = account.credit("abc")
    print(msg)

    print("\nScenario 4: Debit Account (valid)")
    success, msg = account.debit(30.0)
    print(msg)

    print("\nScenario 5: Debit Account (insufficient funds)")
    success, msg = account.debit(1000.0)
    print(msg)

    print("\nScenario 6: Debit Account (invalid - negative)")
    success, msg = account.debit(-5.0)
    print(msg)

    print("\nScenario 6: Debit Account (invalid - non-numeric)")
    success, msg = account.debit("xyz")
    print(msg)

    print("\nScenario 7: View Transaction History")
    print(account.view_transactions())

import unittest

class TestBankAccountOperations(unittest.TestCase):
    def setUp(self):
        self.account = BankAccount(100.0)

    def test_view_account_balance(self):
        self.assertEqual(self.account.view_balance(), 100.0)

    def test_credit_account_valid(self):
        success, msg = self.account.credit(50.0)
        self.assertTrue(success)
        self.assertIn("New balance", msg)
        self.assertEqual(self.account.view_balance(), 150.0)
        self.assertIn(('credit', 50.0), self.account.view_transactions())

    def test_credit_account_invalid_negative(self):
        success, msg = self.account.credit(-10.0)
        self.assertFalse(success)
        self.assertIn("positive", msg)

    def test_credit_account_invalid_non_numeric(self):
        success, msg = self.account.credit("abc")
        self.assertFalse(success)
        self.assertIn("Invalid amount", msg)

    def test_debit_account_valid(self):
        success, msg = self.account.debit(30.0)
        self.assertTrue(success)
        self.assertIn("New balance", msg)
        self.assertEqual(self.account.view_balance(), 70.0)
        self.assertIn(('debit', 30.0), self.account.view_transactions())

    def test_debit_account_insufficient_funds(self):
        success, msg = self.account.debit(1000.0)
        self.assertFalse(success)
        self.assertIn("Insufficient funds", msg)

    def test_debit_account_invalid_negative(self):
        success, msg = self.account.debit(-5.0)
        self.assertFalse(success)
        self.assertIn("positive", msg)

    def test_debit_account_invalid_non_numeric(self):
        success, msg = self.account.debit("xyz")
        self.assertFalse(success)
        self.assertIn("Invalid amount", msg)

    def test_view_transaction_history(self):
        self.account.credit(20.0)
        self.account.debit(10.0)
        txs = self.account.view_transactions()
        self.assertIn(('credit', 20.0), txs)
        self.assertIn(('debit', 10.0), txs)

if __name__ == "__main__":
    test_scenarios()
    unittest.main()
