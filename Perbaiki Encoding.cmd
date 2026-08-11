@echo off
chcp 65001 >nul
title Perbaiki Encoding (Mojibake Repair)
echo Perbaiki Encoding - Mojibake Repair
echo ====================================
node "%~dp0perbaiki-encoding.js"
echo.
pause
