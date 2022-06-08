const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
//'sequelize is from connection file
// 'force: ?' if true, restarts db everytime server is started. Compare to "DROP TABLE ___ IF EXISTS"
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening !!'));
});