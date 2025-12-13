$file = "app\admin\dashboard.css"
$content = Get-Content $file
$newContent = $content | Where-Object { $_.Trim() -ne '/' }
$newContent | Set-Content $file

