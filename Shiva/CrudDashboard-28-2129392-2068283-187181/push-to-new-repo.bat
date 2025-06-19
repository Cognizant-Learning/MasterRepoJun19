@echo off
echo Creating new repository and pushing code...

echo This script will help you push your code to a new GitHub repository.
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
echo Please enter a name for your new repository (e.g., intelligent-inventory-hub):
set /p repo=

echo.
echo Pushing code to your new GitHub repository...

git remote set-url origin https://%username%:%token%@github.com/%username%/%repo%.git
git push -u origin intelligent-inventory-hub

echo.
if %errorlevel% equ 0 (
  echo Code successfully pushed to your new repository!
  echo.
  echo Your repository is available at:
  echo https://github.com/%username%/%repo%
) else (
  echo Failed to push code. Please check your credentials and try again.
  echo.
  echo Alternative: 
  echo 1. First create a new repository at https://github.com/new
  echo 2. Then run this script again with the new repository name
)

pause
