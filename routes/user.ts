import * as express from 'express';
import Logger from '../logger/logger';

const app = express();
const users = [
  { firstName: 'fnam1', lastName: 'lnam1', userName: 'username1' },
];

app.get('/users', (req, res) => {
  Logger.info('users route');
  res.json(users);
});

app.get('/users/:userName', (req, res) => {
  Logger.info(`filter users by username:::::${req.params.userName}`);
  const user = users.filter((usr) => req.params.userName === usr.userName);
  res.json(user);
});

app.post('/user', (req, res) => {
  users.push(req.body);
  res.json(users);
});

export default app;
