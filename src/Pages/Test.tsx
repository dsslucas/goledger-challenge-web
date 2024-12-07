import React, { useState, useEffect } from 'react';
import getArtist from '../api/artists';
import getSong from '../api/song';

interface Artist {
  "@assetType": string;
  "@key": string;
  "@lastTouchBy": string;
  "@lastTx": string;
  "@lastUpdated": string;
  country: string;
  name: string;
  albuns: Album[];
}

interface Album {
  "@assetType": string;
  "@key": string;
  "@lastTouchBy": string;
  "@lastTx": string;
  "@lastUpdated": string;
  artist: Artist;
  name: string;
  year: number;
  songs: Song[];
}

interface Song {
  "@assetType": string;
  "@key": string;
  "@lastTouchBy": string;
  "@lastTx": string;
  "@lastUpdated": string;
  album: Album;
  name: string;
}

const Test: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      console.log("ativei o loading")
      setIsLoading(!isLoading)
    }, 5000); // 10 segundos
  }, [])

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log("desativei o loading")
        setIsLoading(false);
      }, 5000); // 10 segundos

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <div
      className={`fixed inset-0 bg-gray-800 flex justify-center items-center z-[100] transition-transform duration-500 z-100 ${
        isLoading ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Conteúdo do loading */}
      <div className="text-white animate-pulse">Carregando...</div>
    </div>
  );
};

export default Test;