# Развертывание на GitHub Pages

## Предварительные требования

1. GitHub аккаунт
2. Репозиторий на GitHub с именем `frontend-study` (или другим)
3. Git установлен и настроен локально

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Назовите репозиторий `frontend-study`
3. Нажмите "Create repository"

## Шаг 2: Инициализируйте Git и загрузите код

```bash
# Инициализируйте репозиторий
git init
git add .
git commit -m "Initial commit: Q&A Hub with learning tracker"

# Добавьте удаленный репозиторий (замените на ваш URL)
git remote add origin https://github.com/yourusername/frontend-study.git

# Создайте ветку gh-pages
git branch -M main
git push -u origin main
```

## Шаг 3: Обновите `package.json`

Убедитесь, что в `package.json` установлено правильное значение `homepage`:

```json
"homepage": "https://yourusername.github.io/frontend-study"
```

Замените `yourusername` на ваше имя пользователя GitHub.

## Шаг 4: Разверните приложение

Запустите команду деплоя:

```bash
npm run deploy
```

Это выполнит:
1. `npm run build` - соберет оптимизированную версию
2. `gh-pages -d dist` - загрузит содержимое папки `dist` на ветку `gh-pages`

## Шаг 5: Включите GitHub Pages в настройках репозитория

1. Перейдите в Settings вашего репозитория
2. В левом меню нажмите "Pages"
3. В разделе "Source" выберите ветку `gh-pages`
4. Нажмите "Save"

## Шаг 6: Дождитесь развертывания

GitHub Pages должен развернуться за 1-2 минуты. Ваше приложение будет доступно по адресу:

```
https://yourusername.github.io/frontend-study
```

## Развертывание обновлений

Каждый раз при внесении изменений просто запустите:

```bash
npm run deploy
```

Git автоматически коммитит и загружает изменения на GitHub Pages.

## Отладка

Если что-то не работает:

1. Проверьте, что значение `base` в `vite.config.ts` соответствует пути репозитория:
   ```typescript
   base: '/frontend-study/',
   ```

2. Проверьте, что `homepage` в `package.json` правильный

3. Убедитесь, что ветка `gh-pages` создана и загружена

4. Проверьте статус развертывания в Settings → Pages вашего репозитория

## Локальное тестирование перед деплоем

Перед запуском `npm run deploy` можно локально проверить сборку:

```bash
npm run build
npm run preview
```

Откройте http://localhost:4173 для предпросмотра.

---

**После развертывания ваше приложение будет полностью функционально с:**
- ✅ Поиском по вопросам
- ✅ Пагинацией (10 вопросов на страницу)
- ✅ Отметкой изученных вопросов (сохранение в localStorage)
- ✅ Мобильной версией
- ✅ Русскими категориями
