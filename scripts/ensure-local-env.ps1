<#
.SYNOPSIS
Creates the project-local Wrangler secret file when it does not exist.

.DESCRIPTION
Generates a cryptographically random administrator secret for local classroom operation and
writes UTF-8 without BOM. Existing files are preserved unless -Force is supplied.

.PARAMETER OutputPath
Target .dev.vars path. Defaults to the project root.

.PARAMETER Force
Replaces an existing file with a new secret.

.PARAMETER ShowSecret
Prints the local administrator secret so the teacher can enter it in the local interface.
#>
param(
    [string]$OutputPath = (Join-Path $PSScriptRoot '..\.dev.vars'),
    [switch]$Force,
    [switch]$ShowSecret
)

$ErrorActionPreference = 'Stop'
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)

if ((Test-Path -LiteralPath $resolvedOutput) -and -not $Force) {
    Write-Output "[OK] Arquivo local de segredos preservado: $resolvedOutput"
    if ($ShowSecret) {
        $existingLine = Get-Content -LiteralPath $resolvedOutput | Where-Object { $_ -like 'ADMIN_SECRET=*' } | Select-Object -First 1
        if ($existingLine) {
            Write-Output "[OK] Segredo administrativo local: $($existingLine.Substring('ADMIN_SECRET='.Length))"
        }
    }
    exit 0
}

$bytes = New-Object byte[] 32
$generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $generator.GetBytes($bytes)
}
finally {
    $generator.Dispose()
}

$secret = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$content = "ADMIN_SECRET=$secret`n"
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($resolvedOutput, $content, $utf8WithoutBom)

Write-Output "[OK] Segredo administrativo local criado em: $resolvedOutput"
if ($ShowSecret) {
    Write-Output "[OK] Segredo administrativo local: $secret"
}
