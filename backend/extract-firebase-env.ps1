# Script pour extraire les credentials Firebase en variables d'environnement
# Usage : powershell -ExecutionPolicy Bypass -File extract-firebase-env.ps1

$ErrorActionPreference = "Stop"

# Vérifier que le fichier existe
$jsonPath = "serviceAccountKey.json"
if (-Not (Test-Path $jsonPath)) {
    Write-Host "❌ Erreur : serviceAccountKey.json introuvable" -ForegroundColor Red
    Write-Host "   Placez le fichier à la racine du dossier backend/" -ForegroundColor Yellow
    exit 1
}

# Lire et parser le JSON
try {
    $json = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
} catch {
    Write-Host "❌ Erreur : Impossible de lire le fichier JSON" -ForegroundColor Red
    Write-Host "   Détails : $_" -ForegroundColor Yellow
    exit 1
}

# Afficher le header
Write-Host ""
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  CREDENTIALS FIREBASE POUR RAILWAY" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host ""

# Afficher les variables
Write-Host "Copiez ces 3 variables dans Railway > Votre Projet > Variables :" -ForegroundColor White
Write-Host ""

Write-Host "+-- Variable 1 --------------------------------------------------" -ForegroundColor Gray
Write-Host "| Name:  " -NoNewline -ForegroundColor Yellow
Write-Host "FIREBASE_PROJECT_ID" -ForegroundColor White
Write-Host "| Value: " -NoNewline -ForegroundColor Yellow
Write-Host $json.project_id -ForegroundColor Green
Write-Host "+----------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "+-- Variable 2 --------------------------------------------------" -ForegroundColor Gray
Write-Host "| Name:  " -NoNewline -ForegroundColor Yellow
Write-Host "FIREBASE_CLIENT_EMAIL" -ForegroundColor White
Write-Host "| Value: " -NoNewline -ForegroundColor Yellow
Write-Host $json.client_email -ForegroundColor Green
Write-Host "+----------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "+-- Variable 3 --------------------------------------------------" -ForegroundColor Gray
Write-Host "| Name:  " -NoNewline -ForegroundColor Yellow
Write-Host "FIREBASE_PRIVATE_KEY" -ForegroundColor White
Write-Host "| Value: " -NoNewline -ForegroundColor Yellow
Write-Host "(voir ci-dessous)" -ForegroundColor Magenta
Write-Host "|" -ForegroundColor Gray
Write-Host "| ATTENTION : Copiez TOUTE la cle privee en UNE SEULE ligne" -ForegroundColor Red
Write-Host "|     (avec les \n conserves comme caracteres litteraux)" -ForegroundColor Red
Write-Host "|" -ForegroundColor Gray
Write-Host "+----------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host $json.private_key -ForegroundColor Green
Write-Host ""

Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Variables extraites avec succes !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes :" -ForegroundColor Cyan
Write-Host "   1. Aller sur Railway > Votre projet > Onglet 'Variables'" -ForegroundColor White
Write-Host "   2. Cliquer 'New Variable' pour chaque variable" -ForegroundColor White
Write-Host "   3. Copier-coller Name et Value exactement" -ForegroundColor White
Write-Host "   4. Railway redeploie automatiquement" -ForegroundColor White
Write-Host ""
Write-Host "Plus d'infos : Voir FIREBASE_RAILWAY.md" -ForegroundColor Yellow
Write-Host ""
