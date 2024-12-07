import React, { useEffect, useState } from "react";
import { Album, ArtistPageInterface } from "./Interface";
import { Navigate, useLocation, useNavigate } from "react-router";
import Section from "../../components/Section/Section";
import H1 from "../../components/H1/H1";
import getArtist from "../../api/artists";
import Banjo from "../../assets/img/banjo.jpg";
import CountryRoads from "../../assets/img/country.jpg";
import Figure from "../../components/Figure/Figure";
import Image from "../../components/Image/Image";
import Fieldset from "../../components/Fieldset/Fieldset";
import Span from "../../components/Span/Span";
import H2 from "../../components/H2/H2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Divider from "../../components/Divider/Divider";
import { ApiInformation } from "../../interfaces/ApiInformation";
import Aside from "../../components/Aside/Aside";
import getAlbum from "../../api/album";
import getSong from "../../api/song";
import songApi from "../../api/song";
import Swal from "sweetalert2";
import albumApi from "../../api/album";
import artistApi from "../../api/artists";

const Artist: React.FC<ArtistPageInterface> = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [artist, setArtist] = useState<ApiInformation | null>(null);
    const [songs, setSongs] = useState<ApiInformation[] | null>(null);

    const fetchData = async () => {
        try {
            await getArtist().getArtistInfo(id)
                .then((response: ApiInformation) => {
                    setArtist(response)
                    return response;
                })
                .then((response: ApiInformation) => {
                    response.albuns?.forEach(async (element: ApiInformation) => {
                        await getSong().getSongsByAlbumId(element["@key"])
                            .then((returnSongs: ApiInformation[]) => {
                                returnSongs?.forEach((eachSong: ApiInformation) => {
                                    setSongs((prevSongs) => (prevSongs ? [...prevSongs, eachSong] : [eachSong]));
                                })
                            })
                    })
                });
        } catch (err) {
            console.error("Erro ao buscar dados do artista: ", err);
        }
    };

    const id: string = location.state?.id;

    useEffect(() => {
        fetchData();
    }, [id]);

    if (!location.state || !id) {
        return <Navigate to="/home" replace />;
    }

    const handleDeleteSong = async (event: React.MouseEvent<HTMLButtonElement>, idSong: string) => {
        try {
            await songApi().deleteSongHandler(idSong)
                .then((response: any) => {
                    if (response.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: response.message,
                            icon: "success"
                        });
                        fetchData();
                    }
                    else Swal.fire({
                        title: "Error!",
                        text: response.message,
                        icon: "error"
                    });
                });
        }
        catch (error: any) {
            console.error(error)
            Swal.fire({
                title: "Error!",
                text: "Error on delete song.",
                icon: "error"
            });
        }
    }

    const renderSongs = (album: ApiInformation) => {
        if (album.songs && album.songs?.length > 0) {
            return <table className="w-full text-center">
                <thead>
                    <tr className={`bg-gray-600 text-white`}>
                        <th>#</th>
                        <th>Song</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {album.songs && album.songs.map((song: ApiInformation, index: number) => {
                        if (song.album) return <tr key={song["@key"]} className="even:bg-gray-500 even:bg-opacity-30">
                            <td>{index + 1}</td>
                            <td>{song.name}</td>
                            <td>
                                <Button type="button" icon deleteBackgroundColor textWhite rounded onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeleteSong(event, song["@key"])}><FontAwesomeIcon icon={faTrash} /></Button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>;
        }
        else return <Divider flex justifyCenter itemsCenter>
            <Span>Nothing registered there.</Span>
        </Divider>
    }

    const handleClickChangeArtistLocation = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            if (artist && artist.country) {
                await getArtist().updateCountryArtist(id, artist?.country);
                await fetchData();
            }
            else throw new Error();
        }
        catch (e) {
            console.error(e);
        }
    }

    const handleClickDeleteArtist = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            await artistApi().deleteArtist(id)
                .then((response: any) => {
                    if (response.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: response.message,
                            icon: "success"
                        });
                        navigate("/home");
                    }
                    else Swal.fire({
                        title: "Error!",
                        text: response.message,
                        icon: "error"
                    });
                });
        }
        catch (error: any) {
            console.error(error)
            Swal.fire({
                title: "Error!",
                text: "Error on delete artist.",
                icon: "error"
            });
        }
    }

    const handleClickChangeAlbumYear = async (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        try {
            if (artist && artist.albuns) {
                const album: ApiInformation = artist.albuns.filter((element: ApiInformation) => element["@key"] === id)[0];

                if (album.year) {
                    await getAlbum().updateYearAlbum(id, album?.year)
                        .then((response: any) => {
                            if (response.status) {
                                Swal.fire({
                                    title: "Updated!",
                                    text: response.message,
                                    icon: "success"
                                });
                                fetchData();
                            }
                            else Swal.fire({
                                title: "Error!",
                                text: response.message,
                                icon: "error"
                            });
                        });
                }
            }
            else throw new Error();
        }
        catch (e) {
            console.error(e);
            Swal.fire({
                title: "Error!",
                text: "Error on update album year.",
                icon: "error"
            });
        }
    }

    const handleDeleteAlbum = async (event: React.MouseEvent<HTMLButtonElement>, idAlbum: string) => {
        console.log("Cliquei na exclusao do album");
        console.log(idAlbum)
        try {
            await albumApi().deleteAlbum(idAlbum)
                .then((response: any) => {
                    if (response.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: response.message,
                            icon: "success"
                        });
                        fetchData();
                    }
                    else Swal.fire({
                        title: "Error!",
                        text: response.message,
                        icon: "error"
                    });
                });
        }
        catch (error: any) {
            console.error(error)
            Swal.fire({
                title: "Error!",
                text: "Error on delete album.",
                icon: "error"
            });
        }
    }

    const handleChangeCountryState = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (artist !== undefined && artist?.country !== undefined && e.target.value !== undefined) {
            setArtist({
                ...artist,
                country: e.target.value
            })
        }
    }

    const handleChangeAlbumYear = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (artist && artist.albuns !== undefined) {
            var updatedAlbuns: any = artist.albuns.map(album => {
                if (album["@key"] === id) {
                    return {
                        ...album,
                        year: Number(e.target.value)
                    };
                }
                return album;
            });

            setArtist({
                ...artist,
                albuns: updatedAlbuns
            })
        }
    }

    if (!artist && !songs) return <Divider>Loading...</Divider>

    return <>
        {artist && (
            <Divider flex paddingY2 gap2>
                <Section flex flexCol widthOneFiveDesktop>
                    <Figure flex justifyCenter itemsCenter>
                        <Image src={Banjo} roundedT />
                    </Figure>
                    <Divider flex flexCol widthFull backgroundGray padding2>
                        <H2 textXl>{artist.name}</H2>
                        <Fieldset flex itemsCenter gapX2 height7>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <Input
                                type="text"
                                id="artist-country"
                                name="country"
                                value={artist.country}
                                rounded
                                border
                                required
                                backgroundTransparent
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeCountryState(e, artist["@key"])}
                            />
                            <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickChangeArtistLocation(event, artist["@key"])} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                <FontAwesomeIcon icon={faPen} />
                            </Button>
                        </Fieldset>
                        <Fieldset flex itemsCenter gapX2>
                            <H2 textXl>Albuns</H2>
                            <Span>{artist.albuns?.length}</Span>
                        </Fieldset>
                    </Divider>
                    <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickDeleteArtist(event, artist["@key"])} deleteBackgroundColor flex justifyCenter itemsCenter roundedB textWhite gapX2>
                        DELETE
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </Section>
                <Aside flex flexColumn widthFourFiveDesktop>
                    <Divider flex gap2>
                        {artist && artist.albuns && (
                            artist.albuns.map((element: ApiInformation, key: number) => {
                                return <Divider flex flexCol backgroundGray border rounded gap2 key={key}>
                                    <Divider flex gapX2>
                                        <Figure flex justifyCenter widthOneSixDesktop>
                                            <Image src={CountryRoads} />
                                        </Figure>
                                        <Divider flex flexCol justifyBetween>
                                            <Fieldset flex flexColumn>
                                                <H1 text3xl>{element.name}</H1>
                                            </Fieldset>
                                            <Fieldset flex gapX2 height7>
                                                <Input
                                                    type="number"
                                                    id={`album-year-${element["@key"]}`}
                                                    name={`album-year-${element["@key"]}`}
                                                    value={element.year}
                                                    required
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAlbumYear(e, element["@key"])}
                                                    rounded border backgroundTransparent />
                                                <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickChangeAlbumYear(event, element["@key"])} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                                    <FontAwesomeIcon icon={faPen} />
                                                </Button>
                                            </Fieldset>
                                            <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeleteAlbum(event, element["@key"])} deleteBackgroundColor flex justifyCenter itemsCenter textWhite gapX2>
                                                DELETE
                                                <FontAwesomeIcon icon={faTrash} /></Button>
                                        </Divider>

                                    </Divider>
                                    <Divider flex justifyCenter itemsCenter heightFull>
                                        {renderSongs(element)}
                                    </Divider>
                                </Divider>
                            })
                        )}
                    </Divider>
                </Aside>
            </Divider>
        )}
    </>
}

export default Artist;