const express = require('express');
const app = express();
const path = require('path');

app.use('/img', express.static(path.join(__dirname, '..', 'public', 'img')));
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));

app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(3000, () => console.log(`Listening on port 3000`));
