const express = require('express');
const cors = require('cors');
const schema = require('./schema/schema');
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');
const connectDB = require('./config/db');

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express();

connectDB();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);
app.use(express.static('../client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
