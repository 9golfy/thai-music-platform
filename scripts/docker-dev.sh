#!/bin/bash

# Docker Development Environment Manager

case "$1" in
    "start")
        echo "🚀 Starting development environment..."
        docker-compose -f docker-compose.local.yml up -d
        echo "✅ Development environment started!"
        echo "📱 App: http://localhost:3001"
        echo "🗄️  MongoDB: localhost:27018"
        echo "🌐 Mongo Express: http://localhost:8082"
        ;;
    "stop")
        echo "🛑 Stopping development environment..."
        docker-compose -f docker-compose.local.yml down
        echo "✅ Development environment stopped!"
        ;;
    "restart")
        echo "🔄 Restarting development environment..."
        docker-compose -f docker-compose.local.yml restart
        echo "✅ Development environment restarted!"
        ;;
    "logs")
        echo "📋 Showing development logs..."
        docker-compose -f docker-compose.local.yml logs -f
        ;;
    "build")
        echo "🔨 Building development images..."
        docker-compose -f docker-compose.local.yml build --no-cache
        echo "✅ Development images built!"
        ;;
    "status")
        echo "📊 Development environment status:"
        docker-compose -f docker-compose.local.yml ps
        ;;
    "clean")
        echo "🧹 Cleaning development environment..."
        docker-compose -f docker-compose.local.yml down -v
        docker system prune -f
        echo "✅ Development environment cleaned!"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|build|status|clean}"
        echo ""
        echo "Commands:"
        echo "  start   - Start development environment"
        echo "  stop    - Stop development environment"
        echo "  restart - Restart development environment"
        echo "  logs    - Show logs"
        echo "  build   - Rebuild images"
        echo "  status  - Show container status"
        echo "  clean   - Clean up containers and volumes"
        exit 1
        ;;
esac