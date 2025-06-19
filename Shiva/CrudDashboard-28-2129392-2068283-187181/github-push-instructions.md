# GitHub Push Instructions

Follow these steps to manually push your code to GitHub using Git commands:

## Prerequisites
- Make sure Git is installed (run `git --version` to verify)
- You need a GitHub account
- You need a Personal Access Token (PAT) from GitHub

## Step 1: Set up Git Identity
Open a Command Prompt (not PowerShell) and run:
```
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

## Step 2: Navigate to Project Directory
```
cd C:\Users\Administrator\Documents\VibeCoding_Hackathon_Code\VibeCoding-CRUD-Dashboard\store
```

## Step 3: Initialize Git Repository (if not already done)
```
git init
```

## Step 4: Add All Files to Git
```
git add .
```

## Step 5: Commit Changes
```
git commit -m "Intelligent Inventory Hub: Complete application"
```

## Step 6: Create a Branch (if not already done)
```
git checkout -b intelligent-inventory-hub
```

## Step 7: Add Remote Repository
```
git remote add origin https://github.com/Cognizant-Learning/MasterRepoJun19.git
```

## Step 8: Push to GitHub
Method 1 (Using Personal Access Token in URL):
```
git remote set-url origin https://YOUR_USERNAME:YOUR_PERSONAL_ACCESS_TOKEN@github.com/Cognizant-Learning/MasterRepoJun19.git
git push -u origin intelligent-inventory-hub
```

Method 2 (GitHub will prompt for credentials):
```
git push -u origin intelligent-inventory-hub
```
When prompted, use your GitHub username and Personal Access Token as the password.

## Getting a Personal Access Token (PAT)
1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" or "Generate new token (classic)"
3. Select "repo" permissions
4. Generate the token and copy it (you'll only see it once!)
5. Use this token as your password when pushing

## Troubleshooting
- If you get errors about existing remote, try:
  ```
  git remote remove origin
  ```
  Then add the remote again.

- If you get authentication errors, double check your username and PAT

- If using HTTPS is problematic, consider using SSH instead (requires setting up SSH keys)
