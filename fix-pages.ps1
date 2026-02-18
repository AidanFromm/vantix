$files = @(
  'src/app/services/page.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/case-studies/page.tsx',
  'src/app/case-studies/secured-tampa/page.tsx'
)

foreach ($f in $files) {
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    # Replace /contact hrefs that are for booking CTAs (nav buttons, CTA buttons)
    # But keep actual contact page link in nav if it's just "Contact"
    $c = $c -replace 'href="/contact"(\s+className="[^"]*(?:rounded-full|woodButton)[^"]*")', 'href="/#booking"$1'
    # Also replace any remaining /contact hrefs near Book/Audit/Schedule text
    $c = $c -replace 'href="/contact"(\s+className="group inline-flex)', 'href="/#booking"$1'
    # Replace cal.com link
    $c = $c -replace 'href="https://cal.com/vantix/ai-consultation"', 'href="/#booking"'
    # Fix #4A2112 -> #2C1810
    $c = $c -replace '#4A2112', '#2C1810'
    Set-Content $f $c -NoNewline
    Write-Host "Fixed $f"
  }
}

# Fix ChatWidget
$cw = 'src/components/ChatWidget.tsx'
if (Test-Path $cw) {
  $c = Get-Content $cw -Raw
  $c = $c -replace '#4A2112', '#6B4332'
  Set-Content $cw $c -NoNewline
  Write-Host "Fixed ChatWidget"
}

Write-Host "Done"
