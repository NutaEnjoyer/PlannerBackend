# Используем официальный node образ
FROM node:20-alpine

RUN apk update && apk add --no-cache bash
# Рабочая директория в контейнере
WORKDIR /app

COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --omit=dev

# Копируем весь исходный код
COPY . .

RUN npx prisma generate

# Компилируем проект (если используется TypeScript)
RUN npm install @nestjs/cli
RUN npm run build

# Открываем порт, на котором слушает NestJS (по умолчанию 3000)
EXPOSE 3000

# Запускаем собранный проект
CMD ["node", "dist/main.js"]