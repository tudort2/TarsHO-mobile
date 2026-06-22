@echo off
powershell -ExecutionPolicy Bypass -File "%~dp0deploy-tars.ps1" -Branch "%~1"
