const express = require('express');
const path = require('path');

const logger = require('./middleware/logger');
const currencyRoutes = require('./routes/currencyRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', currencyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
