# 管理者権限があるかどうかを確認
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    # 管理者権限がない場合、新しい管理者シェルを開く
    if (Get-Command pwsh.exe -ErrorAction SilentlyContinue) {
        Start-Process pwsh.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    } else {
        Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    }
    exit
}

# 以下に、管理者権限が必要なコードを書く
$serviceNames = @("mosque", "nginx")
foreach ($serviceName in $serviceNames) {
    $service = Get-Service -Name $serviceName
    if ($service.Status -ne 'Running') {
        Start-Service -Name $serviceName
    }
}

