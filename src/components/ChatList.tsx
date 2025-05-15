import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ChatIcon from '@mui/icons-material/Chat';

function ChatList({ chats, selectedChat, setSelectedChat, handleNewChat }) {
  return (
    <Box sx={{ width: '250px', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon sx={{ fontSize: 24 }} />
        <Typography variant="h6" sx={{ flex: 1, fontFamily: 'Inter, sans-serif' }}>Sohbetler</Typography>
        <Button 
          variant="contained" 
          onClick={handleNewChat} 
          sx={{ 
            minWidth: 0, 
            px: 2, 
            py: 1, 
            fontWeight: 600, 
            transition: '0.2s',
            bgcolor: '#34495e',
            '&:hover': { bgcolor: '#2c3e50' },
            fontFamily: 'Inter, sans-serif'
          }}
        >
          NEW CHAT
        </Button>
      </Box>
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {chats.map((chat, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton 
              selected={selectedChat === idx} 
              onClick={() => setSelectedChat(idx)}
              sx={{ 
                transition: '0.2s', 
                '&:hover': { bgcolor: '#f8f9fa' },
                '&.Mui-selected': { bgcolor: '#e9ecef' }
              }}
            >
              <ChatIcon sx={{ mr: 1, color: '#6c757d' }} />
              <ListItemText 
                primary={chat.name} 
                primaryTypographyProps={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ChatList; 