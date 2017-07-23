/**
 * Created by tolmach on 22.07.17.
 */
const express = require('express');
const app = express();

app.use(express.static('build'));

app.get('/*', (req, res) => {
    res.sendFile('build/index.html', {root: __dirname})
});

app.listen(8080, function () {
    console.log('started on port http://localhost:8080!');
});