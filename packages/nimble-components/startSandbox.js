// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const app = express();
const port = 9090;

app.use(express.static('sandbox'));
app.use('/node_modules', express.static('node_modules'));
app.use('/dist', express.static('dist', {
    extensions: ['js'],
    index: 'index.js',
    setHeaders: function (res, path, stat) {
        res.set('Content-Type', 'text/javascript');
    }
}));
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Sandbox app listening on port ${port}`);
});