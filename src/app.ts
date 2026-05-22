import express from 'express';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.listen(PORT, () => console.log('Sever is running'));
