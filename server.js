const express = require('express')
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

mongoose.connect('mongodb://localhost:27017/sessionHijackDB');
const loginSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Login = mongoose.model("Login", loginSchema);

app.get('/', (req, res) => {
  res.redirect("/login")
})
// app.get('/attack', async(req, res) => {
//   var script
//   const item = await Login.find({}, function(err, foundItems) {
//     if (err) {
//       console.log(err);
//       res.send("Error in accessing DB")
//     } else {
//       for(let i=0; i<foundItems.length; i++)
//       {
//         if(foundItems[i].comment.substring(0,8) === "<script>")
//         {
//           script = foundItems[i].comment
//           break
//         }
//       }
//     }
//   }).clone()
//     res.send(script)
// })

app.route("/login")
  .get((req,res)=>{
    res.sendFile(__dirname + "/login.html")
  })
  .post(async(req,res)=>{
    var uname = req.body.uname
    var password = req.body.password
    const item = await Login.find({username:uname}, function(err, foundItems) {
        if (err) {
          console.log(err);
          res.send("Error in accessing DB")
        } else {
            var pass = foundItems[0].password;
            if(pass === password){
              let user = {
                username : uname,
                password : password
              }
              res.cookie("userData",user)
              res.redirect("/home")
            }
            else {
              res.send("Invalid credentials")
            }
        }
      }).clone()
  })


app.route("/register")
  .get((req,res)=>{
    res.sendFile(__dirname + "/register.html")
  })
  .post((req,res)=>{
    var uname = req.body.uname
    var password = req.body.password
    const register = new Login({
      username: uname,
      password: password
    })
    Login.insertMany (register, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully saved default items to DB.");
      }
    });
    res.redirect("/login")
  })


app.route("/home")
  .get((req,res)=>{
    console.log(req.cookies);
    res.sendFile(__dirname + "/home.html")
  })



app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
