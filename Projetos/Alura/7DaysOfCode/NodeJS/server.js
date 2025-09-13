import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('🚀 Servidor rodando com Express!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor online em http://localhost:${PORT}`));
