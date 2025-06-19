# Connection Test Script for Journal Magic
# This script tests connectivity to both the API and Angular servers

Write-Host "===== Journal Magic Connection Test =====" -ForegroundColor Cyan
Write-Host "Testing connectivity to required services..." -ForegroundColor Cyan
Write-Host

function Test-Connection {
    param (
        [string]$ServiceName,
        [string]$Url,
        [switch]$SkipCertCheck
    )
    
    Write-Host "Testing connection to $ServiceName ($Url)..." -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Url
            Method = 'GET'
            TimeoutSec = 10
            ErrorAction = 'Stop'
        }
        
        if ($SkipCertCheck -and $PSVersionTable.PSVersion.Major -ge 6) {
            $params.Add('SkipCertificateCheck', $true)
        }
        
        $response = Invoke-WebRequest @params
        
        Write-Host "✅ Successfully connected to $ServiceName!" -ForegroundColor Green
        Write-Host "   Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to connect to $ServiceName" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Message -like "*The underlying connection was closed*" -or 
            $_.Exception.Message -like "*The request was aborted*") {
            Write-Host "   This appears to be a security or certificate issue." -ForegroundColor Yellow
            Write-Host "   Try running: dotnet dev-certs https --trust" -ForegroundColor Yellow
        }
        elseif ($_.Exception.Message -like "*actively refused*") {
            Write-Host "   The service doesn't appear to be running." -ForegroundColor Yellow
        }
        elseif ($_.Exception.Message -like "*timeout*") {
            Write-Host "   Timeout error: Check firewall settings or service availability." -ForegroundColor Yellow
        }
        
        return $false
    }
}

# Check if the services are running before testing
$api5000Running = netstat -ano | Select-String ":5000" | Select-String "LISTENING"
$api5001Running = netstat -ano | Select-String ":5001" | Select-String "LISTENING"
$client4200Running = netstat -ano | Select-String ":4200" | Select-String "LISTENING"

if (-not $api5000Running -and -not $api5001Running) {
    Write-Host "⚠️ API doesn't appear to be running on ports 5000/5001." -ForegroundColor Yellow
    Write-Host "   Please start the API first using:" -ForegroundColor Yellow
    Write-Host "   cd '$PSScriptRoot\api' && dotnet run" -ForegroundColor DarkYellow
    Write-Host
}

if (-not $client4200Running) {
    Write-Host "⚠️ Angular client doesn't appear to be running on port 4200." -ForegroundColor Yellow
    Write-Host "   Please start the Angular client using:" -ForegroundColor Yellow
    Write-Host "   cd '$PSScriptRoot\client' && ng serve" -ForegroundColor DarkYellow
    Write-Host
}

# Test local loopback connectivity
Write-Host "Testing general local connectivity..." -ForegroundColor Yellow
if (Test-Connection -ServiceName "Local loopback (127.0.0.1)" -Url "http://127.0.0.1") {
    Write-Host "✅ Basic local connectivity is working." -ForegroundColor Green
} else {
    Write-Host "❌ Failed to connect to local loopback address." -ForegroundColor Red
    Write-Host "   This indicates a fundamental networking issue with your machine." -ForegroundColor Red
}
Write-Host

# Test API connectivity
Test-Connection -ServiceName "API (HTTP)" -Url "http://localhost:5000" -SkipCertCheck
Test-Connection -ServiceName "API (HTTPS)" -Url "https://localhost:5001" -SkipCertCheck
Write-Host

# Test Angular client connectivity
Test-Connection -ServiceName "Angular client" -Url "http://localhost:4200"
Write-Host

Write-Host "===== System Information =====" -ForegroundColor Cyan
Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor DarkGray
Write-Host "Operating System: $((Get-CimInstance -ClassName Win32_OperatingSystem).Caption)" -ForegroundColor DarkGray

Write-Host
Write-Host "===== Firewall Status =====" -ForegroundColor Cyan
$firewallProfiles = Get-NetFirewallProfile
foreach ($profile in $firewallProfiles) {
    $status = if ($profile.Enabled) { "Enabled" } else { "Disabled" }
    Write-Host "$($profile.Name) profile: $status" -ForegroundColor $(if ($profile.Enabled) { "Yellow" } else { "Green" })
}

Write-Host
Write-Host "===== Troubleshooting Recommendations =====" -ForegroundColor Cyan
Write-Host "1. If connection tests failed, try the following:" -ForegroundColor White
Write-Host "   - Ensure both services are running" -ForegroundColor White
Write-Host "   - Check your firewall settings" -ForegroundColor White
Write-Host "   - Run 'dotnet dev-certs https --trust'" -ForegroundColor White
Write-Host "   - Try accessing the URLs directly in your browser" -ForegroundColor White
Write-Host
Write-Host "2. If certificates are the issue:" -ForegroundColor White
Write-Host "   - Clean and regenerate certificates:" -ForegroundColor White
Write-Host "     dotnet dev-certs https --clean" -ForegroundColor DarkGray
Write-Host "     dotnet dev-certs https --trust" -ForegroundColor DarkGray
Write-Host
Write-Host "3. If firewall is blocking connections:" -ForegroundColor White
Write-Host "   - Temporarily disable firewall for testing:" -ForegroundColor White
Write-Host "     Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False" -ForegroundColor DarkGray
Write-Host "   - Don't forget to re-enable afterward:" -ForegroundColor White
Write-Host "     Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True" -ForegroundColor DarkGray
