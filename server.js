const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log('DB connection successful!')
  );

const port =
  parseInt(process.env.PORT, 10) || 3000;
const server = app.listen(
  port,
  '127.0.0.1',
  () => {
    // eslint-disable-next-line no-console
    console.log(`App running on port ${port}`);
  }
);

process.on('unhandledRejection', (err) => {
  console.log(
    'UNHANDLER REJECTION! 💥 Shutting down...'
  );
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(
    'UNCAUGHT EXCEPTION! 💥 Shutting down...'
  );
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
