const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Class routine server is running');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@class-routine.guii3xb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("classRoutine");
        const institutions = database.collection("institutions");


        app.get('/institutions', async (req, res) => {
            const result = await institutions.find({}).toArray();
            res.send(result);
        })


        app.get('/institutions/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await institutions.findOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
