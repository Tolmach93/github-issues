/**
 * Created by tolmach on 22.07.17.
 */
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('build'));

app.get('/*', (req,res) => {
    res.sendfile(path.join(__dirname, 'index.html'))
});

app.listen(8080, function () {
    console.log('started on port http://localhost:8080!');
});