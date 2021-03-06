
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3l9g8.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const port = 5000
app.use(cors());
app.use(bodyParser.json());

var serviceAccount = require("./configs/burj-al-arab-sujon-firebase-adminsdk-q5wnw-5e30ca82c8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


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
    })

    app.get('/bookings',(req,res) =>{
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')){
            const idToken = bearer.split(' ')[1];
            admin
                .auth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    if (tokenEmail == queryEmail){
                        bookings.find({email: queryEmail})
                            .toArray((err,documents)=>{
                                res.status(200).send(documents);
                            })
                    }
                    else {
                        res.status(401).send('Unauthorized access');
                    }
                })
                .catch((error) => {
                    res.status(401).send('Unauthorized access');
                });
        }
        else {
            res.status(401).send('Unauthorized access');
        }
    })

})


app.listen(port)
