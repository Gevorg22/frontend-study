# Развертывание на GitHub Pages

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на https://github.com/new
2. Создайте репозиторий `frontend-study` (или другое название)
3. Выберите **Public** (чтобы работал GitHub Pages)

## Шаг 2: Добавление удаленного репозитория

```bash
git remote add origin https://github.com/YOUR_USERNAME/frontend-study.git
git branch -M main
git push -u origin main
```

Замените `YOUR_USERNAME` на ваше имя пользователя GitHub.

## Шаг 3: Обновление конфигурации для GitHub Pages

Вы можете разместить на:
- **GitHub Pages (gh-pages веток)** - самый простой вариант
- **GitHub Pages из папки `/dist`** - в веток main

### Вариант A: Использование gh-pages ветки (рекомендуется)

```bash
# Установка пакета для развертывания
npm install --save-dev gh-pages
```

Обновите `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/frontend-study",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

Обновите `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/frontend-study/',
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'questions-data': ['./src/questions-data.json']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

Затем разверните:
```bash
npm run deploy
```

### Вариант B: Использование Actions (автоматическое развертывание)

1. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: OPTIONAL_CUSTOM_DOMAIN
```

2. В настройках репозитория (Settings → Pages):
   - Выберите **Deploy from a branch**
   - Branch: `gh-pages`
   - Folder: `/ (root)`

## Шаг 4: Проверка развертывания

После выполнения команды `npm run deploy` или push:
1. Перейдите в Settings → Pages вашего репозитория
2. Проверьте, что статус показывает "Your site is published at..."
3. Откройте URL и проверьте приложение

## Готовые команды

```bash
# 1. Инициализация git (если еще не сделано)
git init

# 2. Добавление удаленного репозитория
git remote add origin https://github.com/YOUR_USERNAME/frontend-study.git

# 3. Первичный коммит и push
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main

# 4. Установка gh-pages
npm install --save-dev gh-pages

# 5. Развертывание
npm run deploy
```

## Рекомендации

- **Вариант A (gh-pages)** - проще, если вы случайно не хотите отслеживать файлы `/dist`
- **Вариант B (Actions)** - автоматический, более современный подход
- **base: '/frontend-study/'** в vite.config.ts нужна только если репозиторий не является пользовательским (username.github.io)

Если у вас есть домен, приведите CNAME файл в папку public/.

---

**Статус приложения:**
✅ Сборка: `npm run build` готова
✅ Размер: оптимален для GitHub Pages (< 5 GB рекомендуется)
✅ localStorage: будет работать на GitHub Pages
✅ React Router: требует обработки 404 для SPA
