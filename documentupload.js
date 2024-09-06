import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import {createClient} from "@supabase/supabase-js"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings,ChatOpenAI } from "@langchain/openai";
import { promises as fs } from 'fs';



try {
    const text = await fs.readFile("scrimba-info.text","utf-8")


    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize:500,
        separators:['\n\n','\n',' ',''],
        chunkOverlap:50
    })

    const output = await splitter.createDocuments([text])


    const sbApiKey= process.env.SUPABASE_API_KEY
    const sbUrl=  process.env.SUPABASE_URL_CHAT_BOT
    const openAIApiKey = process.env.OPENAI_API_KEY

    const embeddings = new OpenAIEmbeddings({openAIApiKey});
      
      const client = createClient(
      sbUrl,  sbApiKey
      );
      
     await SupabaseVectorStore.fromDocuments(output,embeddings,{client,tableName:'documents'});


} catch (error) {
    console.log(error)

}
