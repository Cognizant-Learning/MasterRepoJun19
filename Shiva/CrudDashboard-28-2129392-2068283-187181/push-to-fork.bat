@echo off
echo Pushing to your own fork of the repository...

echo This script will help you fork and push your code to GitHub.
echo You will need your GitHub username and a personal access token.

echo Setting up Git repository...
git add .
git commit -m "Intelligent Inventory Hub: Complete application" --allow-empty

echo.
echo Please enter your GitHub username:
set /p username=

echo.
echo Please enter your Personal Access Token:
set /p token=

echo.
echo Pushing code to your GitHub fork...

git remote set-url origin https://%username%:%token%@github.com/%username%/MasterRepoJun19.git
git push -u origin intelligent-inventory-hub

echo.
if %errorlevel% equ 0 (
  echo Code successfully pushed to your fork!
  echo.
  echo Next steps:
  echo 1. Go to https://github.com/%username%/MasterRepoJun19
  echo 2. Click on "Contribute" and then "Open pull request"
  echo 3. Follow the prompts to create a pull request to the original repository
) else (
  echo Failed to push code. Please check your credentials and try again.
  echo.
  echo Alternative: 
  echo 1. First go to https://github.com/Cognizant-Learning/MasterRepoJun19
  echo 2. Click "Fork" to create your own fork
  echo 3. Then run this script again
)

pause
