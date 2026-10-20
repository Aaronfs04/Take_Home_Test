import React from 'react';
import styles from './hero.module.css';

interface HeroProps {
  onNavigate?: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>
          Take Home Test - Full Stack Developer
        </h1>
        <p className={styles.subtitle}>
          Aaron Faustine Suryanto
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button 
          className={styles.btn}
          onClick={() => onNavigate && onNavigate('table')}
        >
          Lihat Data Tabel
        </button>
        <button 
          className={styles.btn}
          onClick={() => onNavigate && onNavigate('add')}
        >
          Tambah Data
        </button>
        <button 
          className={styles.btn}
          onClick={() => onNavigate && onNavigate('edit')}
        >
          Edit Data
        </button>
        <button 
          className={styles.btn}
          onClick={() => onNavigate && onNavigate('detail')}
        >
          Detail Data
        </button>
      </div>
    </div>
  );
};

export default Hero;
