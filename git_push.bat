@echo off
cd /d "%~dp0"

echo ==============================================
echo Subsidy SaaS Matcher - GitHub Sync Tool
echo ==============================================
echo.

echo [1/3] Staging modified files...
git add .

echo [2/3] Committing changes...
git commit -m "Premium UI Redesign, fixed 404 links, and added mock subsidies"

echo [3/3] Uploading to GitHub...
git push

echo.
echo ==============================================
echo Upload Completed Successfully!
echo GitHub Actions will deploy the changes in a few minutes.
echo Please check your live site shortly:
echo https://YY00SI.github.io/subsidy-saas-matcher/
echo ==============================================
pause
