import server from '../index.js';

const PORT = 8080;
server().listen(PORT, () => {
  console.log(`Server was started on '${PORT}'`);
});
