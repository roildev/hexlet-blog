import server from '../index.js';

const PORT = 5000;
server().listen(PORT, () => {
  console.log(`Server was started on '${PORT}'`);
});
