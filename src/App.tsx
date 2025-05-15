import React, { useState, useRef, useEffect } from 'react';
import ChatList from './components/ChatList.tsx';
import ChatWindow from './components/ChatWindow.tsx';
import { Button } from '@mui/material';
import TrainingPanel from './components/TrainingPanel.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EgitimTree from './components/EgitimTree.tsx';

function App() {
  const [message, setMessage] = useState<any>('');
  const [chats, setChats] = useState<any>([
    { name: 'Sohbet 1', messages: [] }
  ]);
  const [selectedChat, setSelectedChat] = useState<any>(0);
  const [eduSites, setEduSites] = useState<any>('');
  const [eduTopics, setEduTopics] = useState<any>('');
  const [eduResult, setEduResult] = useState<any>('');
  const [eduExtract, setEduExtract] = useState<any>('');
  const [eduFinal, setEduFinal] = useState<any>('');
  const [extractedList, setExtractedList] = useState<any>([]);
  const [remainingList, setRemainingList] = useState<any>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [folderStatusMap, setFolderStatusMap] = useState<Record<string, string>>({});
  const chatBoxRef = useRef<any>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chats, selectedChat]);

  const moveChatToTop = (index: any) => {
    if (index === 0) return chats;
    const chat = chats[index];
    const newChats = [chat, ...chats.slice(0, index), ...chats.slice(index + 1)];
    return newChats;
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    let chatIndex = selectedChat;
    let updatedChats = chats;
    if (chatIndex === null) {
      const newChat = {
        name: `Sohbet ${chats.length + 1}`,
        messages: []
      };
      updatedChats = [newChat, ...chats];
      chatIndex = 0;
    }
    const userMessage = {
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    // API'ye istek at
    const response = await fetch('http://localhost:5050/api/yorumla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soru: message, hedefDil: 'tr' })
    });
    const data = await response.json();
    let aiResponse = {
      text: data.cevap,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    updatedChats[chatIndex] = {
      ...updatedChats[chatIndex],
      messages: [...updatedChats[chatIndex].messages, userMessage, aiResponse]
    };
    updatedChats = moveChatToTop(chatIndex);
    setChats(updatedChats);
    setSelectedChat(0);
    setMessage('');
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    if (chats.length > 0 && chats[0].messages.length === 0) {
      setSelectedChat(0);
      return;
    }
    const newChat = {
      name: `Sohbet ${chats.length + 1}`,
      messages: []
    };
    setChats([newChat, ...chats]);
    setSelectedChat(0);
  };

  // Eğitim paneli simülasyon fonksiyonları
  const handleStartEdu = async () => {
    if (!eduSites.trim()) {
      setEduResult('Lütfen bir site adresi girin.');
      return;
    }
    setEduResult('Eğitim verisi çekiliyor...');
    try {
      const response = await fetch('http://localhost:5050/api/egitim-cek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: eduSites.trim() })
      });
      const data = await response.json();
      if (data.hata) {
        setEduResult('Veri çekilemedi: ' + data.hata);
        return;
      }
      setEduResult(
        `Başlık: ${data.title}\nBaşlıklar: ${data.headings.join(', ')}\nParagraflar: ${data.paragraphs.length} adet çekildi.`
      );
      setRemainingList(data.paragraphs);
    } catch (err) {
      setEduResult('Veri çekme sırasında hata oluştu.');
    }
  };
  const handleExtract = () => {
    if (eduExtract.trim() === '') return;
    const extractValue = eduExtract.trim().replace(/\s+/g, ' ').toLowerCase();
    setRemainingList((prev: any) =>
      prev.filter((item: string) =>
        !item.trim().replace(/\s+/g, ' ').toLowerCase().includes(extractValue)
      )
    );
    setExtractedList((prev: any) => [...prev, eduExtract]);
    setEduFinal('Çıkarılan bilgi zipten çıkarıldı. (simülasyon)');
    setEduExtract('');
  };
  const handleSaveEdu = () => {
    setEduResult(null);
    setEduExtract('');
    setEduFinal('Kalan bilgiler ziplendi!');
    setTimeout(() => setEduFinal(null), 2000);
    setExtractedList([]);
    setRemainingList([]);
  };

  // Klasör adına göre w3schools'da içerik var mı kontrolü
  const checkContentExists = async (folder: string) => {
    // Klasörün son parçasını al (örn. Kod/Frontend -> frontend)
    const topic = folder.split('/').pop()?.toLowerCase();
    if (!topic) return false;
    const url = `https://www.w3schools.com/${topic}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.status === 200;
    } catch {
      return false;
    }
  };

  // Eğitim başlatma fonksiyonu (entegrasyonlu, içerik kontrolü ile)
  const startTraining = async () => {
    for (const folder of selectedFolders) {
      setFolderStatusMap(prev => ({ ...prev, [folder]: '⏳ Başlıyor' }));
      const exists = await checkContentExists(folder);
      if (exists) {
        await new Promise(res => setTimeout(res, 1200));
        setFolderStatusMap(prev => ({ ...prev, [folder]: '✅ Tamamlandı' }));
      } else {
        setFolderStatusMap(prev => ({ ...prev, [folder]: '❌ İçerik Bulunamadı' }));
      }
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', background: '#f8f9fa' }}>
            {/* Sol yarı: Chat ve sohbet geçmişleri */}
            <div style={{ width: '50vw', height: '100vh', display: 'flex', flexDirection: 'row' }}>
      <ChatList 
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        handleNewChat={handleNewChat}
      />
      <ChatWindow
        chats={chats}
        selectedChat={selectedChat}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
      />
            </div>
            {/* Sağ yarı: Ortalanmış butonlar */}
            <div style={{ width: '50vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => window.open('/training', '_blank')}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 20, px: 6, py: 2 }}
              >
                Eğitim Paneli
              </Button>
              {/* İleride buraya başka butonlar da ekleyebilirsin */}
            </div>
          </div>
        } />
        <Route path="/training" element={
          <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', background: '#f8f9fa' }}>
            {/* Klasörler solda, panel sağda */}
            <div style={{ width: '50vw', height: '100vh', overflowY: 'auto', background: '#f4f6f8', borderRight: '2px solid #e0e0e0' }}>
              <EgitimTree
                selectedFolders={selectedFolders}
                setSelectedFolders={setSelectedFolders}
                folderStatusMap={folderStatusMap}
              />
            </div>
            <div style={{ width: '50vw', height: '100vh', display: 'flex', alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <TrainingPanel
                eduSites={eduSites}
                setEduSites={setEduSites}
                eduTopics={eduTopics}
                setEduTopics={setEduTopics}
                eduResult={eduResult}
                eduExtract={eduExtract}
                setEduExtract={setEduExtract}
                eduFinal={eduFinal}
                extractedList={extractedList}
                remainingList={remainingList}
                handleExtract={handleExtract}
                handleSaveEdu={handleSaveEdu}
                selectedFolders={selectedFolders}
                folderStatusMap={folderStatusMap}
      />
    </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App; 