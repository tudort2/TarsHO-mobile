param(
    [string]$Branch = "",
    [ValidateSet("update","build")][string]$Mode = "update",
    [ValidateSet("android","ios")][string]$Platform = "android",
    [string]$Profile = "preview"
)
$ErrorActionPreference = "Continue"

$channels = @{
    "1"="mv1"; "2"="mv2"; "3"="mv3"; "4"="mv4"; "5"="mv5";
    "6"="mv6"; "7"="mv7"; "8"="mv8"; "9"="mv9"; "10"="mv10"
}

if (-not $Branch) {
    $variant = Read-Host "Variant (1-10 = mv1..mv10, Enter = main)"
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
Write-Host "  TARS Mobile -- $Branch  (mode: $Mode)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# -- Step 1: checkout branch --
Write-Host "[1/3] Checking out '$Branch'..." -ForegroundColor Yellow
Set-Location $target
if (Test-Path ".git\index.lock") { Remove-Item ".git\index.lock" -Force }
if (Test-Path ".git\HEAD.lock")  { Remove-Item ".git\HEAD.lock"  -Force }
git fetch origin
git checkout -- .
git clean -fd | Out-Null
git checkout $Branch
git reset --hard "origin/$Branch"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: cannot switch to $Branch" -ForegroundColor Red; Read-Host "Enter to exit"; exit 1 }
Write-Host "OK -- on $Branch" -ForegroundColor Green
Write-Host ""

# -- Step 2: install deps --
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm install failed" -ForegroundColor Red; Read-Host "Enter to exit"; exit 1 }
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# -- Step 3: build a native binary OR push an OTA JS update --
if ($Mode -eq "build") {
    Write-Host "[3/3] Native BUILD for '$channel' ($Platform / $Profile)..." -ForegroundColor Yellow
    Write-Host "  Unique bundle ID per branch -> installs alongside the other TARS apps." -ForegroundColor DarkGray
    Write-Host "  (first iOS build may prompt for Apple credentials)" -ForegroundColor DarkGray
    Write-Host ""
    npx eas build --profile $Profile --platform $Platform
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  BUILD QUEUED -- $channel ($Platform)" -ForegroundColor Green
    Write-Host "  Install the finished build from the EAS URL/QR shown above." -ForegroundColor White
    Write-Host "============================================" -ForegroundColor Green
} else {
    Write-Host "[3/3] OTA update to channel '$channel'..." -ForegroundColor Yellow
    Write-Host "  (the '$channel' app must already be installed via -Mode build)" -ForegroundColor DarkGray
    Write-Host ""
    npx eas update --channel $channel --message "deploy $channel"
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  OTA DONE -- $channel" -ForegroundColor Green
    Write-Host "  Expo Go URL: $expoUrl" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    npx -y --package=qrcode-terminal node -e "require('qrcode-terminal').generate('$expoUrl',{small:true},function(s){process.stdout.write(s)})"
}
Write-Host ""
Read-Host "Press Enter to close"
