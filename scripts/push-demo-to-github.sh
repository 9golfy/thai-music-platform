#!/bin/bash

echo "🚀 Pushing demo folder to GitHub..."

# Navigate to demo folder
cd public/demo

# Check if git is already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    
    echo "🔗 Adding remote repository..."
    git remote add origin git@github.com:9golfy/demo-hero.git
else
    echo "✅ Git repository already initialized"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
EOF
fi

# Add all files
echo "📁 Adding files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Add hero section demo - 2 versions (image & video)"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Demo pushed to GitHub successfully!"
echo "🌐 Repository: https://github.com/9golfy/demo-hero"
echo ""
echo "📌 Next steps:"
echo "   1. Go to GitHub repository settings"
echo "   2. Enable GitHub Pages (Settings > Pages)"
echo "   3. Select 'main' branch as source"
echo "   4. Your demo will be live at: https://9golfy.github.io/demo-hero/"
