var db = require('./db');
const express = require('express');
var router = express.Router();
const cors = require('cors');
const app = express();

app.use(cors());
router.get('/', (req, res) => {
   const hostName = req.headers.host;
    fetch(`http://${hostName}/api/getTitles`)
        .then(response => response.json())
        .then(data => {
          
            res.render('home', { title: data.titles });
        })

});

module.exports = router;
