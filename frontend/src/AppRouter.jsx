//page terakhir untuk perpindahan page sebelum dimasukan ke app.jsx
import { useState } from 'react';
import Hero from './pages/heroPage/hero';
import DataShow from './pages/dataShowPage/dataShow';
import InputData from './pages/inputDataPage/input';
import EditPage from './pages/editPage/edit';
import DetailPage from './pages/detailPage/detail';

export default function AppRouter() {
  const [currentPage, setCurrentPage] = useState('hero');

  return (
    <main>
      {currentPage === 'hero' && (
        <Hero onNavigate={(page) => setCurrentPage(page)} />
      )}

      {currentPage === 'table' && (
        <DataShow 
          onBack={() => setCurrentPage('hero')} 
          onNavigate={(page) => setCurrentPage(page)} 
        />
      )}

      {currentPage === 'add' && (
        <InputData 
          onBack={() => setCurrentPage('hero')} 
          onSuccess={() => setCurrentPage('table')} 
        />
      )}

      {currentPage === 'edit' && (
        <EditPage 
          onBack={() => setCurrentPage('hero')} 
        />
      )}

      {currentPage === 'detail' && (
        <DetailPage 
          onBack={() => setCurrentPage('hero')} 
        />
      )}
    </main>
  );
}

