
const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const port = 5000
app.use(cors());
app.use(bodyParser.json());

var serviceAccount = require("./burj-al-arab-sujon-firebase-adminsdk-q5wnw-5e30ca82c8.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


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

    app.get('/bookings',(req,res) =>{
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')){
            const idToken = bearer.split(' ')[1];
            console.log({idToken});
            admin
                .auth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    console.log(tokenEmail,queryEmail);
                    if (tokenEmail == queryEmail){
                        bookings.find({email: req.query.email})
                            .toArray((err,documents)=>{
                                res.send(documents);
                            })
                    }
                    // ...
                })
                .catch((error) => {
                    // Handle error
                });
        }



    })

})




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)
