#!/bin/bash

# Docker Production Environment Manager

case "$1" in
    "status")
        echo "📊 Production environment status:"
        docker-compose ps
        ;;
    "logs")
        echo "📋 Showing production logs..."
        docker-compose logs -f "$2"
        ;;
    "restart")
        if [ -z "$2" ]; then
            echo "🔄 Restarting all production services..."
            docker-compose restart
        else
            echo "🔄 Restarting $2 service..."
            docker-compose restart "$2"
        fi
        echo "✅ Production service(s) restarted!"
        ;;
    "update")
        echo "🔄 Updating production application..."
        docker-compose pull web
        docker-compose up -d web
        echo "✅ Production application updated!"
        ;;
    "backup")
        echo "💾 Creating database backup..."
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
        docker exec thai-music-mongo mongodump --authenticationDatabase admin -u root -p "$MONGO_ROOT_PASSWORD" --out /data/db/backups/$BACKUP_NAME
        echo "✅ Backup created: $BACKUP_NAME"
        ;;
    *)
        echo "Usage: $0 {status|logs|restart|update|backup}"
        echo ""
        echo "Commands:"
        echo "  status          - Show container status"
        echo "  logs [service]  - Show logs (optional: specific service)"
        echo "  restart [service] - Restart service(s)"
        echo "  update          - Update application from ECR"
        echo "  backup          - Create database backup"
        echo ""
        echo "⚠️  This script manages PRODUCTION environment!"
        exit 1
        ;;
esac