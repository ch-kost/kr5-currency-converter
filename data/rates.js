// Фиктивные курсы. Базовая валюта: USD.
// Значение означает: 1 USD = rate * <CURRENCY>
module.exports = {
  base: 'USD',
  rates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    RUB: 80.50,
    KZT: 510.00,
    CNY: 7.20
  },
  updatedAt: new Date().toISOString()
};
