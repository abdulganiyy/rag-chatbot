import 'dotenv/config'
import express from "express";
import { progressConversation } from "./main.js";


const app = express();

app.use(express.json())

app.use(express.static('public'));


app.post("/chat", async (req,res)=>{

  const question = req.body

  console.log(question)

  const resp = await progressConversation(question)

  console.log(resp)

  res.json(resp)

})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});