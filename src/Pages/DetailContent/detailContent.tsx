import React, { useEffect, useState } from "react";
import { DetailContentInterface } from "./Interface";
import renderizeLoading from "../../common/renderizeLoading";
import Divider from "../../components/Divider/Divider";
import ModalCreate from "../Modal/ModalCreate";
import { ModalCreateInputInterface, ModalCreateInterface } from "../Modal/Interface";
import Section from "../../components/Section/Section";
import Figure from "../../components/Figure/Figure";
import H2 from "../../components/H2/H2";
import Fieldset from "../../components/Fieldset/Fieldset";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../components/Input/Input";
import { faLocationDot, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import Image from "../../components/Image/Image";
import Span from "../../components/Span/Span";
import Aside from "../../components/Aside/Aside";
import H4 from "../../components/H4/H4";
import { ApiInformation } from "../../interfaces/ApiInformation";
import H1 from "../../components/H1/H1";
import Table from "../../components/Table/Table";
import Thead from "../../components/Table/Thead";
import TableTr from "../../components/Table/Tr";
import TableTh from "../../components/Table/Th";
import Tbody from "../../components/Table/Tbody";
import TableTd from "../../components/Table/Td";
import Label from "../../components/Label/Label";

// Used for Artist, Album and Playlist pages
const DetailContent: React.FC<DetailContentInterface> = ({ externalData, type, loading, paramsModalCreate, handleSendModal, handleClickChangeArtistLocation, handleClickDeleteArtist, handleAddAlbum, handleClickChangeAlbumYear, handleDeleteAlbum, handleDeleteSong, handleChangeCountryState, handleChangeAlbumYear, handleAddSong, handleChangePrivate, handleDeletePlaylist }: DetailContentInterface) => {
    const [modalCreateParams, setModalCreateParams] = useState<ModalCreateInterface>(paramsModalCreate);
    const [data, setData] = useState<ApiInformation>({
        "@assetType": "",
        assetType: "",
        "@key": "",
        key: "",
        name: '',
        lastTouchBy: "",
        lastTx: "",
        lastUpdated: "",
        image: "",
        albuns: []
    });

    const isArtist: boolean = type === "artist";
    const isAlbum: boolean = type === "album";
    const isPlaylist: boolean = type === "playlist";

    useEffect(() => {
        console.log("TIVE ALTERACAO")
        setData(externalData);
    }, [externalData])

    useEffect(() => {
        handleOpenModalAdd(paramsModalCreate)
    }, [paramsModalCreate])

    const handleOpenModalAdd = (paramsModalCreate: ModalCreateInterface) => {
        setModalCreateParams(paramsModalCreate);
    }

    const closeModalAdd = () => {
        setModalCreateParams({
            ...modalCreateParams,
            open: false,
            title: "",
            tag: "",
            buttonConfirm: false,
            buttonConfirmText: ""
        });
    }

    const handleCancelModalAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
        closeModalAdd();
    }

    const renderSongs = (element: ApiInformation) => {
        if (!element.songs || element.songs.length === 0) {
            return (
                <Divider flex justifyCenter itemsCenter>
                    <Span>Nothing registered there.</Span>
                </Divider>
            );
        }

        const renderTableHeaders = (headers: string[]) => (
            <Thead backgroundGray textWhite>
                <TableTr>
                    {headers.map((header, index) => (
                        <TableTh key={index}>{header}</TableTh>
                    ))}
                </TableTr>
            </Thead>
        );

        const renderTableRows = (songs: ApiInformation[], showArtistAlbum: boolean) =>
            songs.map((song, index) => {
                if (!song.album || (showArtistAlbum && !song.artist)) return null;

                return (
                    <TableTr key={song["@key"]} rowKey={song["@key"]} backgroundStripedGray>
                        <TableTd>{index + 1}</TableTd>
                        <TableTd>{song.name}</TableTd>
                        {showArtistAlbum && (
                            <>
                                <TableTd>{song.artist?.name}</TableTd>
                                <TableTd>{song.album.name}</TableTd>
                            </>
                        )}
                        <TableTd>
                            <Button
                                type="button"
                                icon
                                deleteBackgroundColor
                                textWhite
                                rounded
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                                    handleDeleteSong(event, song["@key"])
                                }
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </TableTd>
                    </TableTr>
                );
            });

        const tableHeaders = isPlaylist
            ? ["#", "Song", "Artist", "Album", ""]
            : ["#", "Song", ""];

        return (
            <Table widthFull textCenter>
                {renderTableHeaders(tableHeaders)}
                <Tbody>{renderTableRows(element.songs, isPlaylist)}</Tbody>
            </Table>
        );
    };

    return <>
        {renderizeLoading(loading)}
        <Divider flex flexColMobile flexRowDesktop paddingY2 gap2>
            {
                modalCreateParams.open && (
                    <ModalCreate
                        open={modalCreateParams.open}
                        title={modalCreateParams.title}
                        tag={modalCreateParams.tag}
                        onCancel={handleCancelModalAdd}
                        onConfirm={(e: React.FormEvent, data: ModalCreateInputInterface) => handleSendModal(e, data)}
                        buttonConfirm={modalCreateParams.buttonConfirm}
                        buttonConfirmText={modalCreateParams.buttonConfirmText}
                        options={modalCreateParams.options}
                        apiData={modalCreateParams.apiData}
                        createOutsideHome={isPlaylist}
                    />
                )
            }
            <Section flex flexColMobile flexRowTablet flexColDesktop widthOneFiveDesktop>
                <Figure flex justifyCenter itemsCenter widthFullMobile width50PercentTablet widthFullDesktop>
                    <Image src={data.image} roundedTMobile roundedTlTablet roundedTDesktop />
                </Figure>
                <Divider flex flexCol flex1>
                    <Divider flex flexCol widthFull backgroundGray padding2 flex1Tablet>
                        <H2 textXl>{data.name}</H2>

                        {isAlbum && handleChangeAlbumYear && handleClickChangeAlbumYear && (
                            <>
                                <Fieldset flex itemsCenter gapX2>
                                    <Span>{data.artist?.name}</Span>
                                </Fieldset>

                                <Fieldset flex flexColumn gapX2>
                                    <Label for={`album-year-${data["@key"]}`}>Year</Label>
                                    <Divider flex gap2>
                                        <Input
                                            type="number"
                                            id={`album-year-${data["@key"]}`}
                                            name={`album-year-${data["@key"]}`}
                                            value={data.year ?? ""}
                                            required
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAlbumYear(e, data["@key"])}
                                            rounded border backgroundTransparent />
                                        <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickChangeAlbumYear(event, data["@key"])} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                            <FontAwesomeIcon icon={faPen} />
                                        </Button>
                                    </Divider>
                                </Fieldset>
                            </>
                        )}

                        {isArtist && handleChangeCountryState && handleClickChangeArtistLocation && (
                            <>
                                <Fieldset flex itemsCenter gapX2 height7>
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    <Input
                                        type="text"
                                        id="artist-country"
                                        name="country"
                                        value={data.country || ""}
                                        rounded
                                        border
                                        required
                                        backgroundTransparent
                                        maxWidth70PercentDesktop
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setData({ ...data, country: e.target.value })
                                            handleChangeCountryState(e, data["@key"]);
                                        }}
                                    />
                                    <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClickChangeArtistLocation(event, data["@key"])} icon editBackgroundColor flex justifyCenter itemsCenter rounded textWhite>
                                        <FontAwesomeIcon icon={faPen} />
                                    </Button>
                                </Fieldset>

                                <Fieldset flex itemsCenter gapX2>
                                    <H2 textXl>Albuns</H2>
                                    <Span>{data.albuns?.length}</Span>
                                </Fieldset>
                            </>
                        )}

                        {isPlaylist && handleChangePrivate && (
                            <Fieldset flex gapX2>
                                <Label for={`private`}>Private</Label>
                                <Input type="checkbox"
                                    id={`private`}
                                    name={`private`}
                                    checked={data.private || false}
                                    //value={undefined}
                                    onChange={handleChangePrivate} border />
                            </Fieldset>
                        )}
                    </Divider>

                    <Button type="button"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            console.log(event)
                            if (isArtist && handleClickDeleteArtist) handleClickDeleteArtist(event, data["@key"])
                            else if (isAlbum && handleDeleteAlbum) handleDeleteAlbum(event, data["@key"])
                            else if (isPlaylist && handleDeletePlaylist) handleDeletePlaylist(event, data["@key"])
                        }} deleteBackgroundColor flex justifyCenter itemsCenter roundedB roundedBNoneTablet roundedBrTablet textWhite gapX2>
                        DELETE
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </Divider>

            </Section>
            <Aside flex flexColumn widthFourFiveDesktop>
                <Divider flex flexCol gap2>
                    <Divider flex justifyBetween itemsCenter>
                        <H4 textXl>{String(type).charAt(0).toUpperCase() + String(type).slice(1)}</H4>
                        <Button
                            type="button"
                            rounded textWhite uppercase border paddingX2 successBackgroundColor
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                if (isArtist && handleAddAlbum) handleAddAlbum(event, data["@key"])
                                else if ((isAlbum || isPlaylist) && handleAddSong) handleAddSong(event, data["@key"])
                            }}
                        > {(() => {
                            if (isArtist) return "Add Album";
                            if (isAlbum || isPlaylist) return "Add Song";
                            return "Add Item";
                        })()}</Button>
                    </Divider>
                    <Divider flex={isAlbum || isPlaylist} grid={isArtist} gridColsAlbunsArtist={isArtist} gap2>
                        {isArtist && handleClickChangeAlbumYear && handleChangeAlbumYear && handleDeleteAlbum && (
                            <>
                                {data && data.albuns && (
                                    data.albuns.map((element: ApiInformation, key: number) => {
                                        return <Divider flex flexCol backgroundGray border rounded gap2 key={key}>
                                            <Divider flex gapX2>
                                                <Figure flex justifyCenter widthOneSixDesktop widthFullMobile width50PercentTablet>
                                                    <Image src={element.image} />
                                                </Figure>
                                                <Divider flex flexCol flex1 justifyBetween>
                                                    <Divider flex flexCol>
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
                                                    </Divider>

                                                    <Button type="button" onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeleteAlbum(event, element["@key"])} deleteBackgroundColor flex justifyCenter itemsCenter textWhite gapX2>
                                                        DELETE
                                                        <FontAwesomeIcon icon={faTrash} /></Button>
                                                </Divider>

                                            </Divider>
                                            <Divider flex justifyCenter itemsStart>
                                                {renderSongs(element)}
                                            </Divider>
                                        </Divider>
                                    })
                                )}
                            </>
                        )}
                        {(isAlbum || isPlaylist) && (
                            <>
                                {renderSongs(data)}
                            </>
                        )}
                    </Divider>
                </Divider>
            </Aside>
        </Divider>
    </>
}

export default DetailContent;