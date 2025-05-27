# Используем официальный node образ
FROM node:20-alpine

RUN sed -i 's|dl-cdn.alpinelinux.org|mirror.yandex.ru/mirrors/alpine|' /etc/apk/repositories \
 && apk update \
 && apk add --no-cache bash
# Рабочая директория в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --omit=dev

# Копируем весь исходный код
COPY . .

RUN npx prisma generate

# Компилируем проект (если используется TypeScript)
RUN npm run build

# Открываем порт, на котором слушает NestJS (по умолчанию 3000)
EXPOSE 3000

# Запускаем собранный проект
CMD ["node", "dist/main.js"]