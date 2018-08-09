const compressor = require('flexmonster-compressor');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://demo:p123456@ds121251.mlab.com:21251/flexmonster", { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    console.log("Connected successfully to MongoDB.");
    app.set("db", client.db("flexmonster"));
});

app.get('/mongodb', (req, res) => {
    const db = req.app.get('db');
    const result = db.collection('sample_data').find({}, { projection: { '_id': false } }).stream();
    let stream = compressor.compressJsonStream(result);
    stream.on('data', data => res.write(data));
    stream.on('end', () => res.end());
});

app.get('/json', (req, res) => {
    let stream = compressor.compressJson([{
        "Category": "Accessories",
        "Size": "262 oz",
        "Color": "red",
        "Destination": "Australia",
        "Business Type": "Specialty Bike Shop",
        "Country": "Australia",
        "Price": 174,
        "Quantity": 225,
        "Discount": 23
    }, {
        "Category": "Bikes",
        "Size": "214 oz",
        "Color": "yellow",
        "Destination": "Canada",
        "Business Type": "Specialty Bike Shop",
        "Country": "Canada",
        "Price": 502,
        "Quantity": 90,
        "Discount": 17
    }, {
        "Category": "Components",
        "Size": "235 oz",
        "Color": "green",
        "Destination": "Australia",
        "Business Type": "Warehouse",
        "Country": "Australia",
        "Price": 551,
        "Quantity": 1950,
        "Discount": 51
    }, {
        "Category": "Cars",
        "Size": "307 oz",
        "Color": "white",
        "Destination": "United Kingdom",
        "Business Type": "Warehouse",
        "Country": "Canada",
        "Price": 842,
        "Quantity": 8212,
        "Discount": 55
    }]);
    stream.on('data', data => res.write(data));
    stream.on('end', () => res.end());
})

app.get('/csv', (req, res) => {
    let stream = compressor.compressCsv(
    	`Category,Size,Color,Destination,Business Type,Country,Price,Quantity,Discount
		Accessories,262 oz,red,Australia,Specialty Bike Shop,Australia,174,225,23
		Bikes,214 oz,yellow,Canada,Specialty Bike Shop,Canada,502,90,17
		Clothing,147 oz,white,France,Specialty Bike Shop,France,242,855,37
		Components,112 oz,yellow,Germany,Specialty Bike Shop,Germany,102,897,42
		Cars,256 oz,red,United Kingdom,Specialty Bike Shop,United Kingdom,126,115,44
		Accessories,278 oz,yellow,United States,Specialty Bike Shop,United States,1246,88,47
		Clothing,8 oz,green,Australia,Value Added Reseller,Australia,680,66,80`
	);
    stream.on('data', data => res.write(data));
    stream.on('end', () => res.end());
})
app.use(express.static('./'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));