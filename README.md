# КР5 — Конвертер валют (Express.js)

Express-приложение с API, middleware, static, routes/controllers.

## Запуск
```bash
npm install
npm start
```
Открой: http://localhost:3000

## API
- `GET /api/rates` — курсы (query: `base`, фиктивно поддерживается только USD)
- `GET /api/rates/:base` — курсы по `req.params`
- `GET /api/convert?from=USD&to=EUR&amount=10` — конвертация через `req.query`
- `POST /api/convert` — конвертация через body JSON `{ from, to, amount }`
- `PUT /api/rates` — (опционально) обновить фиктивные курсы `{ rates: { EUR: 0.9 } }`

## Выполненные требования
- Express-сервер
- Маршруты GET/POST (+PUT)
- `req.params`, `req.query`
- `express.json()` и `express.urlencoded()`
- собственный middleware (logger)
- `express.static()`
- разнесение логики на `routes` + `controllers`
