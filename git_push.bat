@echo off
@chcp 65001 > lul
setlocal
cd /d "%~dp0"

echo ==============================================
echo Subsidy SaaS Matcher - GitHub Sync Tool
echo ==============================================
echo.

rem 引数があればそれをメッセージに、なければ入力を促す
set "commit_msg=%~1"

if "%commit_msg%"=="" (
    set /p "commit_msg=Enter commit message (or press Enter for 'Auto-update'): "
)

rem 入力が空なら現在日時を入れる
if "%commit_msg%"=="" (
    set "commit_msg=Auto-update: %date% %time%"
)

echo.
echo [1/3] Staging modified files...
git add .

echo.
echo [2/3] Committing changes: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo [3/3] Uploading to GitHub with Force Overwrite...
git push origin HEAD:main --force

echo.
echo ==============================================
echo Upload Completed Successfully!
echo GitHub Actions will deploy shortly.
echo.
echo Please check your live site:
echo https://YY00SI.github.io/subsidy-saas-matcher/
echo ==============================================
pause
