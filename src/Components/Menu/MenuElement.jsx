import style from "./MenuElement.module.css";
import { useContext, useState } from "react";
import { BlocksArrayContext } from "../../store/block-array-context";
import Button from "../Misc/Button";
import FormBlock from "../Forms/FormBlock";
import FormConnector from "../Forms/FormConnector";
import { ConnectorsArrayContext } from "../../store/connector-array-context";
import FormProject from "../Forms/FormProject";
import { OptionsContext } from "../../store/options-context";

export default function MenuElement({ title, elementType }) {
    const blocksArrayContext = useContext(BlocksArrayContext);

    const optionsContext = useContext(OptionsContext);

    const blockInitialStyles = blocksArrayContext.customDefaultStyles.find((style) => style.type === elementType);

    const connectorsArrayContext = useContext(ConnectorsArrayContext);

    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <div>
            <div className={style.container}>
                <div className={style.title} onClick={() => setIsFormVisible(!isFormVisible)}>
                    {title}
                </div>
                <div className={style.buttons}>
                    {elementType !== "connector" && elementType !== "projekt" && (
                            <Button onClick={() => blocksArrayContext.addNewBlock(elementType)} type="plus"/>
                    )}
                    {elementType === "connector" && !optionsContext.isConnectingModeActive && (
                            <Button type="plus" onClick={() => blocksArrayContext.blocksArray.length > 1 ? optionsContext.toggleConnectingMode(true) : undefined} isDisabled={blocksArrayContext.blocksArray.length < 2}/>
                    )}
                    {elementType === "connector" && optionsContext.isConnectingModeActive && (
                            <Button type="X" onClick={() => optionsContext.toggleConnectingMode(false)}/>
                    )}
                    <Button type="pencil" onClick={() => setIsFormVisible(!isFormVisible)}/>
                </div>
            </div>
            {isFormVisible && elementType === "projekt" && (
                <FormProject />
            )}
            {isFormVisible && elementType === "connector" && (
                <FormConnector elementObject={connectorsArrayContext.customDefaultStyles} type="default"/>
            )}
            {isFormVisible && elementType !== "connector" && elementType !== "projekt" && (
                    <FormBlock blockObject={blockInitialStyles} type="default" blocksArray={[]}/>
            )}
        </div>
    );
}
