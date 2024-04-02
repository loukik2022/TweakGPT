import { useState } from "react";

const fetchSendPrompt = async (userPrompt) => {
   try {
      const response = await fetch("http://localhost:5174/", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ userPrompt }),
      });
      // console.log(response)
      const data = await response.json();
      return data;
   } catch (error) {
      console.error(error);
      return null;
   }
};

export default function Chat() {
   // state for sending the prompt to the backend
   const [message, setMessage] = useState("");
   // state for retrieving the response from the backend
   const [chatHistory, setChatHistory] = useState([{ 
      role: 'bot', 
      message: 'How can I help you today?' 
   }]); 

   // send prompt to the backend
   const handleSubmit = async (event) => {
      event.preventDefault();
      if (message !== "") {
         const response = await fetchSendPrompt(message);
         setChatHistory(chatHistory => [
            ...chatHistory,
            { role: 'user', message },
            { role: 'bot', message: response.gpt }
         ]);
         setMessage(""); // Clear the message input
      }
   };
   const handleChange = (event) => {
      setMessage(event.target.value);
   };

   return (
      <div className="chat">
         <div className="chat-output">
            {chatHistory.map((chat, index) => (
               <div key={index} className={`chat-output-container-${chat.role}`}>
                  <div className="avatar">
                     {chat.role === 'bot' ? <img className="logo" src="openai.png" alt="openai logo" style={{backgroundColor: "#0da37f"}} /> : <img className="logo" src="user.png" alt="openai logo" style={{backgroundColor: "white", width: "40px", height: "40px"}} />}
                  </div>
                  <div className={`message`}>
                     {chat.message}
                  </div>
               </div>
            ))}
         </div>

         <div className="chat-input">
            <form onSubmit={handleSubmit}>
               <input 
               rows = "1"
               value={message}
               onChange={handleChange}
               className="type-message" 
               placeholder="Type a message" 
               ></input>
            </form>
         </div>
      </div>
   )
}

// idea:
/*
 we're keeping track of the chat history in the chatHistory state variable, which is an array of objects. Each object represents a message in the chat and has two properties: role, which can be either 'user' or 'bot', and message, which is the text of the message.

When the user submits a message, we add it to the chatHistory array along with the response from the OpenAI API. We then display all the messages in the chatHistory array in the chat interface.
*/