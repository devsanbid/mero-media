import 'dotenv/config'
import connectToDatabase from './db/index.js'
import './models/index.js'
import {app} from "./app.js"
const port = process.env.PORT || 5000;

connectToDatabase()
.then(()=>{
  app.on("error", (error)=>{
    console.log("ERROR", error);
  })
  app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
  })
})
.catch((error)=>{
  console.error("Database connection failed", error)
})