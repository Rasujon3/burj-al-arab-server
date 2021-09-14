
const express = require('express')
const app = express()
const port = 5000

const pass = "ArabianHorse79";


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://arabian:ArabianHorse79@cluster0.3l9g8.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("burjAlArab").collection("bookings");
    // perform actions on the collection object
    console.log('db connected successfully')
    client.close();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)
