param([string]$Branch = "")
$ErrorActionPreference = "Continue"

$channels = @{
    "1"="ui-v1"; "2"="ui-v2"; "3"="ui-v3"; "4"="ui-v4"; "5"="ui-v5";
    "6"="ui-v6"; "7"="ui-v7"; "8"="ui-v8"; "9"="ui-v9"; "10"="ui-v10"
}

# Allow branch passed as parameter OR entered interactively
if (-not $Branch) {
    $variant = Read-Host "Variant (1-10 = ui-v1..v10, Enter = main)"
    $Branch  = if ($channels.ContainsKey($variant)) { $channels[$variant] } else { "main" }
} elseif ($channels.ContainsKey($Branch)) {
    # Allow passing "1".."10" as shorthand
    $Branch = $channels[$Branch]
}

$channel   = $Branch
$target    = "C:\Users\tudor\OneDrive\Documents\GitHub\TarsHO-mobile"
$projectId = "c7136656-ad3a-4921-9f8d-9c8580d87360"
$expoUrl   = "exp://u.expo.dev/$projectId`?channel-name=$channel"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  TARS Mobile -- branch: $Branch" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Checkout branch from GitHub
Write-Host "[1/3] Fetching branch '$Branch' from GitHub..." -ForegroundColor Yellow
Set-Location $target

# Remove any stale lock files that block git on NTFS
if (Test-Path ".git\index.lock")  { Remove-Item ".git\index.lock"  -Force }
if (Test-Path ".git\HEAD.lock")   { Remove-Item ".git\HEAD.lock"   -Force }

git fetch origin
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git fetch failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}

git checkout $Branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git checkout $Branch failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}

git pull origin $Branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git pull failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}

Write-Host "OK -- on branch $Branch" -ForegroundColor Green
Write-Host ""

# Step 2: npm install
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: npm install failed (exit $LASTEXITCODE)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Step 3: Publish OTA update
Write-Host "[3/3] Publishing to EAS channel '$channel'..." -Foregro