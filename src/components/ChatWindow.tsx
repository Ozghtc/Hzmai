import React, { useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatWindow = ({
  chats, selectedChat, message, setMessage, handleSendMessage, handleKeyDown
}) => {
  const bottomRef = useRef(null);
  const selectedMessages = chats[selectedChat]?.messages;

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timeout);
  }, [chats, selectedChat, selectedMessages]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Inter, sans-serif' }}>
          {selectedChat !== null ? chats[selectedChat]?.name : ''}
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
        {selectedChat !== null && chats[selectedChat]?.messages.map((msg, index) => (
          <Box
            key={index}
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
              {msg.timestamp}
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
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
            onClick={handleSendMessage}
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