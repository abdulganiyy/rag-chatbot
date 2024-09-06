import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {  RunnableSequence,RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "./retriever.js";
import { combineDocuments } from "./combineDocuments.js";
import {
PromptTemplate
} from "@langchain/core/prompts";


const openAIApiKey = process.env.OPENAI_API_KEY

const llm = new ChatOpenAI({openAIApiKey})

// A string holding the phrasing of the prompt
// const standaloneQuestionTemplate = `Given some conversation history (if any) and a question,
//  convert the question to a standalone question,
//   conversation history: {conv_history}
//   question: {question} 
//   standalone question:`
const standaloneQuestionTemplate = `Given a question,
 convert the question to a standalone question,
  question: {question} 
  standalone question:`

// A prompt created using the PromptTemplate and fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

// Take the standaloneQuestionPrompt and PIPE the model
const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser())

const retrievalChain = RunnableSequence.from([
    prevResult => prevResult.standalone_question,
    retriever,
    combineDocuments
])

// const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on
// the context provided and the conversation history. Try to find the answer in the context. If the answer is not provided in the context, find the answer in the conversation 
// history if possible. If you really don't know the answer, say "I'm sorry, I don't know
// answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you are
// chatting to a friend
// conversation history: {conv_history}
// context: {context}
// question: {question}
// answer: `;

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on
the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know
answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you are
chatting to a friend
context: {context}
question: {question}
answer: `;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())



const chain = RunnableSequence.from([
    {
        standalone_question:standaloneQuestionChain,
        original_input: new RunnablePassthrough()
    },
    {
       context:retrievalChain,
       question:({original_input}) => original_input.question.question
    },
    answerChain
])


export async function progressConversation(question){

  const response = await chain.invoke({question})

  return response

}

