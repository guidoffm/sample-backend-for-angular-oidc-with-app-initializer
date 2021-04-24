import express from 'express';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

const port = 3000;

const app = express();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401);
  }

  verify(token, process.env.PUBLIC_KEY, (err, user) => {

    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
};

app.get('/api/test', authenticateToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`)
});
