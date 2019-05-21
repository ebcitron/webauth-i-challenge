const server = require('./api/server');

const PORT = 6660;

server.listen(PORT, () => {
    console.log(`\n***\n Listening to http://localhost:${PORT}\n***\n`);
});