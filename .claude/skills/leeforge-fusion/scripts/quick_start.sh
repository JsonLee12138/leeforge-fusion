#!/bin/bash
# Quick start script for Leeforge Fusion projects
# Usage: ./quick_start.sh [project-name] [template]

set -e

PROJECT_NAME="${1:-my-app}"
TEMPLATE="${2:-basic}"

echo "🚀 Creating Leeforge Fusion project: $PROJECT_NAME with template: $TEMPLATE"

# Initialize project
leeforge-fusion init "$PROJECT_NAME" --template "$TEMPLATE" --git --install --pm pnpm

echo ""
echo "✅ Project created successfully!"
echo ""
echo "Next steps:"
echo "  cd $PROJECT_NAME"
echo "  pnpm dev          # Start development server"
echo "  pnpm build        # Build for production"
echo "  pnpm test         # Run tests"
echo ""
echo "📖 Documentation: https://github.com/JsonLee12138/leeforge-fusion"
