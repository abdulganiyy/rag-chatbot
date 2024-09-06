
const button = document.getElementById('submit-btn')

button.addEventListener("click",(e)=>{
  e.preventDefault()
  progressConversation()
})


async function progressConversation(){

  const userInput = document.getElementById('user-input')
  const chatbotConversation = document.getElementById('chatbot-conversation-container')
  const question = userInput.value
  userInput.value =""
   console.log(question)
  //add human message
  const newHumanSpeechBubble = document.createElement("div")
  newHumanSpeechBubble.classList.add("speech",'speech-human')
  chatbotConversation.appendChild(newHumanSpeechBubble)
  newHumanSpeechBubble.textContent = question
  chatbotConversation.scrollTop =chatbotConversation.scrollHeight

  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({question})
    });

    if (!response.ok) {
      throw new Error(`HTTP error   
 ${response.status}`);
    }

    const responseData = await response.json();   

    // Process the response data
    console.log(responseData);
      //add ai message
  const newAiSpeechBubble = document.createElement("div")
  newAiSpeechBubble.classList.add("speech",'speech-ai')
  chatbotConversation.appendChild(newAiSpeechBubble)
  newAiSpeechBubble.textContent = responseData
  chatbotConversation.scrollTop =chatbotConversation.scrollHeight
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // convHistory.push(question)



}



















// const tweetTemplate = 'Generate a promotional tweet for a product, from this product description: {productDesc}'

// const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate)

// const tweetChain = tweetPrompt.chain(llm)

// const response = await tweetChain.invoke({productDesc:"Electric holes"})

// console.log(response)

// const MISTRAL_API_KEY=process.env.MISTRAL_API_KEY

// const llm = new ChatMistralAI({apiKey:"h1Jvg6hiDQNjFc8R3cMQIJyKWzFJeRH5"});