# Qtim тестовое задание

## Стэк: Nest.js, PostgreSQL, Typeorm, Swagger
# Запукс проекта

### Шаг 1: Создвать сеть

```shell
docker network create web-app-network
```

### Шаг 2: Скопировать содежимое файла .env.example в файфл .env

```shell
cp .env.example .env
```

### Шаг 3: Запустить postgres и redis при помощи docker compose

```shell
docker compose up -d
```
### Шаг 4: Установить зависимости
```shell
npm ci
```


### Шаг 5: Применить миграции

```shell
npm run migration:run
```

### Шаг 6: Запуск проекта

```shell
npm run start:dev
```

---

### Открыть API по ссылке: [http://localhost:3099/api/](http://localhost:3099/api/)