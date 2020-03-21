const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const env = require('dotenv').config();

app.use(express.json()); // Make sure it comes back as json

// mongoose.connect('mongodb://localhost:27017/URLShortener');
// mongoose.connect('mongodb+srv://url_shortner_chief:d6SU7UOGpGlSlWex@url-shortner-rbrr2.mongodb.net/test?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://urlshortnerchief:d6SU7UOGpGlSlWex@url-shortner-rbrr2.mongodb.net/test?retryWrites=true&w=majority');
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// cloud mongo db 


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://url_shortner_chief:d6SU7UOGpGlSlWex@url-shortner-rbrr2.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log("connection success");
  
//   // perform actions on the collection object
//   client.close();
// });


const {URLModel } = require('./models/urlshort')

// Middleware
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));
app.set('title','url shortner project');
app.set('view engine','ejs');


app.get('/', function (req, res) { 
    //server side rendering
    // res.send("<h1>Hellow World</h1>");
    //getter setter
    // res.send(app.get('title'));

    let allUrl = URLModel.find(function (err, result) {
        // console.log(result);
        res.render('home', {
            urlResult: result
        })
      })
    // res.render('home');
 });

 app.get('/about', function (req, res) { 
    res.send("<h1>About US</h1>")
 });


 app.post('/create', function (req, res) { 
    // create  a short URL 
    // Store In DB 
    console.log(req.body.longurl);
    // console.log(generateUrl());
    
    let urlShort = new URLModel({
        longUrl: req.body.longurl,
        shortUrl: generateUrl(),
        createdAt: Date.now()

    }) 
    
    urlShort.save(function(err, data) {
        if (err) {throw err};
        console.log("data");
        console.log(data);
        res.redirect('/')
        
    })

  });


app.get('/:urlID', function (req, res) { 
    console.log(req.params.urlID);
    let urShort = URLModel.findOne({shortUrl: req.params.urlID}, function (err, data) {
        if (err) {
            throw err;
        }
        if(data){
            URLModel.findByIdAndUpdate({_id:data.id}, {$inc:{clickCount: 1}}, function (err, updatedData) {
                if (err) {
                    throw err;
                }
                console.log("link count increased");
                // console.log(updatedData);
                
            })
    
            res.redirect(data.longUrl)
        }

    })
 })


app.get('/delete/:id', function (req, res) {
    URLModel.findByIdAndDelete({_id: req.params.id}, function (err, updatedData) {
        if (err) {
            throw err
        }
        console.log("link deleted");
        // console.log(updatedData);
        res.redirect('/');
    })
})

const PORT = process.env.Secure_port || 5000;

app.listen(PORT, function() {
   console.log("port is running in 3000 = "+PORT);
    
});


function generateUrl() { 
    var rndResult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (let i = 0; i < 5; i++) {
        rndResult += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    console.log(rndResult);
    return rndResult;
}
