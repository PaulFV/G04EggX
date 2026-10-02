# Baut ein signiertes Release-AAB für den Play Store.
# Aufruf: powershell -ExecutionPolicy Bypass -File android\build-release.ps1
# Die Passwörter werden nur abgefragt und nirgends gespeichert.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_KEYSTORE_FILE = "$env:USERPROFILE\g04eggx-upload.jks"
$env:ANDROID_KEY_ALIAS = "g04eggx-upload"

if (-not (Test-Path $env:ANDROID_KEYSTORE_FILE)) { throw "Keystore nicht gefunden: $env:ANDROID_KEYSTORE_FILE" }

function Read-Secret($prompt) {
    $secure = Read-Host $prompt -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

$storePassword = Read-Secret "Keystore-Passwort"
$keyPassword = Read-Secret "Key-Passwort (Enter = gleiches wie Keystore)"
if (-not $keyPassword) { $keyPassword = $storePassword }
$env:ANDROID_KEYSTORE_PASSWORD = $storePassword
$env:ANDROID_KEY_PASSWORD = $keyPassword

try {
    & .\gradlew.bat clean bundleRelease --console=plain
    if ($LASTEXITCODE -ne 0) { throw "Gradle-Build fehlgeschlagen." }
} finally {
    Remove-Item Env:ANDROID_KEYSTORE_PASSWORD, Env:ANDROID_KEY_PASSWORD -ErrorAction SilentlyContinue
}

$aab = Join-Path $PSScriptRoot "app\build\outputs\bundle\release\app-release.aab"
$target = Join-Path $PSScriptRoot "app\release\app-release-1.1.1.aab"
New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
Copy-Item $aab $target -Force

Write-Host ""
Write-Host "Signatur-Zertifikat:" -ForegroundColor Cyan
& "$env:JAVA_HOME\bin\keytool.exe" -printcert -jarfile $target | Select-String "Owner|SHA256"
Write-Host ""
Write-Host "Fertig: $target" -ForegroundColor Green
