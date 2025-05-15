import React from 'react';
import { Box, Typography, Collapse, Stack, TextField, Button, Chip, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SaveIcon from '@mui/icons-material/Save';

interface TrainingPanelProps {
  eduSites: any;
  setEduSites: any;
  eduTopics: any;
  setEduTopics: any;
  eduResult: any;
  eduExtract: any;
  setEduExtract: any;
  eduFinal: any;
  extractedList: any;
  remainingList: any;
  handleExtract: any;
  handleSaveEdu: any;
  selectedFolders: string[];
  folderStatusMap: Record<string, string>;
}

function TrainingPanel({
  eduSites, setEduSites,
  eduTopics, setEduTopics,
  eduResult,
  eduExtract, setEduExtract,
  eduFinal,
  extractedList,
  remainingList,
  handleExtract, handleSaveEdu,
  selectedFolders, folderStatusMap
}: TrainingPanelProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [lastData, setLastData] = React.useState<{title: string, headings: string[], paragraphs: string[]} | null>(null);

  React.useEffect(() => {
    // eduResult güncellendiğinde, başlık ve paragrafları ayıkla
    if (eduResult && eduResult.startsWith('Başlık:')) {
      // Basit bir ayrıştırıcı, daha gelişmişi backend'den dönebilir
      const titleMatch = eduResult.match(/Başlık: (.*?)\\n/);
      const headingsMatch = eduResult.match(/Başlıklar: (.*?)\\n/);
      setLastData({
        title: titleMatch ? titleMatch[1] : '',
        headings: headingsMatch ? headingsMatch[1].split(', ') : [],
        paragraphs: remainingList || []
      });
    }
  }, [eduResult, remainingList]);

  return (
    <Box 
      sx={{ 
        flex: 1,
        p: 0,
        minWidth: '350px',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <Paper elevation={3} sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '2px solid #bcd0c7',
        p: { xs: 2, sm: 4 },
        overflow: 'hidden',
        height: '100%',
        boxSizing: 'border-box',
      }}>
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          pr: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 0, pb: 0 }}>
            <Typography variant="h5" sx={{ flex: 1, fontFamily: 'Inter, sans-serif', color: '#2c3e50' }}>Eğitim Paneli</Typography>
          </Box>
          <Collapse in={true} orientation="vertical" sx={{ p: 0, pt: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                <LanguageIcon fontSize="small" /> Gezinilecek Siteler
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField 
                  size="small" 
                  value={eduSites} 
                  onChange={e => setEduSites(e.target.value)} 
                  placeholder="site1.com, site2.com" 
                  sx={{ flex: 1 }}
                  multiline
                  minRows={1}
                  maxRows={4}
                  InputProps={{
                    sx: { fontFamily: 'Inter, sans-serif', overflowY: 'auto' }
                  }}
                />
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                <ContentCutIcon fontSize="small" /> Çıkarılacak Bilgiler
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField 
                  size="small" 
                  value={eduExtract} 
                  onChange={e => setEduExtract(e.target.value)} 
                  placeholder="ör: özet, anahtar kelimeler..." 
                  sx={{ flex: 1 }}
                  multiline
                  minRows={1}
                  maxRows={4}
                  InputProps={{
                    sx: { fontFamily: 'Inter, sans-serif', overflowY: 'auto' }
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleExtract} 
                  sx={{ 
                    transition: '0.2s',
                    borderColor: '#2c3e50',
                    color: '#2c3e50',
                    '&:hover': { 
                      bgcolor: '#2c3e50',
                      color: 'white',
                      borderColor: '#2c3e50'
                    },
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ÇIKAR
                </Button>
              </Stack>
            </Box>
            {extractedList.length > 0 && (
              <Box sx={{ mt: 2, bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                  Çıkarılan Bilgiler:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {extractedList.map((item, idx) => (
                    <Chip 
                      key={idx} 
                      label={item} 
                      sx={{ 
                        mb: 1,
                        bgcolor: '#e9ecef',
                        color: '#2c3e50',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': { bgcolor: '#dee2e6' }
                      }} 
                    />
                  ))}
                </Stack>
              </Box>
            )}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                <SearchIcon fontSize="small" /> Toplanacak Bilgiler
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField 
                  size="small" 
                  value={eduTopics} 
                  onChange={e => setEduTopics(e.target.value)} 
                  placeholder="ör: makale başlıkları, yazarlar..." 
                  sx={{ flex: 1 }}
                  multiline
                  minRows={1}
                  maxRows={4}
                  InputProps={{
                    sx: { fontFamily: 'Inter, sans-serif', overflowY: 'auto' }
                  }}
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={() => setShowDetails((prev) => !prev)}
                    endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap',
                      mb: 1
                    }}
                  >
                    {showDetails ? 'Detayları Gizle' : 'Detayları Göster'}
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {showDetails && lastData && (
              <Box sx={{ mt: 2, bgcolor: '#f8f9fa', p: 2, borderRadius: 2, boxShadow: 1, maxHeight: 300, overflowY: 'auto' }}>
                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 600 }}>Başlık:</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{lastData.title}</Typography>
                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 600 }}>Başlıklar:</Typography>
                <Box sx={{ mb: 1 }}>
                  {lastData.headings.map((h, i) => (
                    <Typography key={i} variant="body2">- {h}</Typography>
                  ))}
                </Box>
                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 600 }}>Paragraflar:</Typography>
                <Box sx={{ maxHeight: 120, overflowY: 'auto', bgcolor: '#e9ecef', borderRadius: 1, p: 1 }}>
                  {lastData.paragraphs.map((p, i) => (
                    <Typography key={i} variant="body2" sx={{ fontFamily: 'Fira Mono, monospace', mb: 1 }}>{p}</Typography>
                  ))}
                </Box>
              </Box>
            )}

            {eduResult && (
              <Typography sx={{ mt: 1, color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                {eduResult}
              </Typography>
            )}

            {eduFinal && (
              <Typography sx={{ mt: 1, color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                {eduFinal}
              </Typography>
            )}

            {remainingList && remainingList.length > 0 && (
              <Box sx={{ mt: 2, bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                  Kalan Bilgiler (Zip'e eklenecek):
                </Typography>
                <Box
                  sx={{
                    bgcolor: '#d1e7dd',
                    color: '#2c3e50',
                    fontFamily: 'Fira Mono, monospace',
                    borderRadius: 1,
                    p: 1,
                    width: '100%',
                    maxHeight: 200,
                    overflowY: 'auto',
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-line',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#bcd0c7', borderRadius: 2 },
                  }}
                >
                  {remainingList.map((line, index) => (
                    <Typography key={index} variant="body2" sx={{ fontFamily: 'Fira Mono, monospace' }}>
                      {line}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Seçili klasörler ve durumları */}
            {selectedFolders.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 600 }}>Seçili Klasörler ve Durumları:</Typography>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {selectedFolders.map(folder => (
                    <li key={folder} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{folder}</span>
                      <span style={{ marginLeft: 8, fontSize: '0.95em' }}>{folderStatusMap[folder]}</span>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Collapse>
        </Box>
        {eduResult && (
          <Box sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'white',
            pt: 2,
            pb: 2,
            zIndex: 2,
            mt: 'auto',
            width: '100%'
          }}>
            <Button 
              variant="contained" 
              onClick={handleSaveEdu} 
              startIcon={<SaveIcon />}
              sx={{ 
                width: '100%',
                transition: '0.2s',
                bgcolor: '#2c3e50',
                '&:hover': { bgcolor: '#34495e' },
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Kalıcı Olarak Kaydet
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default TrainingPanel; 