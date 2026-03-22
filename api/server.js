const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/growth',    require('./routes/growth'));
app.use('/api/timeline',  require('./routes/timeline'));
app.use('/api/memories',  require('./routes/memories'));
app.use('/api/state',     require('./routes/state'));
app.use('/api/import',    require('./routes/importData'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Sprout API running on port ${PORT}`));
