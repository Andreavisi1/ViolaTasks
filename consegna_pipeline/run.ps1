# Avvio unico (Windows / PowerShell). Installa le dipendenze e lancia la pipeline.
#   .\run.ps1           -> tutto in fila (initial, update, query, verify)
#   .\run.ps1 --query   -> solo le query (qualsiasi argomento di run.py e' valido)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
python -m pip install -q -r requirements.txt
if ($args.Count -eq 0) {
    python run.py --all
} else {
    python run.py @args
}
