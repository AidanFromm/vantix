$f = 'src/components/landing/FuturisticLanding.tsx'
$c = Get-Content $f -Raw
$c = $c -replace '#3E1A0E','#6B4332'
$c = $c -replace '#2D1209','#5A3628'
$c = $c -replace '#F0DFD1','#F5EDE4'
$c = $c -replace '#5C3520','#8B5E3C'
$c = $c -replace '#E0CCBA','#E8D8CA'
$c = $c -replace '#E8D5C4','#EDE3D8'
$c = $c -replace '#4A2112','#2C1810'
Set-Content $f $c -NoNewline
Write-Host "Done"
