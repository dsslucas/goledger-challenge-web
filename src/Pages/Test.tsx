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
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getArtist().getArtistInfo("artist:2988d4f2-5fa1-5f87-98a4-81c8b6df0bd6");
        setArtist(response);

        const songs = await getSong().getAllSongs();
        setSongs(songs);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };

    fetchData();
  }, []);

  const renderAlbum = (id: string) => {
    const album = artist?.albuns.filter((element: Album) => element["@key"] === id)[0];
    if (!album) return <></>

    return <li key={album["@key"]}>
      <span>{album.name} - {album.year}</span>
      {renderSongs(album["@key"])}
    </li>
  }

  const renderSongs = (idAlbum: string) => {
    const songsFilteredByIdAlbum = songs.filter((element: any) => element.album["@key"] === idAlbum);

    console.log(songsFilteredByIdAlbum)    

    return <ul>
      {songsFilteredByIdAlbum.map((element: any) => {
        return <li key={element["@key"]}>{element.name}</li>
      })}
    </ul>
  }

  if (!artist || !songs) return <h1>Aguarde</h1>;

  return (
    <div>
      <h1>{artist?.name}</h1>
      <p>Country: {artist?.country}</p>
      {/* {JSON.stringify(artist)} */}
      <br />
      <h2>Albums:</h2>
      {/* {JSON.stringify(artist.albuns)} */}
      <ul>
        {artist.albuns.map((element: Album) => {
          return renderAlbum(element["@key"])
        })}
      </ul>
    </div>
  );
};

export default Test;