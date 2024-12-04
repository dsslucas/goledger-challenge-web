import React, { useState } from "react";
import { ModalCreateInputInterface, ModalCreateInterface } from "./Interface";
import Fieldset from "../../components/Fieldset/Fieldset";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";

const ModalCreate: React.FC<ModalCreateInterface> = (props: ModalCreateInterface) => {
    const [formData, setFormData] = useState<ModalCreateInputInterface>({
        name: '',
        country: '',
    });

    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });        
    }

    return <form id="modalAdd" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onSubmit={props.onConfirm}>
        <div className="bg-white w-11/12 max-w-md mx-auto rounded-lg shadow-lg">

            <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-semibold">{props.title}</h3>
            </div>

            <div className="p-4">
                {props.tag === "artist" && (
                    <>
                        <Fieldset flex flexColumn>
                            <Label for={`${props.tag}_name`}>Nome</Label>
                            <Input
                                type="text"
                                id={`${props.tag}_name`}
                                name={`name`}
                                value={formData.name}
                                onChange={handleChangeEvent} border />
                        </Fieldset>
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

            </div>

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