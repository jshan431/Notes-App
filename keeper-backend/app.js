const express = require('express');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use('/api/users', usersRoutes);

app.listen(5000, () => {
  console.log('Listening on port 5000');
});