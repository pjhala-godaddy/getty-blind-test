#!/bin/bash

# This or That Setup Script
echo "🚀 Setting up This or That A/B Testing Tool..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    exit 1
fi

echo "✅ PostgreSQL found"

# Create .env files if they don't exist
echo ""
echo "📝 Creating environment files..."

if [ ! -f backend/.env ]; then
    cat > backend/.env << EOF
PORT=3001
DATABASE_URL=postgresql://localhost:5432/thisorthat
NODE_ENV=development
EOF
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists, skipping"
fi

if [ ! -f frontend/.env ]; then
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ Created frontend/.env"
else
    echo "⚠️  frontend/.env already exists, skipping"
fi

# Create database
echo ""
echo "📦 Setting up database..."
createdb thisorthat 2>/dev/null && echo "✅ Database 'thisorthat' created" || echo "⚠️  Database might already exist"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Setup database schema
echo ""
echo "🗄️  Setting up database schema..."
npm run db:setup
if [ $? -eq 0 ]; then
    echo "✅ Database schema created"
else
    echo "❌ Failed to setup database schema"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Start backend:  cd backend && npm run dev"
echo "  2. Start frontend: cd frontend && npm run dev"
echo "  3. Open http://localhost:3000"
echo ""
echo "See QUICKSTART.md for more details."

