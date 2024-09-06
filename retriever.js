import {createClient} from "@supabase/supabase-js"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";


    const sbApiKey= process.env.SUPABASE_API_KEY
    const sbUrl=  process.env.SUPABASE_URL_CHAT_BOT
    const openAIApiKey = process.env.OPENAI_API_KEY
    
    const embeddings = new OpenAIEmbeddings({openAIApiKey});
      
      const client = createClient(
      sbUrl,  sbApiKey
      );
      
     const vectorStore = new SupabaseVectorStore(embeddings,{
        client,
        tableName:'documents',
        queryName:"match_documents"});

     const retriever = vectorStore.asRetriever()

     export {retriever}