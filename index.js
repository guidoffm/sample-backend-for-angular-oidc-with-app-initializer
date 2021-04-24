import express from 'express';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

const port = 3000;

const app = express();

const authenticateToken = (req, res, next) => {
  let token;
  if (req.query.access_token) {
    token = req.query.access_token;
  } else {
    const authHeader = req.headers['authorization']
    token = authHeader && authHeader.split(' ')[1]
  }

  if (token == null) {
    return res.sendStatus(401);
  }

  verify(token, process.env.PUBLIC_KEY, (err, tokenData) => {

    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    // token expired
    if (Date.now() > tokenData.exp * 1000) {
      return res.sendStatus(403);
    }

    // token note before (nbf)
    if (tokenData.nbf && Date.now() < tokenData.nbf * 1000) {
      return res.sendStatus(403);
    }

    // Optional: check group membership
    // if (requiredGroup && tokenData[groupsClaimName].split(groupsSeparator).filter(x => x === requiredGroup).length != 1) {
    //   return res.sendStatus(403);
    // }

    req.token = tokenData;

    next();
  });
};

app.get('/api/test', authenticateToken, (req, res) => {
  console.log(req.token);
  res.send(req.token);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`)
});
