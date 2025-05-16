import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { addMessage, fetchMessages } from '../hooks/useChat';

const ChatWindow = () => {
  const chat_id = 1; // Şimdilik sabit
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMessages(chat_id).then(({ data }) => setMessages(data || []));
  }, [chat_id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await addMessage({ text, sender: 'user', chat_id });
    setText('');
    fetchMessages(chat_id).then(({ data }) => setMessages(data || []));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Inter, sans-serif' }}>
          Sohbet 1
        </Typography>
      </Box>
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: '#f8f9fa',
          minHeight: 0,
          boxSizing: 'border-box',
          maxHeight: 'calc(100vh - 160px)',
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={msg.id}
            sx={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: { xs: '90%', sm: '70%', md: 400 },
              minWidth: 80,
              bgcolor: msg.sender === 'user' ? '#2c3e50' : 'white',
              color: msg.sender === 'user' ? 'white' : '#2c3e50',
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
              fontFamily: 'Inter, sans-serif',
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
              {msg.created_at}
            </Typography>
          </Box>
        ))}
        <div ref={bottomRef} style={{ marginBottom: 24 }} />
      </div>
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Mesajınızı yazın..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            size="small"
            multiline
            minRows={1}
            maxRows={5}
            InputProps={{
              sx: { fontFamily: 'Inter, sans-serif', overflowY: 'auto' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Inter, sans-serif',
                '&:hover fieldset': {
                  borderColor: '#2c3e50',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            endIcon={<SendIcon />}
            sx={{ 
              transition: '0.2s',
              bgcolor: '#2c3e50',
              '&:hover': { bgcolor: '#34495e' },
              fontFamily: 'Inter, sans-serif',
              px: 3
            }}
          >
            Gönder
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow; 