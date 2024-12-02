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
import H1 from './components/H1/H1';
import CommonColors from "./CommonColors";

function App() {
  const [apiColors, setApiColors] = useState<ColorInterface>({
    gray: "",
    blue: "",
    silver: ""
  });

  const [schema, setSchema] = useState<SchemaSectionInterface[]>();

  const getHeader = async () => {
    await api.get("/query/getHeader").then((response: any) => {
      console.log(response.data.colors)
      setApiColors({
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
    <div className="flex flex-col h-svh">
      <Header backgroundColor={apiColors?.blue} flex justifyContentCenter alignItemsCenter height16 zIndex10 textWhite>
        <H1 text2xl>GoLedger Challenger</H1>
      </Header>
      <Main flex flexColumn backgroundColor={apiColors?.silver} gap2 paddingX10>
        <Section flex justifyCenter paddingY2>
          <Divider flex justifyBetween widthOneHalf>
            {schema && schema?.length > 0 && (
              schema.map((element: SchemaSectionInterface, index: number) => {
                return <Button key={index} border rounded paddingX2 borderColorHover={apiColors?.gray}>{element.label}</Button>
              })
            )}
          </Divider>
        </Section>
        <Aside flex flexColumn widthFull>
          <Divider flex justifyBetween>
            <H1 text2xl>Text 2XL</H1>
            <Button rounded textWhite uppercase border paddingX2 backgroundColor={CommonColors.success}>Add</Button>
          </Divider>
        </Aside>
      </Main>
      <Footer>
        <h1>teste</h1>
      </Footer>
    </div>
  );
}

export default App;
