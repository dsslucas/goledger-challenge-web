import React, { useEffect, useState } from 'react';
import './App.css';
import api from './api/api';
import { ColorInterface, SchemaSectionInterface } from './Interface';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import Section from './components/Section/Section';
import Aside from './components/Aside/Aside';
import Button from './components/Button/Button';
import Divider from './components/Divider/Divider';

function App() {
  const [colors, setColors] = useState<ColorInterface>({
    gray: "",
    blue: "",
    silver: ""
  });

  const [schema, setSchema] = useState<SchemaSectionInterface[]>();

  const getHeader = async () => {
    await api.get("/query/getHeader").then((response: any) => {
      console.log(response.data.colors)
      setColors({
        gray: response.data.colors[0],
        blue: response.data.colors[1],
        silver: response.data.colors[2]
      });
    });
  }

  const getSchema = async () => {
    await api.get("/query/getSchema")
      .then((response: any) => {
        console.log(response.data)
        if (Array.isArray(response.data)) {
          setSchema(response.data.filter((element: SchemaSectionInterface) => element.label !== "AssetTypeListData"));
        }
      })
  }

  useEffect(() => {
    console.log("teste")
    getHeader();
    getSchema();
  }, []);

  return (
    <div className="flex flex-col bg-gray-200 h-svh">
      <Header backgroundColor={colors?.blue} flex justifyContentCenter alignItemsCenter height16 zIndex10 textWhite>
        <h1>GoLedger Challenger</h1>
      </Header>
      <Main flex flexColumn backgroundColor={colors?.silver} gap2>
        <Section flex justifyCenter paddingY2>
          <Divider flex justifyBetween widthOneHalf>
            {schema && schema?.length > 0 && (
              schema.map((element: SchemaSectionInterface, index: number) => {
                return <Button key={index} border rounded paddingX2 borderColorHover={colors?.gray}>{element.label}</Button>
              })
            )}
          </Divider>
        </Section>
        <Aside flex>
          <span>teste</span>
        </Aside>
      </Main>
      <Footer>
        <h1>teste</h1>
      </Footer>
    </div>
  );
}

export default App;
