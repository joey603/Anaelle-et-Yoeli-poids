#!/bin/bash
# Configure les secrets GitHub Actions pour le ping Supabase.
# Prérequis : gh auth login

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"

if ! command -v gh >/dev/null 2>&1; then
  echo "Installez GitHub CLI : brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Connectez-vous d'abord : gh auth login"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Fichier .env introuvable."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${VITE_SUPABASE_URL:-}" || -z "${VITE_SUPABASE_ANON_KEY:-}" ]]; then
  echo "VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requis dans .env"
  exit 1
fi

gh secret set SUPABASE_URL --body "$VITE_SUPABASE_URL" --repo joey603/Anaelle-et-Yoeli-poids
gh secret set SUPABASE_ANON_KEY --body "$VITE_SUPABASE_ANON_KEY" --repo joey603/Anaelle-et-Yoeli-poids

echo "Secrets GitHub configurés avec succès."
