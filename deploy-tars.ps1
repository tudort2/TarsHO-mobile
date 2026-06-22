param([string]$Branch = "")
$ErrorActionPreference = "Continue"

$channels = @{
    "1"="ui-v1"; "2"="ui-v2"; "3"="ui-v3"; "4"="ui-v4"; "5"="ui-v5";
    "6"="ui-v6"; "7"="ui-v7"; "8"="ui-v8"; "9"="ui-v9"; "10"="ui-v10"
}

if (-not $Branch) {
    $variant = Read-Host "Variant (1-10 = ui-v1..v10, Enter = main)"
    $Branch  = if ($channels.ContainsKey($variant)) { $channels[$variant] } else { "main" }
} elseif ($channels.ContainsKey($Branch)) {
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

# ── Step 1: checkout branch ──────────────────────────────────────────────────
Write-Host "[1/3] Fetching branch '$Branch' from GitHub..." -ForegroundColor Yellow
Set-Location $target

# Remove stale git locks
if (Test-Path ".git\index.lock") { Remove-Item ".git\index.lock" -Force }
if (Test-Path ".git\HEAD.lock")  { Remove-Item ".git\HEAD.lock"  -Force }

git fetch origin

# Discard ALL local changes (tracked + untracked) so checkout never conflicts
git checkout -- .
git clean -fd | Out-Null

git checkout $Branch
git reset --hard "origin/$Branch"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: could not switch to branch $Branch" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}

Write-Host "OK -- on branch $Branch" -ForegroundColor Green
Write-Host ""

# ── Step 2: npm install ──────────────────────────────────────────────────────
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"; exit 1
}
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# ── Step 3: publish OTA ──────────────────────────────────────────────────────
Write-Host "[3/3] Publishing to EAS channel '$channel'..." -ForegroundColor Yellow
Write-Host ""
npx eas update --channel $channel --message "deploy $channel"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  DONE -- $channel" -ForegroundColor Green
Write-Host ""
Write-Host "  Expo Go URL:" -ForegroundColor White
Write-Host "  $expoUrl" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Scan with Expo Go:" -ForegroundColor White
Write-Host ""
npx -y --package=qrcode-terminal node -e "require('qrcode-terminal').generate('$expoUrl',{small:true},function(s){process.stdout.write(s)})"
Write-Host ""
Read-Host "Press Enter to close"
