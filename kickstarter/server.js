const { createServer } = require('http');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

const main = async () => {
  
  await app.prepare();
  
  try {
    await createServer(handler).listen(3000);
  } catch (error) {
    console.log(error);
  }
  
};


main();
