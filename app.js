var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require('express-fileupload');
var docxConverter = require('docx-pdf');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


//Variables
const extend_pdf = '.pdf'
const extend_docx = '.docx'
var down_name
//use express-fileupload
app.use(upload());

//Post the upload file
app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    //File where .docx will be downloaded  
    var uploadpath = __dirname + '/uploads/' + name;
    //Name of the file --ex test,example
    const First_name = name.split('.')[0];
    //Name to download the file
    down_name = First_name;
    //.mv function will be used to move the uploaded file to the
    //upload folder temporarily
    file.mv(uploadpath,function(err){
      if(err){
        console.log(err);
      }else{
        //Path of the downloaded or uploaded file
        var initialPath = path.join(__dirname, `./uploads/${First_name}${extend_docx}`);
        //Path where the converted pdf will be placed/uploaded
        var upload_path = path.join(__dirname, `./uploads/${First_name}${extend_pdf}`);
        //Converter to convert docx to pdf -->docx-pdf is used
        //If you want you can use any other converter
        //For example -- libreoffice-convert or --awesome-unoconv
        docxConverter(initialPath,upload_path,function(err,result){
        if(err){
          console.log(err);
        }
        console.log('result'+result);
        res.render('download')
        });
      }
    });
  }else{
    res.send("No File selected !");
    res.end();
  }
});

app.get('/download', (req,res) =>{
  //This will be used to download the converted file
  res.download(__dirname +`/uploads/${down_name}${extend_pdf}`,`${down_name}${extend_pdf}`,(err) =>{
    if(err){
      res.send(err);
    }else{
      //Delete the files from uploads directory after the use
      console.log('Files deleted');
      const delete_path_doc = process.cwd() + `/uploads/${down_name}${extend_docx}`;
      const delete_path_pdf = process.cwd() + `/uploads/${down_name}${extend_pdf}`;
      try {
        fs.unlinkSync(delete_path_doc)
        fs.unlinkSync(delete_path_pdf)
        //file removed
      } catch(err) {
      console.error(err)
      }
    }
  })
})
//linking of thankyou page
app.get('/thankyou',(req,res) => {
    res.send('thankyou for using the app')
})
//Starting the server at port 3000

app.listen(5000,() => {
    console.log("Server Started at port 5000...");
})






// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
