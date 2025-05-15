import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';

// Helper: get all paths from tree
function getAllPaths(node: any, path = ''): string[] {
  const currentPath = path ? `${path}/${node.name}` : node.name;
  if (node.type === 'file') return [currentPath];
  let paths = [currentPath];
  if (node.children) {
    node.children.forEach((child: any) => {
      paths = paths.concat(getAllPaths(child, currentPath));
    });
  }
  return paths;
}

function TreeView({ node, checked, onCheck, path = '', folderStatusMap }: { node: any, checked: string[], onCheck: (id: string, children: string[]) => void, path?: string, folderStatusMap: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  if (!node) return null;
  const currentPath = path ? `${path}/${node.name}` : node.name;
  const isChecked = checked.includes(currentPath);
  const allChildren = node.children ? node.children.filter((child: any) => child.type === 'directory').flatMap((child: any) => getAllPaths(child, currentPath)) : [];

  if (node.type === 'file') {
    return (
      <li style={{ background: undefined, cursor: 'pointer', borderRadius: 4, padding: '2px 8px', display: 'flex', alignItems: 'center' }}>
        <span>{node.name}</span>
      </li>
    );
  }
  return (
    <li>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          size="small"
          checked={isChecked}
          indeterminate={allChildren.some(p => checked.includes(p)) && !isChecked}
          onChange={() => onCheck(currentPath, allChildren)}
          onClick={e => e.stopPropagation()}
        />
        <span
          onClick={() => setOpen(!open)}
          style={{ cursor: 'pointer', fontWeight: 'bold', color: '#2c3e50', background: isChecked ? '#e0f7fa' : undefined, borderRadius: 4, padding: '2px 8px' }}
        >
          {open ? '▼' : '▶'} {node.name}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '0.9em', minWidth: 90, textAlign: 'right' }}>
          {folderStatusMap[currentPath]}
        </span>
      </div>
      {open && node.children && (
        <ul style={{ marginLeft: 16 }}>
          {node.children.map((child: any, idx: number) => (
            <TreeView key={idx} node={child} checked={checked} onCheck={onCheck} path={currentPath} folderStatusMap={folderStatusMap} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function EgitimTree({ selectedFolders, setSelectedFolders, folderStatusMap }: {
  selectedFolders: string[],
  setSelectedFolders: (folders: string[]) => void,
  folderStatusMap: Record<string, string>
}) {
  const [tree, setTree] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5050/api/egitimler-tree')
      .then(res => res.json())
      .then(data => {
        setTree(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Klasör yapısı alınamadı.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Yükleniyor...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;
  if (!tree) return <div style={{ padding: 24 }}>Klasör bulunamadı.</div>;

  // Sadece klasör yollarını çıkar
  function getAllDirectoryPaths(node: any, path = ''): string[] {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    if (node.type === 'file') return [];
    let paths = [currentPath];
    if (node.children) {
      node.children.forEach((child: any) => {
        paths = paths.concat(getAllDirectoryPaths(child, currentPath));
      });
    }
    return paths;
  }
  const allPaths = getAllDirectoryPaths(tree);
  const allChecked = selectedFolders.length === allPaths.length;

  // Checkbox handler
  const handleCheck = (id: string, children: string[]) => {
    if (selectedFolders.includes(id)) {
      setSelectedFolders(selectedFolders.filter(item => item !== id && !children.includes(item)));
    } else {
      setSelectedFolders([...selectedFolders, id, ...children.filter(c => !selectedFolders.includes(c))]);
    }
  };

  // Tümünü seç/kaldır
  const handleCheckAll = () => {
    if (allChecked) setSelectedFolders([]);
    else setSelectedFolders(allPaths);
  };

  // W3Schools ana konuları (örnek, sabit dizi)
  const w3Topics = [
    'html', 'css', 'js', 'python', 'sql', 'php', 'bootstrap', 'react', 'c', 'c++', 'java', 'xml', 'jquery', 'django', 'typescript', 'nodejs', 'json', 'sass', 'git', 'go', 'kotlin', 'r', 'swift', 'vue', 'angular', 'asp', 'mongodb', 'w3css', 'excel', 'access', 'numpy', 'pandas', 'matplotlib', 'statistics', 'cybersecurity', 'linux', 'docker', 'graphql', 'firebase', 'perl', 'ruby', 'scala', 'rust', 'assembly', 'bash', 'fortran', 'csharp', 'vb', 'dart', 'flutter', 'machinelearning', 'datascience', 'ai'
  ];
  // Kullanıcı klasörlerinin son isimleri
  const userTopics = allPaths.map(path => path.split('/').pop()?.toLowerCase());
  const missingTopics = w3Topics.filter(topic => !userTopics.includes(topic));

  // Akıllı eşleştirme tablosu
  const topicMap: Record<string, string> = {
    'html': 'Diller', 'css': 'Diller', 'js': 'Diller', 'python': 'Diller', 'sql': 'Diller', 'php': 'Diller', 'c': 'Diller', 'c++': 'Diller', 'java': 'Diller', 'xml': 'Diller', 'json': 'Diller', 'typescript': 'Diller', 'sass': 'Kod/Frontend', 'go': 'Diller', 'kotlin': 'Kod/Mobil', 'r': 'Diller', 'swift': 'Kod/Mobil', 'perl': 'Diller', 'ruby': 'Diller', 'scala': 'Diller', 'rust': 'Diller', 'assembly': 'Diller', 'bash': 'Kod/Security', 'fortran': 'Diller', 'csharp': 'Diller', 'vb': 'Diller', 'dart': 'Kod/Mobil',
    'bootstrap': 'Kod/Frontend', 'jquery': 'Kod/Frontend', 'vue': 'Kod/Frontend', 'angular': 'Kod/Frontend', 'w3css': 'Kod/Frontend',
    'nodejs': 'Kod/Backend', 'django': 'Kod/Backend', 'asp': 'Kod/Backend', 'firebase': 'Kod/DevOps', 'graphql': 'Kod/DevOps',
    'mongodb': 'Kod/Veri', 'excel': 'Kod/Veri', 'access': 'Kod/Veri',
    'numpy': 'Kod/Veri-Bilimi', 'pandas': 'Kod/Veri-Bilimi', 'matplotlib': 'Kod/Veri-Bilimi', 'statistics': 'Kod/Veri-Bilimi', 'machinelearning': 'Kod/Veri-Bilimi', 'datascience': 'Kod/Veri-Bilimi', 'ai': 'Kod/Veri-Bilimi',
    'cybersecurity': 'Kod/Security', 'linux': 'Kod/DevOps', 'docker': 'Kod/DevOps',
    'flutter': 'Kod/Mobil',
    'git': 'Kod/DevOps',
  };
  // Klasör Teklifi: hangi ana klasöre ait olduğu ile birlikte göster
  const missingTopicsDetailed = missingTopics.map(topic => ({
    topic,
    folder: topicMap[topic] || 'Diğer'
  }));

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ fontFamily: 'Inter, sans-serif', color: '#2c3e50' }}>Eğitim Klasörleri</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Checkbox size="small" checked={allChecked} indeterminate={selectedFolders.length > 0 && !allChecked} onChange={handleCheckAll} />
        <span style={{ fontWeight: 500, color: '#1976d2', cursor: 'pointer' }} onClick={handleCheckAll}>
          Tümünü Seç / Kaldır
        </span>
      </div>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        <TreeView node={tree} checked={selectedFolders} onCheck={handleCheck} folderStatusMap={folderStatusMap} />
      </ul>
      {/* Klasör Teklifi */}
      {missingTopicsDetailed.length > 0 && (
        <div style={{ marginTop: 32, borderTop: '1px solid #e0e0e0', paddingTop: 16 }}>
          <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 8 }}>Klasör Teklifi (w3schools.com):</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: '#2c3e50', fontSize: '1em' }}>
            {missingTopicsDetailed.map(({ topic, folder }) => (
              <li key={topic}>{topic} <span style={{ color: '#888', fontSize: '0.95em' }}>({folder})</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}