import React, { useState } from "react";
import { ModalCreateInputInterface, ModalCreateInterface } from "./Interface";
import Fieldset from "../../components/Fieldset/Fieldset";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { InputField, InputInterface } from "../../components/Input/Interface";
import Divider from "../../components/Divider/Divider";
import H2 from "../../components/H2/H2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import Span from "../../components/Span/Span";
import H4 from "../../components/H4/H4";

const ModalCreate: React.FC<ModalCreateInterface> = (props: ModalCreateInterface) => {
    const [formData, setFormData] = useState<ModalCreateInputInterface>({
        name: '',
        country: '',
        idArtist: "",
        idAlbum: "",
        year: undefined,
        songs: []
    });

    const [inputs, setInputs] = useState<InputField[]>([{ id: 1, value: '' }]);

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

    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (event && formData && props.onConfirm) {
            console.log("O QUE FOI ENVIADO PARA O MÉTODO: ", formData)
            props.onConfirm(event, formData);
        }
    }

    const tagArtist = (props.tag === "artist");
    const tagAlbum = (props.tag === "album")
    const tagSong = (props.tag === "song");
    const tagPlaylist = (props.tag === "playlist");

    return <form id="modalAdd" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onSubmit={handleSubmit}>
        <div className="bg-white w-11/12 max-w-xl mx-auto rounded-lg shadow-lg">

            <div className="flex justify-between items-center border-b p-4">
                <H2 textXl>{props.title}</H2>
            </div>

            <Divider flex flexCol={tagPlaylist} padding4 gap2 maxHeight80 overflowHidden>
                <Divider flex flexCol={tagArtist || tagAlbum || tagSong || tagPlaylist} gap2 flex1>
                    {props.tag === "album" && (
                        <H2 textXl>Album data</H2>
                    )}
                    {props.tag !== "song" && (
                        <Fieldset flex flexColumn>
                            <Label for={`${props.tag}_name`}>Nome</Label>
                            <Input
                                type="text"
                                id={`${props.tag}_name`}
                                name={`name`}
                                value={formData.name}
                                onChange={handleChangeEvent} border />
                        </Fieldset>
                    )}

                    {tagArtist && (
                        <>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_country`}>País</Label>
                                <Input type="text"
                                    id={`${props.tag}_country`}
                                    name={`country`}
                                    value={formData.country}
                                    onChange={handleChangeEvent} border />
                            </Fieldset>
                        </>
                    )}
                    {tagAlbum && (
                        <>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_artist`}>Artista</Label>
                                <Select
                                    id={`${props.tag}_artist`}
                                    name={`idArtist`}
                                    value={formData.idArtist}
                                    onChange={handleChangeEvent}
                                    options={props.options}
                                    border
                                />
                            </Fieldset>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_year`}>Ano</Label>
                                <Input type="number"
                                    id={`${props.tag}_year`}
                                    name={`year`}
                                    value={formData.year}
                                    onChange={handleChangeEvent} border />
                            </Fieldset>
                        </>
                    )}
                    {tagSong && (
                        <>
                            <Fieldset flex flexColumn>
                                <Label for={`${props.tag}_album`}>Album</Label>
                                <Select
                                    id={`${props.tag}_artist`}
                                    name={`idAlbum`}
                                    value={formData.idAlbum}
                                    onChange={handleChangeEvent}
                                    options={props.options}
                                    border
                                />
                            </Fieldset>
                        </>
                    )}
                </Divider>
                {tagPlaylist && (
                    <Divider flex flexCol={tagPlaylist} flex1 gap2>
                        <H4 textXl>Songs</H4>

                        <table className="text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Artista</th>
                                    <th>Album</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><Input type="checkbox" id="checkbox_0" name="checkbox_0" value={undefined} onChange={() => null}/></td>
                                    <td>Olhos de Lua</td>
                                    <td>Zezé</td>
                                    <td>1993</td>
                                </tr>
                            </tbody>
                        </table>
                    </Divider>
                )}

                {tagAlbum || tagSong && (
                    <Divider flex flexCol={tagAlbum || tagSong} flex1 gap2>
                        <H2 textXl>Songs</H2>
                        <div className="flex flex-col gap-2 h-full overflow-y-auto">
                            {inputs.map((input, index: number) => (
                                <Divider key={input.id} flex justifyBetween>
                                    <Divider flex gapX2>
                                        <Span>{index + 1}</Span>
                                        <Input
                                            type="text"
                                            id={input.id.toString()}
                                            name={`song_${index}`}
                                            value={input.value}
                                            onChange={(e) => handleChangeDynamicInputSong(e, input.id)}
                                            border rounded
                                            width36
                                        />
                                    </Divider>
                                    <Divider flex gap2>
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
                <button onClick={props.onCancel} className="bg-gray-100 border border-solid px-4 py-2 rounded hover:bg-gray-200">Fechar</button>
                {props.buttonConfirm && (
                    <button type="submit" className="bg-success border border-solid px-4 py-2 rounded">{props.buttonConfirmText}</button>
                )}
            </div>
        </div>
    </form>

}

export default ModalCreate;