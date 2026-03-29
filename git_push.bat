@echo off
cd /d "%~dp0"

echo ==============================================
echo Subsidy SaaS Matcher - GitHub Sync Tool (Final Setup)
echo ==============================================
echo.

echo [1/3] Staging modified files...
git add .

echo [2/3] Committing changes (fixing GitHub automated build)...
git commit -m "Fix GitHub pages build error by updating workflow to npm install"

echo [3/3] Uploading to GitHub with Force Overwrite...
git push origin HEAD:main --force

echo.
echo ==============================================
echo Upload Completed Successfully!
echo The build error should now be fixed. GitHub Actions will deploy shortly.
echo Please check your live site:
echo https://YY00SI.github.io/subsidy-saas-matcher/
echo ==============================================
pause
