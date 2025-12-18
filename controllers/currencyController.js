const store = require('../data/rates');

function normalize(code) {
  return String(code || '').trim().toUpperCase();
}

// Возвращает список доступных валют и курсы для базовой валюты
exports.getRates = (req, res) => {
  const base = normalize(req.query.base || store.base);

  // В этом варианте данные фиктивные, поэтому поддерживаем только базу, которая есть в store
  if (base !== store.base) {
    return res.status(400).json({
      message: `Поддерживается только база ${store.base} (фиктивные данные)`
    });
  }

  res.json({
    base: store.base,
    rates: store.rates,
    updatedAt: store.updatedAt,
    supported: Object.keys(store.rates)
  });
};

// Демонстрация req.params: /api/rates/:base
exports.getRatesByBase = (req, res) => {
  const base = normalize(req.params.base);

  if (base !== store.base) {
    return res.status(400).json({
      message: `Поддерживается только база ${store.base} (фиктивные данные)`
    });
  }

  res.json({
    base: store.base,
    rates: store.rates,
    updatedAt: store.updatedAt
  });
};

// Конвертация через query-параметры: /api/convert?from=USD&to=EUR&amount=10
exports.convertQuery = (req, res) => {
  const from = normalize(req.query.from);
  const to = normalize(req.query.to);
  const amount = Number(req.query.amount);

  if (!from || !to || Number.isNaN(amount)) {
    return res.status(400).json({
      message: 'Нужны query-параметры: from, to, amount'
    });
  }

  const result = convert(from, to, amount);
  if (!result.ok) return res.status(400).json({ message: result.message });

  res.json({
    from,
    to,
    amount,
    result: result.value,
    updatedAt: store.updatedAt
  });
};

// Конвертация через body: POST /api/convert { from, to, amount }
exports.convertBody = (req, res) => {
  const from = normalize(req.body.from);
  const to = normalize(req.body.to);
  const amount = Number(req.body.amount);

  if (!from || !to || Number.isNaN(amount)) {
    return res.status(400).json({
      message: 'Нужно тело запроса JSON: { from, to, amount }'
    });
  }

  const result = convert(from, to, amount);
  if (!result.ok) return res.status(400).json({ message: result.message });

  res.json({
    from,
    to,
    amount,
    result: result.value,
    updatedAt: store.updatedAt
  });
};

// (Опционально) обновление фиктивных курсов: PUT /api/rates { rates: { EUR: 0.9, ... } }
exports.updateRates = (req, res) => {
  const rates = req.body.rates;
  if (!rates || typeof rates !== 'object') {
    return res.status(400).json({ message: 'Нужно тело JSON: { rates: {...} }' });
  }

  // обновляем только те ключи, которые уже есть (безопасно для демонстрации)
  Object.keys(rates).forEach((k) => {
    const code = normalize(k);
    const val = Number(rates[k]);
    if (store.rates[code] !== undefined && !Number.isNaN(val) && val > 0) {
      store.rates[code] = val;
    }
  });

  store.updatedAt = new Date().toISOString();

  res.json({
    message: 'Курсы обновлены (фиктивно)',
    base: store.base,
    rates: store.rates,
    updatedAt: store.updatedAt
  });
};

function convert(from, to, amount) {
  if (amount < 0) return { ok: false, message: 'amount должен быть >= 0' };

  if (!store.rates[from]) return { ok: false, message: `Неизвестная валюта from=${from}` };
  if (!store.rates[to]) return { ok: false, message: `Неизвестная валюта to=${to}` };

  // Все курсы заданы относительно USD (store.base).
  // Сначала переводим from -> USD, потом USD -> to.
  const inUsd = amount / store.rates[from]; // т.к. 1 USD = rate * CUR, значит 1 CUR = 1/rate USD
  const out = inUsd * store.rates[to];

  // округление до 4 знаков для красоты
  const rounded = Math.round(out * 10000) / 10000;

  return { ok: true, value: rounded };
}
