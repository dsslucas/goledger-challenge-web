import React, { useEffect, useState } from 'react';
import api from './api/api';
import { ColorInterface } from './Interface';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import H1 from './components/H1/H1';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from './Pages/Home/Home';
import Artist from './Pages/Artist/Artist';
import Album from './Pages/Album/Album';
import Playlist from './Pages/Playlist/Playlist';

function App() {
  const [apiColors, setApiColors] = useState<ColorInterface>();

  const getHeader = async () => {
    await api.get("/query/getHeader").then((response: any) => {
      setApiColors({
        gray: response.data.colors[0],
        blue: response.data.colors[1],
        silver: response.data.colors[2]
      });
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getHeader()]);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-svh">
      <Header flex justifyContentCenter alignItemsCenter height16 zIndex10>
        <H1 text2xl>GoLedger Challenger</H1>
      </Header>
      <Main flex flexColumn backgroundColor={apiColors?.silver} gap2 paddingX10>
        <BrowserRouter>
          <Routes>
            <Route path="/home" index element={<Home />} />
            <Route path="/artist" element={<Artist />} />            
            <Route path="/album" element={<Album />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </Main>
      <Footer>
        <h1>teste</h1>
      </Footer>
    </div>
  );
}

export default App;
