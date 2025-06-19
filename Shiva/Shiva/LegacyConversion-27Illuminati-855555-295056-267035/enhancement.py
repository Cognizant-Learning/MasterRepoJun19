# enhancement.py
# Migration validation utility functions for COBOL-to-.NET Blazor Server banking migration

from typing import List, Dict, Any, Set, Tuple
from datetime import datetime

def check_duplicates(records: List[Dict], key: str) -> List[Dict]:
    seen = set()
    duplicates = []
    for record in records:
        k = record[key]
        if k in seen:
            duplicates.append(record)
        else:
            seen.add(k)
    return duplicates

def check_data_types(records: List[Dict], schema: Dict[str, type]) -> List[Tuple[Dict, str, type]]:
    mismatches = []
    for record in records:
        for field, expected_type in schema.items():
            if not isinstance(record[field], expected_type):
                mismatches.append((record, field, type(record[field])))
    return mismatches

def compare_record_counts(source_records: List[Dict], target_records: List[Dict]) -> bool:
    return len(source_records) == len(target_records)

def check_value_mismatches(source_records: List[Dict], target_records: List[Dict], key: str, fields: List[str]) -> List[Tuple[Any, str, Any, Any]]:
    mismatches = []
    target_dict = {r[key]: r for r in target_records}
    for src in source_records:
        tgt = target_dict.get(src[key])
        if not tgt:
            mismatches.append((src, 'Missing in target'))
            continue
        for field in fields:
            if src[field] != tgt[field]:
                mismatches.append((src[key], field, src[field], tgt[field]))
    return mismatches

def check_nulls(records: List[Dict], required_fields: List[str]) -> List[Tuple[Dict, str]]:
    nulls = []
    for record in records:
        for field in required_fields:
            if record.get(field) is None:
                nulls.append((record, field))
    return nulls

def check_referential_integrity(transactions: List[Dict], accounts: List[Dict], account_key: str = 'account_id') -> List[Dict]:
    account_ids = {a['id'] for a in accounts}
    invalid = [t for t in transactions if t[account_key] not in account_ids]
    return invalid

def check_negative_balances(accounts: List[Dict]) -> List[Dict]:
    negative_accounts = []
    for account in accounts:
        try:
            if float(account['balance']) < 0:
                negative_accounts.append(account)
        except (ValueError, TypeError):
            # If balance can't be converted to float, consider it an error
            negative_accounts.append(account)
    return negative_accounts

def check_invalid_transactions(transactions: List[Dict]) -> List[Dict]:
    invalid_txns = []
    for txn in transactions:
        try:
            if float(txn['amount']) <= 0:
                invalid_txns.append(txn)
        except (ValueError, TypeError):
            # If amount can't be converted to float, consider it invalid
            invalid_txns.append(txn)
    return invalid_txns

def generate_validation_report(validation_results: Dict[str, Any], format: str = 'md') -> str:
    """Generate a validation report in either markdown or text format."""
    
    report = []
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if format == 'md':
        report.append("# Migration Validation Report")
        report.append(f"\nGenerated on: {timestamp}\n")
        
        for check, results in validation_results.items():
            report.append(f"## {check}")
            if isinstance(results, dict):
                for key, value in results.items():
                    if isinstance(value, list):
                        report.append(f"\n### {key}")
                        for item in value:
                            report.append(f"- {item}")
                    else:
                        report.append(f"\n- {key}: {value}")
            elif isinstance(results, list):
                for item in results:
                    report.append(f"- {item}")
            else:
                report.append(f"- {results}")
            report.append("")  # Empty line between sections
    else:
        report.append("=== Migration Validation Report ===")
        report.append(f"Generated on: {timestamp}\n")
        
        for check, results in validation_results.items():
            report.append(f"=== {check} ===")
            if isinstance(results, dict):
                for key, value in results.items():
                    if isinstance(value, list):
                        report.append(f"\n{key}:")
                        for item in value:
                            report.append(f"* {item}")
                    else:
                        report.append(f"* {key}: {value}")
            elif isinstance(results, list):
                for item in results:
                    report.append(f"* {item}")
            else:
                report.append(f"* {results}")
            report.append("")  # Empty line between sections
    
    return "\n".join(report)

def save_validation_report(validation_results: Dict[str, Any], output_dir: str = ".") -> tuple[str, str]:
    """Save validation report in both markdown and text formats."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    md_path = f"{output_dir}/validation_report_{timestamp}.md"
    txt_path = f"{output_dir}/validation_report_{timestamp}.txt"
    
    md_content = generate_validation_report(validation_results, 'md')
    txt_content = generate_validation_report(validation_results, 'txt')
    
    with open(md_path, 'w') as f:
        f.write(md_content)
    with open(txt_path, 'w') as f:
        f.write(txt_content)
    
    return md_path, txt_path
