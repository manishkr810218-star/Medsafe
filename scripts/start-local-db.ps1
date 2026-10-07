# Starts the portable MySQL installation prepared for this workspace.
# On another machine, set MEDSAFE_MYSQL_SERVER and MEDSAFE_MYSQL_CONFIG first.
$ErrorActionPreference = 'Stop'

function Test-MySqlPort {
    try {
        $client = [System.Net.Sockets.TcpClient]::new()
        $client.Connect('127.0.0.1', 3306)
        $client.Close()
        return $true
    }
    catch {
        return $false
    }
}

if (Test-MySqlPort) {
    Write-Output 'MySQL is already listening on 127.0.0.1:3306.'
    exit 0
}

$repo = Split-Path -Parent $PSScriptRoot
$workspace = Split-Path -Parent (Split-Path -Parent $repo)
$server = if ($env:MEDSAFE_MYSQL_SERVER) { $env:MEDSAFE_MYSQL_SERVER } else {
    Join-Path $workspace 'work\mysql-runtime\mysql-8.4.11-winx64\bin\mysqld.exe'
}
$config = if ($env:MEDSAFE_MYSQL_CONFIG) { $env:MEDSAFE_MYSQL_CONFIG } else {
    Join-Path $workspace 'work\mysql-my.ini'
}

if (-not (Test-Path -LiteralPath $server) -or -not (Test-Path -LiteralPath $config)) {
    throw 'Portable MySQL was not found. Install MySQL locally, or set MEDSAFE_MYSQL_SERVER and MEDSAFE_MYSQL_CONFIG to your server executable and config file.'
}

$process = Start-Process -FilePath $server -ArgumentList "--defaults-file=$config" `
    -WorkingDirectory (Split-Path -Parent $server) -WindowStyle Hidden -PassThru `
    -RedirectStandardOutput (Join-Path $env:TEMP 'medsafe-mysql.out') `
    -RedirectStandardError (Join-Path $env:TEMP 'medsafe-mysql.err')

for ($attempt = 0; $attempt -lt 30; $attempt++) {
    if (Test-MySqlPort) {
        Write-Output "MySQL is listening on 127.0.0.1:3306 (PID $($process.Id))."
        exit 0
    }
    if ($process.HasExited) { break }
    Start-Sleep -Milliseconds 500
}

throw 'MySQL did not start. Check the local MySQL error log.'
