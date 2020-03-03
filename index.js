const path = require('path')
const {spawn} = require('child_process');
// console.log(spawnSync)
/**
   * Run python myscript, pass in `-u` to not buffer console output
   * @return {ChildProcess}
*/
const express=require('express');
var bodyParser= require('body-parser');
let cors=require('cors');
let app=express();
var multer = require("multer");
const fs=require('fs');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'docs')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })
//--- route for uploading two text files----

var deletefiles=(req,res,next)=>{
     var pathdocs=path.join(__dirname, 'docs')
    fs.readdir(pathdocs, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(pathdocs, file), err => {
          if (err) throw err;
        });
      }
    });
    next();
}
app.post('/uploadmultiple', deletefiles,upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }



      function runScript(){
         return spawn('python', [
            "-u",
            path.join(__dirname, 'main.py'),
           "--foo", "some value for foo",
         ]);
      }
      const subprocess = runScript()

  subprocess.on('exit',(code)=>{
      let rawdata = fs.readFileSync('./person.json')
       let student = JSON.parse(rawdata);
       res.send(student)
  })

})

app.listen(3000,()=>{
    console.log('app is running on port 3000');
});
