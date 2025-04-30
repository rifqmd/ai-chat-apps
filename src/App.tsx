import { useState } from 'react'
import { MessageCard } from './components/MessageCard'
import * as React from "react";
import ollama from 'ollama';

type Message = {
    role: 'assistant' | 'user';
    content: string;
};


function App() {
    const [message, setMessage] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello, how can I help you today?'
        },
    ])

    const [input, setInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage: Message = { role: 'user', content: input };
            setMessage((prevMessages) => [...prevMessages, newMessage]);

            // function
            const {message} = await ollama.chat({
                model: 'deepseek-r1:1.5b',
                messages: [newMessage],
                // [
                    // {
                    //     role: 'user',
                    //     content: input
                    // }
                // ]
                stream: false
            })

            setMessage(prevMessages => [...prevMessages, { role: 'assistant', content: message.content }]);

            setInput('');
        }
    }

    return (
      <div className={'flex flex-col h-screen bg-gray-100 py-20'}>
          <main className={'flex-grow overflow-hidden'}>
              <div className={'max-w-3xl mx-auto h-full flex flex-col'}>
                  <div className={'flex-grow overflow-y-auto p-4 my-4 flex flex-col'}>
                      {message.map((message => (
                          <MessageCard role={message.role} message={message.content} />
                      )))}
                  </div>

                  <form onSubmit={handleSubmit} className={'flex items-center p-4'}>
                      <textarea
                        placeholder={'Type your message...'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={'flex-grow mr-2 p-4 border rounded-2xl border-gray-300'}
                      />
                      <button type="submit" disabled={!input.trim()} className={'p-4 bg-blue-500 rounded-2xl text-white'}>
                          Send
                      </button>
                  </form>
              </div>
          </main>
      </div>
    )
}

export default App
