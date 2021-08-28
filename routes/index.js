var express = require('express');
var router = express.Router();
var app = express();
var upload = require('express-fileupload');
var docxConverter = require('docx-pdf');
var path = require('path');
var fs = require('fs');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/wordtopdf',(req,res)=>{
  res.render('wordtopdf')
  
})



module.exports = router;
