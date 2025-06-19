@echo off
echo Pushing Intelligent Inventory Hub code to GitHub...

echo This script will help you push your code to GitHub.
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
echo Pushing code to GitHub...

git remote set-url origin https://%username%:%token%@github.com/Cognizant-Learning/MasterRepoJun19.git
git push -u origin intelligent-inventory-hub

echo.
if %errorlevel% equ 0 (
  echo Code successfully pushed to GitHub!
) else (
  echo Failed to push code. Please check your credentials and try again.
)

pause
