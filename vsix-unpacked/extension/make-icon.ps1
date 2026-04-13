Add-Type -AssemblyName System.Drawing
$bitmap = New-Object System.Drawing.Bitmap 128, 128
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$background = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle 0,0,128,128), [System.Drawing.Color]::FromArgb(131,58,180), [System.Drawing.Color]::FromArgb(252,176,69), 45)
$graphics.FillRectangle($background, 0, 0, 128, 128)

$phoneBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20,24,39))
$graphics.FillRectangle($phoneBrush, 34, 18, 60, 92)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.FillEllipse($whiteBrush, 60, 34, 8, 8)

$points = [System.Drawing.Point[]]@(
  (New-Object System.Drawing.Point 54,52),
  (New-Object System.Drawing.Point 82,68),
  (New-Object System.Drawing.Point 54,84)
)
$graphics.FillPolygon($whiteBrush, $points)

$barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210,255,255,255))
$graphics.FillRectangle($barBrush, 44, 94, 40, 6)

$bitmap.Save("media/icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
