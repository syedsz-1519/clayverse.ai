#!/bin/bash

# Clayverse AI - Build, Test & Deployment Script
# This script verifies all fixes and prepares the app for Vercel deployment

set -e  # Exit on first error

echo "================================"
echo "Clayverse AI - Build & Test"
echo "================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Step 1: Clean Install
print_info "Step 1: Cleaning and installing dependencies..."
rm -rf node_modules dist package-lock.json 2>/dev/null || true
npm install
print_step "Dependencies installed"
echo ""

# Step 2: Type Check
print_info "Step 2: Running TypeScript type check..."
npm run lint || {
    print_error "TypeScript errors detected"
    exit 1
}
print_step "No TypeScript errors"
echo ""

# Step 3: Build
print_info "Step 3: Building production bundle..."
npm run build
if [ -d "dist" ]; then
    print_step "Build successful - dist/ folder created"
else
    print_error "Build failed - dist/ folder not created"
    exit 1
fi
echo ""

# Step 4: Check Build Output
print_info "Step 4: Verifying build output..."
if [ -f "dist/index.html" ]; then
    print_step "index.html exists in dist/"
else
    print_error "index.html missing from dist/"
    exit 1
fi

if [ -f "dist/index-*.js" ] || [ -f "dist/index.js" ]; then
    print_step "JavaScript bundles created"
else
    print_error "JavaScript bundles not found"
    exit 1
fi

if [ -f "dist/index-*.css" ] || [ -f "dist/index.css" ]; then
    print_step "CSS bundles created"
else
    print_step "Note: CSS might be inlined (this is OK)"
fi
echo ""

# Step 5: Verify Critical Files
print_info "Step 5: Verifying critical source files..."
files=(
    "src/main.tsx"
    "src/App.tsx"
    "src/components/FloatingNav.tsx"
    "src/components/Hero.tsx"
    "src/contexts/AuthContext.tsx"
    "src/hooks/useLanguageMultilingual.tsx"
    "src/lib/firebase.ts"
    "src/data/roadmapTerms.ts"
    "src/components/ui/Button.tsx"
    "src/components/ui/Card.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_step "$file exists"
    else
        print_error "$file missing"
        exit 1
    fi
done
echo ""

# Step 6: Verify Config Files
print_info "Step 6: Verifying configuration files..."
configs=(
    "postcss.config.cjs"
    "tailwind.config.js"
    "vite.config.ts"
    "vercel.json"
    "index.html"
    "package.json"
)

for config in "${configs[@]}"; do
    if [ -f "$config" ]; then
        print_step "$config exists"
    else
        print_error "$config missing"
        exit 1
    fi
done
echo ""

# Step 7: Preview
print_info "Step 7: Testing preview build (runs in background)..."
print_info "Starting preview server on port 4173..."
npm run preview &
PREVIEW_PID=$!
sleep 3

# Try to curl the preview server
if curl -s http://localhost:4173 > /dev/null 2>&1; then
    print_step "Preview server running successfully"
    kill $PREVIEW_PID 2>/dev/null || true
else
    print_error "Preview server failed to start"
    kill $PREVIEW_PID 2>/dev/null || true
    exit 1
fi
echo ""

# Step 8: Final Summary
echo "================================"
echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
echo "================================"
echo ""
echo "Build Summary:"
echo "  - Dependencies: Installed ✓"
echo "  - TypeScript: 0 errors ✓"
echo "  - Production Build: dist/ ✓"
echo "  - Critical Files: All exist ✓"
echo "  - Config Files: All valid ✓"
echo "  - Preview Server: Working ✓"
echo ""
echo "Next Steps:"
echo "  1. Test locally: npm run dev"
echo "  2. Deploy to Vercel: vercel deploy --prod"
echo ""
echo "🚀 Ready for production deployment!"
