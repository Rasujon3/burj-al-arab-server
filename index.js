
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const cors = require('cors');

const port = 5000
app.use(cors());
app.use(bodyParser.json());

const pass = "ArabianHorse79";


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://arabian:ArabianHorse79@cluster0.3l9g8.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("burjAlArab").collection("bookings");
    // perform actions on the collection object
    app.post('/addBooking',(req,res)=>{
        const newBooking = req.body;
        bookings.insertOne(newBooking)
            .then(result =>{
                res.send(result.insertedCount > 0);
            })
        console.log(newBooking);
    })
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)
