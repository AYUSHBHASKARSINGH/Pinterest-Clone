var express = require('express');
var router = express.Router();
const usermodel = require('./users');
const postmodel = require('./posts');
const passport = require('passport');
const localStrategy = require("passport-local");

const upload = require("./multer");

passport.use(new localStrategy(usermodel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/profile",isloggedin,async (req,res,next)=>{
  const user = await usermodel.findOne({
    username: req.session.passport.user
  }).populate("posts");
  console.log(user);
  // ye user ka data profile pe bhj diya ejs tags
  res.render("profile",{user : user});
})

router.get("/login",(req,res)=>{
  // console.log(req.flash("error"));
  res.render("login",{error : req.flash("error")});
})

router.get("/feed",(req,res)=>{
  res.render("feed");
})

router.post("/register",(req,res)=>{
  const userdata = new usermodel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullname,
  })

  usermodel.register(userdata, req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  }) 
})


router.post("/upload", isloggedin , upload.single("file") ,async (req,res)=>{
  if(!req.file){
    return res.status(404).send("No files were given");
  }
  // res.send("File uploaded succesfully");


  // jo file upload hui h usko save kro as a post and usko post id user ko do and user ko is post ki id pakda do
  // logged in user mil gya issey
  const user = await usermodel.findOne({username: req.session.passport.user});
  const postdata = await postmodel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id,
  });

  user.posts.push(postdata._id);
  await user.save();
  res.redirect("/profile");
})


router.post("/login",passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}),(req,res)=>{
})

router.get("/logout",(req,res)=>{
  req.logout(function(err){
    if(err) {return next(err);}
    res.redirect("/");
  });
})


function isloggedin(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}










// =------------------------------------------------------------------------------------------------=

// router.get("/createuser",async (req,res)=>{
//   // is user pe id hogi by default generated jo ki dikh jayegi res.send m
//   let createduser = await usermodel.create({
//     username: "Ayush",
//     password: "aYUSH",
//     posts: [],
//     email: "AYUSH@mail.com",
//     fullName: "Ayush Bhaskar Singh",
//   })



//   res.send(createduser);

// })


// router.get("/all",async (req,res)=>{
//   // issey sirf id milegi post ki but we need post ka data jo bhi h
//   // let user = await usermodel.findOne({_id: "65c1224b07e51f49eb8c3099"});
//   // so this ki jo user dhunda us id ka uski posts field ko populate kr do
//   let user = await usermodel.findOne({_id: "65c1224b07e51f49eb8c3099"}).populate('posts');
//   res.send(user);
// })
 

// router.get("/createpost",async (req,res)=>{
//   let createdpost = await postmodel.create({
//     postText: "HELLO GUYS  kaise ho:)",
//     // user ki id saved h post m 
//     user: "65c1224b07e51f49eb8c3099",
//   })

//   // is id wala user mil gya
//   let user = await usermodel.findOne({_id: "65c1224b07e51f49eb8c3099"});
//   // us user ke posts array m is post ki id push kr di
//   user.posts.push(createdpost._id);
//   await user.save();

//   res.send("Done");
// })

// =----------------------------------------------------------------------------------------------------------


module.exports = router;