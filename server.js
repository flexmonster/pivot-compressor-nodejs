const compressor = require('flexmonster-compressor');
const express = require('express');
const app = express();


app.get('/data', (req, res) => {
    let stream = compressor.compressJson([
        ["Col", "Col2"],
        ["Value1", 16],
        ["Value2", 12]
    ]);
    stream.on('data', data => res.write(data));
    stream.on('end', () => res.end());
})
app.use(express.static('./'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));