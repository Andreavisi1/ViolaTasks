# Avvio unico (Windows / PowerShell). Installa le dipendenze e lancia la pipeline.
#   .\run.ps1           -> tutto in fila (initial, update, query, verify)
#   .\run.ps1 --query   -> solo le query (qualsiasi argomento di run.py e' valido)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "[1/2] Installazione dipendenze (pip install -r requirements.txt)..."
python -m pip install -q -r requirements.txt
Write-Host "      dipendenze pronte.`n"

Write-Host "[2/2] Avvio pipeline..."
if ($args.Count -eq 0) {
    python run.py --all
    Write-Host "`nApro la dashboard Viola Analytics nel browser (Ctrl+C per chiudere)..."
    python -m streamlit run app.py
} else {
    python run.py @args
}
