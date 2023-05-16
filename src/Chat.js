import React, { useEffect, useState } from 'react'
import "./Chat.css"
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import { IconButton } from '@material-ui/core';
import Message from './Message';
import { useSelector } from 'react-redux';
import { selectChatId, selectChatName } from './features/chatSlice';
import db from './firebase';
import firebase from 'firebase';
import { selectUser } from './features/userSlice';
import FlipMove from "react-flip-move";

function Chat() {

  const [input, setInput] = useState("");
  const user = useSelector(selectUser);
  const chatName = useSelector(selectChatName);
  const chatId = useSelector(selectChatId);
  const [messages, setMessages] = useState([]);

  const autoScroll = document.getElementById("scroll");

  if (autoScroll) {
    autoScroll.scrollTop = autoScroll.scrollHeight;
  }

  useEffect(() => {

    if (chatId) {
      db.collection("chats").doc(chatId).collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => 
        setMessages(snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        })))
      )
    }
  }, [chatId])

  const sendMessage = (e) => {
    e.preventDefault();

    if (input.trim()) {
      db.collection("chats").doc(chatId).collection("messages").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        uid: user.uid,
        photo: user.photo,
        email: user.email,
        displayName: user.displayName,
      })
    }
    setInput("");
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <h4>To: <span className="chat__name">{chatName}</span></h4>
        <strong>Details</strong>
      </div>

      <div className="chat__messages" id="scroll">
        <FlipMove>
          {messages.map(({ id, data }) => (
            <Message key={id} contents={data} />
          ))}
        </FlipMove>
      </div>

      <div className="chat__input">
        <form>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="iMessage" type="text"/>
          <button onClick={sendMessage}>Send Message</button>
        </form>
        <IconButton>
          <MicNoneOutlinedIcon className="chat__mic" />
        </IconButton>
      </div>
    </div>
  )
}

export default Chat
