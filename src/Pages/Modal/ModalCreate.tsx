import React, { useEffect, useState } from "react";
import { ModalCreateInputInterface, ModalCreateInterface } from "./Interface";
import Fieldset from "../../components/Fieldset/Fieldset";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { InputField } from "../../components/Input/Interface";
import Divider from "../../components/Divider/Divider";
import H2 from "../../components/H2/H2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import Span from "../../components/Span/Span";
import H4 from "../../components/H4/H4";
import { ApiInformation } from "../../interfaces/ApiInformation";
import Thead from "../../components/Table/Thead";
import Tbody from "../../components/Table/Tbody";
import TableTr from "../../components/Table/Tr";
import TableTh from "../../components/Table/Th";
import TableTd from "../../components/Table/Td";
import Table from "../../components/Table/Table";

const ModalCreate: React.FC<ModalCreateInterface> = (props: ModalCreateInterface) => {
    const tagArtist = (props.tag === "artist");
    const tagAlbum = (props.tag === "album");
    const tagSong = (props.tag === "song");
    const tagPlaylist = (props.tag === "playlist");

    const rootElement = document.getElementById('root') as HTMLElement;

    if (props.open) rootElement.style.overflow = 'hidden';
    else rootElement.style.overflow = 'auto';

    const [formData, setFormData] = useState<ModalCreateInputInterface>({
        name: '',
        country: '',
        idArtist: "",
        idAlbum: "",
        year: undefined,
        songs: [],
        private: false
    });

    const [inputs, setInputs] = useState<InputField[]>([{ id: 1, value: '' }]);

    const handleSelectSong = (event: React.ChangeEvent<HTMLInputElement>, songId: string) => {
        const checked: boolean = event.target.checked;
        var updates = inputs;
        var newInputData = {
            id: Date.now(),
            value: songId
        }

        if (checked) {
            updates = [...updates, newInputData];
        }
        else {
            updates = updates.filter((element: InputField) => element.value !== newInputData.value);
        }

        setInputs(updates);
        setFormData({
            ...formData,
            songs: updates
        });
    }

    const handleChangeDynamicInputSong = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setInputs(
            inputs.map((input) =>
                input.id === id ? { ...input, value: event.target.value } : input
            )
        );

        setFormData({
            ...formData,
            songs: inputs
        })
    };

    const handleAddDynamicInput = () => {
        setInputs([...inputs, { id: Date.now(), value: '' }]);
    };

    const handleRemoveDynamicEventDelete = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        setInputs(inputs.filter(item => item.id !== id));
    };

    const handleChangePrivate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, private: !formData.private })
    }

    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (event && formData && props.onConfirm) {
            props.onConfirm(event, formData);
        }
    }

    useEffect(() => {
        if (tagPlaylist) setInputs([]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <form id="modalAdd" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onSubmit={handleSubmit}>
        <div className="bg-white w-11/12 max-w-xl mx-auto rounded-lg shadow-lg max-h-[80%] overflow-hidden">

            <div className="flex justify-between items-center border-b p-4">
                <H2 textXl>{props.title}</H2>
            </div>

            <Divider flex flexCol padding4 gap2 overflowHidden>
                <Divider flex flexCol={tagArtist || tagAlbum || tagSong || tagPlaylist} gap2 flex1>
                    {props.tag === "album" && !props.createOutsideHome && (
                        <H2 textXl>Album data</H2>
                    )}
                    {props.tag !== "song" && !props.createOutsideHome && (
                        <Fieldset flex flexColumn>
                            <Label for={`${props.tag}_name`}>Name</Label>
                            <Input
                                type="text"
                                id={`${props.tag}_name`}
                                name={`name`}
                                value={formData.name}
                                required
                                onChange={handleChangeEvent}
                                border rounded
                            />
                        </Fieldset>
                    )}

                    {tagArtist && !props.createOutsideHome && (
                        <>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_country`}>Country</Label>
                                <Input type="text"
                                    id={`${props.tag}_country`}
                                    name={`country`}
                                    value={formData.country}
                                    required
                                    onChange={handleChangeEvent}
                                    border rounded
                                />
                            </Fieldset>
                        </>
                    )}
                    {tagAlbum && !props.createOutsideHome && (
                        <>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_artist`}>Artist</Label>
                                <Select
                                    id={`${props.tag}_artist`}
                                    name={`idArtist`}
                                    value={formData.idArtist}
                                    onChange={handleChangeEvent}
                                    options={props.options}
                                    border rounded
                                />
                            </Fieldset>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_year`}>Year</Label>
                                <Input type="number"
                                    id={`${props.tag}_year`}
                                    name={`year`}
                                    value={formData.year}
                                    required
                                    onChange={handleChangeEvent}
                                    border rounded
                                />
                            </Fieldset>
                        </>
                    )}
                    {tagSong && !props.createOutsideHome && (
                        <>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_album`}>Album</Label>
                                <Select
                                    id={`${props.tag}_album`}
                                    name={`idAlbum`}
                                    value={formData.idAlbum}
                                    onChange={handleChangeEvent}
                                    options={props.options}
                                    border rounded
                                />
                            </Fieldset>
                        </>
                    )}
                    {tagPlaylist && !props.createOutsideHome && (
                        <>
                            <Fieldset flex gapX2>
                                <Label for={`${props.tag}_private`}>Private</Label>
                                <Input type="checkbox"
                                    id={`${props.tag}_private`}
                                    name={`private`}
                                    checked={formData.private}
                                    //value={undefined}                                    
                                    onChange={handleChangePrivate}
                                    border rounded
                                />
                            </Fieldset>
                        </>
                    )}
                </Divider>
                {tagPlaylist && (
                    <Divider flex flexCol={tagPlaylist} flex1 gap2>
                        <H4 textXl>Songs</H4>

                        <Divider maxHeight52 overflowY overflowXHidden>
                            <Table textCenter widthFull>
                                <Thead top0 sticky backgroundGray textWhite>
                                    <TableTr>
                                        <TableTh>#</TableTh>
                                        <TableTh>Name</TableTh>
                                        <TableTh>Artist</TableTh>
                                        <TableTh>Album</TableTh>
                                    </TableTr>
                                </Thead>
                                <Tbody>
                                    {props.apiData?.map((apiData: ApiInformation, index: number) => {
                                        return <TableTr key={apiData["@key"]} backgroundStripedGray>
                                            <TableTd>
                                                <Input
                                                    type="checkbox" id={`checkbox_${index}`} name={`checkbox_${index}`}
                                                    value={undefined}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSelectSong(event, apiData["@key"])} />
                                            </TableTd>
                                            <TableTd>{apiData.name}</TableTd>
                                            <TableTd>{apiData.artist?.name}</TableTd>
                                            <TableTd>{apiData.album?.name}</TableTd>
                                        </TableTr>
                                    })}
                                </Tbody>
                            </Table>
                        </Divider>
                    </Divider>
                )}

                {(tagAlbum || tagSong) && (
                    <Divider flex flexCol={tagAlbum || tagSong} flex1 gap2>
                        <H2 textXl>Songs</H2>
                        <div className="flex flex-col gap-2 overflow-auto max-h-80" id="songs-dynamic">
                            {inputs.map((input, index: number) => (
                                <Divider key={input.id} flex justifyBetween gapX2>
                                    <Divider flex gapX2 flex1>
                                        <Span>{index + 1}</Span>
                                        <Input
                                            type="text"
                                            id={input.id.toString()}
                                            name={`song_${index}`}
                                            value={input.value}
                                            onChange={(e) => handleChangeDynamicInputSong(e, input.id)}
                                            border rounded    
                                            widthFull
                                        />
                                    </Divider>
                                    <Divider flex gap2 width12Percent justifyEnd>
                                        {index !== 0 && (
                                            <Button type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleRemoveDynamicEventDelete(e, input.id)} deleteBackgroundColor textWhite icon rounded>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        )}
                                        <Button type="button" onClick={handleAddDynamicInput} infoBackgroundColor textWhite icon rounded>
                                            <FontAwesomeIcon icon={faAdd} />
                                        </Button>
                                    </Divider>
                                </Divider>
                            ))}
                        </div>
                    </Divider>
                )}
            </Divider>

            <div className="flex justify-end border-t p-4 gap-2">
                <button onClick={props.onCancel} className="bg-gray-100 border border-solid px-4 py-2 rounded hover:bg-gray-200">Close</button>
                {props.buttonConfirm && (
                    <button type="submit" className="bg-success border border-solid px-4 py-2 rounded">{props.buttonConfirmText}</button>
                )}
            </div>
        </div>
    </form>

}

export default ModalCreate;