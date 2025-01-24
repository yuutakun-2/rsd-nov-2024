import { useState, useEffect, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);

  const nameRef = useRef();
  const msgRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8888/connect");
    // ws.onopen = () => {
    //   console.log("Connected to WebSocket server");
    // };

    ws.onopen = () => {
      console.log("WS connection opened!");
    };

    ws.onmessage = (e) => {
      setMessages(JSON.parse(e.data));
    };

    // ws.addEventListener("message", (e) => {
    //   setMessages(JSON.parse(e.data));
    // });

    fetch("http://localhost:8888").then(async (res) => {
      const data = await res.json();
      setMessages(data);
    });
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = nameRef.current.value;
            const msg = msgRef.current.value;
            if (!name || !msg) return false;

            fetch("http://localhost:8888/chat", {
              method: "POST",
              body: JSON.stringify({ name, msg }),
              headers: {
                "Content-Type": "application/json",
              },
            });
          }}
        >
          <input type="text" placeholder="Your name" required ref={nameRef} />
          <input type="text" placeholder="Your message" required ref={msgRef} />
          <button type="submit">Send</button>
        </form>
        {messages.map((message) => {
          return (
            <li key={message.id}>
              <b>{message.name}</b>
              <b>{message.msg}</b>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
