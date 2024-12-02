import React, { useEffect, useState } from 'react';
import './App.css';
import api from './api/api';
import { ColorInterface } from './Interface';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';

function App() {
  const [colors, setColors] = useState<ColorInterface>({
    gray: "",
    blue: "",
    silver: ""
  });

  const consultas = async () => {
    await api.get("query/getHeader").then((response: any) => {
      console.log(response.data.colors)
      setColors({
        gray: response.data.colors[0],
        blue: response.data.colors[1],
        silver: response.data.colors[2]
      });
    });
  }

  useEffect(() => {
    console.log("teste")
    consultas();
  }, []);

  return (
    <div className="flex flex-col bg-gray-200 h-svh">
      <Header backgroundColor={colors?.blue} flex justifyContentCenter alignItemsCenter height16 zIndex10 textWhite>
        <h1>teste</h1>
      </Header>
      <Main flex backgroundColor={colors?.silver}>
        <h1>teste</h1>
      </Main>
      <Footer>
        <h1>teste</h1>
      </Footer>
    </div>
  );
}

export default App;
