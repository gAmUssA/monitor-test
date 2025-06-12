# Makefile for Monitor Test project
# Colors for terminal output
GREEN=\033[0;32m
BLUE=\033[0;34m
YELLOW=\033[1;33m
RED=\033[0;31m
PURPLE=\033[0;35m
NC=\033[0m # No Color

.PHONY: serve deploy help

help: ## 📚 Show this help
	@echo "$(PURPLE)Monitor Test Project$(NC) 🌈"
	@echo "$(YELLOW)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-15s$(NC) %s\n", $$1, $$2}'

serve: ## 🖥️  Run local development server
	@echo "$(GREEN)🚀 Starting local server at http://localhost:8000 $(NC)"
	python3 -m http.server 8000

deploy: ## 🚀 Deploy to GitHub Pages
	@echo "$(GREEN)📦 Pushing to GitHub Pages...$(NC)"
	git add .
	git commit -m "Update site content" || echo "$(YELLOW)⚠️  No changes to commit$(NC)"
	git push origin main
	@echo "$(GREEN)✅ Deployment complete! $(NC)"

init: ## 🔧 Initialize GitHub repository
	@echo "$(GREEN)🔧 Initializing GitHub repository...$(NC)"
	git init
	git add .
	git commit -m "Initial commit"
	@echo "$(YELLOW)⚠️  Now run: $(NC)"
	@echo "$(BLUE)gh repo create monitor-test --public --source=. --push$(NC)"
	@echo "$(YELLOW)⚠️  Or create a repository on GitHub and run: $(NC)"
	@echo "$(BLUE)git remote add origin <repository-url>$(NC)"
	@echo "$(BLUE)git branch -M main$(NC)"
	@echo "$(BLUE)git push -u origin main$(NC)"
