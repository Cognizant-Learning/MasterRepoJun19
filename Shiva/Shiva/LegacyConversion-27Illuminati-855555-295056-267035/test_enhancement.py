# test_enhancement.py
from enhancement import *
from datetime import datetime

def run_migration_validations():
    print("Starting Migration Validation Tests...")
    
    # Sample test data
    source_accounts = [
        {'id': 1, 'balance': 1000.0},
        {'id': 2, 'balance': 2500.0},
        {'id': 3, 'balance': 150.0}
    ]

    target_accounts = [
        {'id': 1, 'balance': 1000.0},
        {'id': 2, 'balance': 2500.0},
        {'id': 2, 'balance': 2500.0},  # Duplicate for testing
        {'id': 4, 'balance': '150'}    # Wrong type for testing
    ]

    source_transactions = [
        {'id': 1, 'account_id': 1, 'amount': 100.0, 'type': 'credit', 'date': datetime.now()},
        {'id': 2, 'account_id': 2, 'amount': 250.0, 'type': 'debit', 'date': datetime.now()}
    ]

    target_transactions = [
        {'id': 1, 'account_id': 1, 'amount': 100.0, 'type': 'credit', 'date': datetime.now()},
        {'id': 2, 'account_id': 5, 'amount': 250.0, 'type': 'debit', 'date': datetime.now()},  # Invalid account_id
        {'id': 3, 'account_id': 2, 'amount': -50.0, 'type': 'credit', 'date': None}  # Invalid amount and null date
    ]

    print("\n1. Checking for duplicate records:")
    duplicates = check_duplicates(target_accounts, 'id')
    print(f"Found {len(duplicates)} duplicate account(s)")
    if duplicates:
        print("Duplicate accounts:")
        for acc in duplicates:
            print(f"  ID: {acc['id']}, Balance: {acc['balance']}")

    print("\n2. Checking data types:")
    schema = {'id': int, 'balance': float}
    type_mismatches = check_data_types(target_accounts, schema)
    print(f"Found {len(type_mismatches)} type mismatch(es)")
    if type_mismatches:
        print("Type mismatches:")
        for record, field, found_type in type_mismatches:
            print(f"  Record ID: {record['id']}, Field: {field}, Expected: {schema[field].__name__}, Found: {found_type.__name__}")

    print("\n3. Comparing record counts:")
    counts_match = compare_record_counts(source_accounts, target_accounts)
    print(f"Record counts match: {counts_match}")
    if not counts_match:
        print(f"  Source records: {len(source_accounts)}")
        print(f"  Target records: {len(target_accounts)}")

    print("\n4. Checking for value mismatches:")
    value_mismatches = check_value_mismatches(source_accounts, target_accounts, 'id', ['balance'])
    print(f"Found {len(value_mismatches)} value mismatch(es)")
    if value_mismatches:
        print("Value mismatches:")
        for mismatch in value_mismatches:
            if isinstance(mismatch, tuple) and len(mismatch) == 4:
                key, field, src_val, tgt_val = mismatch
                print(f"  ID: {key}, Field: {field}, Source: {src_val}, Target: {tgt_val}")
            else:
                print(f"  Record: {mismatch}")

    print("\n5. Checking for null values:")
    nulls = check_nulls(target_transactions, ['id', 'account_id', 'amount', 'type', 'date'])
    print(f"Found {len(nulls)} null value(s)")
    if nulls:
        print("Null values found:")
        for record, field in nulls:
            print(f"  Transaction ID: {record['id']}, Null field: {field}")

    print("\n6. Checking referential integrity:")
    invalid_refs = check_referential_integrity(target_transactions, target_accounts)
    print(f"Found {len(invalid_refs)} invalid reference(s)")
    if invalid_refs:
        print("Transactions with invalid account references:")
        for tx in invalid_refs:
            print(f"  Transaction ID: {tx['id']}, Invalid Account ID: {tx['account_id']}")

    print("\n7. Checking business logic:")
    negative_balances = check_negative_balances(target_accounts)
    invalid_transactions = check_invalid_transactions(target_transactions)
    
    print(f"Found {len(negative_balances)} negative balance(s)")
    if negative_balances:
        print("Accounts with negative balances:")
        for acc in negative_balances:
            print(f"  Account ID: {acc['id']}, Balance: {acc['balance']}")
    
    print(f"\nFound {len(invalid_transactions)} invalid transaction(s)")
    if invalid_transactions:
        print("Invalid transactions:")
        for tx in invalid_transactions:
            print(f"  Transaction ID: {tx['id']}, Amount: {tx['amount']}")

    # Collect all validation results
    validation_results = {
        "Duplicate Records": {
            "duplicate_accounts": [
                f"Account ID: {acc['id']}, Balance: {acc['balance']}"
                for acc in duplicates
            ]
        },
        "Data Type Issues": {
            "type_mismatches": [
                f"Record ID: {record['id']}, Field: {field}, Expected: {schema[field].__name__}, Found: {found_type.__name__}"
                for record, field, found_type in type_mismatches
            ]
        },
        "Record Count": {
            "matches": counts_match,
            "source_count": len(source_accounts),
            "target_count": len(target_accounts)
        },
        "Value Mismatches": {            "mismatches": [
                str(mismatch) for mismatch in value_mismatches
            ]
        },
        "Null Values": {
            "null_fields": [
                f"Transaction ID: {record['id']}, Null field: {field}"
                for record, field in nulls
            ]
        },
        "Referential Integrity": {
            "invalid_references": [
                f"Transaction ID: {tx['id']}, Invalid Account ID: {tx['account_id']}"
                for tx in invalid_refs
            ]
        },
        "Business Logic Violations": {
            "negative_balances": [
                f"Account ID: {acc['id']}, Balance: {acc['balance']}"
                for acc in negative_balances
            ],
            "invalid_transactions": [
                f"Transaction ID: {tx['id']}, Amount: {tx['amount']}"
                for tx in invalid_transactions
            ]
        }
    }
    
    # Save reports
    md_path, txt_path = save_validation_report(validation_results)
    print(f"\nValidation reports have been saved:")
    print(f"- Markdown report: {md_path}")
    print(f"- Text report: {txt_path}")

if __name__ == "__main__":
    run_migration_validations()
