const express= require('express')
const mongoose=require('mongoose')
const bodyParser= require("body-parser")
const dotenv=require('dotenv')
const { normalize } = require('path')

const app= express()
dotenv.config()

const port= process.env.PORT || 3003

app.get('/', (req, res)=>{
   res.sendFile(__dirname + '/pages/index.html' );
});


const username= process.env.MONGODB_USERNAME
const password=process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.gb7agjs.mongodb.net/RegisterationFormDB`,{
   useNewUrlParser : true,
   useUnifiedTopology : true,
})

const registerationSchema =new mongoose.Schema({
   name:{type:String, required: true},
   email:{type:String, required: true},
   password:{type:String, required: true}
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const Registeration= mongoose.model("Registeration", registerationSchema);

app.post('/register', async (req, res)=>{
   try{
      const{ name ,email, password}= req.body;

      const existingUser = await Registeration.findOne({email: email})

      if (!existingUser) {
         const registerationData= new Registeration({
            name,
            email,
            password
         });
         await registerationData.save();
         res.redirect('/success');
      }else{
         console.log("user already exists");  
         res.redirect("/error");
      }
   }catch(error){
      console.log(error);
      res.redirect('/error');
   }
})

app.get('/success', (req, res)=>{
   res.sendFile(__dirname + '/pages/success.html' )
})


app.get('/error', (req, res)=>{
   res.sendFile(__dirname + '/pages/error.html')
});


app.listen(port,()=>{
   console.log(`server is running port ${port}`);
})