import express from "express";

const PORT = process.env.PORT || 4000;
const server = express();

server.get('/', (req, res) => {
  res.send('Hello World by Express!');
});

server.listen(PORT, () => console.log(`Express Server is running on http://localhost:${PORT}`));
