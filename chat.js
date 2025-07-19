import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat({ username, room }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', { username, room });

    socket.on('messageHistory', (history) => {
      setChat(history);
    });

    socket.on('receiveMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageHistory');
    };
  }, [room, username]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { user: username, text: message, room });
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {chat.map((msg, i) => (
          <div key={i} style={msg.user === username ? styles.myMsg : styles.otherMsg}>
            <strong>{msg.user}</strong>: {msg.text}
            <div style={{ fontSize: '10px', color: '#999' }}>{msg.time}</div>
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    background: '#f9f9f9',
  },
  chatBox: {
    height: '400px',
    overflowY: 'auto',
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
  },
  inputArea: {
    display: 'flex',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
  },
  button: {
    padding: '10px 20px',
  },
  myMsg: {
    textAlign: 'right',
    background: '#d1ffd6',
    padding: '5px 10px',
    margin: '5px 0',
    borderRadius: '10px',
  },
  otherMsg: {
    textAlign: 'left',
    background: '#fff',
    padding: '5px 10px',
    margin: '5px 0',
    borderRadius: '10px',
  },
};

export default Chat;
