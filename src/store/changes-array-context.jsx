import { createContext, useContext, useEffect, useState } from "react";
import { BlocksArrayContext } from "./block-array-context";
import { OptionsContext } from "./options-context";
import { ConnectorsArrayContext } from "./connector-array-context";

export const ChangesContext = createContext({
    undo: () => {},
    redo: () => {},
});

export default function ChangesContextProvider({ children, ...restProps }) {
    const optionsContext = useContext(OptionsContext);

    const blocksArrayContext = useContext(BlocksArrayContext);

    const connectorsArrayContext = useContext(ConnectorsArrayContext);

    const [isCtrl, setIsCtrl] = useState(false);

    const [isZ, setIsZ] = useState(false);

    const [isY, setIsY] = useState(false);

    const [isC, setIsC] = useState(false);
    
    const [isV, setIsV] = useState(false);

    useEffect(() => {
        function keyDownHandler(e) {

            if (e.keyCode === 17) {
                setIsCtrl(true);
            } else if (e.keyCode === 90 && e.key !== 'ż' && e.key !== 'Ż') {
                setIsZ(true);
            } else if (e.keyCode === 89) {
                setIsY(true);
            } else if (e.keyCode === 67 && e.key !== 'ć' && e.key !== 'Ć') {
                setIsC(true);
            } else if (e.keyCode === 86) {
                setIsV(true);
            }  
        }

        function keyUpHandler(e) {
            if (e.keyCode === 17) {
                setIsCtrl(false);
            } else if (e.keyCode === 90) {
                setIsZ(false);
            } else if (e.keyCode === 89) {
                setIsY(false);
            } else if (e.keyCode === 67) {
                setIsC(false);
            } else if (e.keyCode === 86) {
                setIsV(false);
            } 
        }

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        return function cleanup() {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        };
    }, []);

    useEffect(() => {
        if (isCtrl && isZ) {
            undoHandler();
        } else if (isCtrl && isY) {
            redoHandler();
        } else if (isCtrl && isC) {
            //
        } else if (isCtrl && isV) {
            //
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCtrl]);

    function undoHandler() {
        if (optionsContext.changesArrayPointer > 0) {

            if(optionsContext.isConnectingModeActive) {
                return;
            }

            optionsContext.undo();

            const changeObj = optionsContext.changesArray[optionsContext.changesArrayPointer - 1];

            if (changeObj.culprit === "block") {
                switch (changeObj.type) {
                    case "add":
                        if(changeObj.prevState.id === optionsContext.formElement.elementObject?.id){
                            optionsContext.setFormElement(null, null);
                        }
                        blocksArrayContext.updateBlockStyles(changeObj.prevState.id, changeObj.prevState.styleName, changeObj.prevState.styleValue, changeObj.prevState.isValidValue);
                        break;
                    case "delete":
                        blocksArrayContext.updateBlockStyles(changeObj.prevState.id, changeObj.prevState.styleName, changeObj.prevState.styleValue, changeObj.prevState.isValidValue);
                        break;
                    case "changePosition":
                        blocksArrayContext.updateBlockPosition(changeObj.prevState.id, changeObj.prevState.position);
                        break;
                    case "changeStyle":
                        blocksArrayContext.updateBlockStyles(changeObj.prevState.id, changeObj.prevState.styleName, changeObj.prevState.styleValue, changeObj.prevState.isValidValue);
                        break;
                    case "changeContent":
                        blocksArrayContext.updateBlockContent(changeObj.prevState.id, changeObj.prevState.content);
                        break;
                    case "changeStyleGrouped":
                        changeObj.prevState.map((state) => {
                            blocksArrayContext.updateBlockStyles(state.id, state.styleName, state.styleValue, state.isValidValue);
                        });
                        break;
                    case "changePositionGrouped":
                        changeObj.prevState.map((state) => {
                            blocksArrayContext.updateBlockPosition(state.id, state.position);
                        });
                        break;
                    case "changeType":
                        blocksArrayContext.changeBlockType(changeObj.prevState.id, changeObj.prevState.value);
                        blocksArrayContext.updateBlockStyles(changeObj.prevState.id, 'width', changeObj.prevState.width, true);
                        blocksArrayContext.updateBlockStyles(changeObj.prevState.id, 'height', changeObj.prevState.height, true);
                        break;
                    case "changeTypeGrouped":
                        changeObj.prevState.map((state) => {
                            blocksArrayContext.changeBlockType(state.id, state.value);
                            blocksArrayContext.updateBlockStyles(state.id, 'width', state.width, true);
                            blocksArrayContext.updateBlockStyles(state.id, 'height', state.height, true);
                        });
                        break;
                    default:
                        break;
                }
            } else if (changeObj.culprit === "connector") {
                switch (changeObj.type) {
                    case "add":
                        if(changeObj.prevState.id === optionsContext.formElement.elementObject?.id){
                            optionsContext.setFormElement(null, null);
                        }
                        connectorsArrayContext.updateConnectorStyle(changeObj.prevState.id, changeObj.prevState.styleName, changeObj.prevState.styleValue, true);
                        break;
                    case "delete":
                        connectorsArrayContext.updateConnectorStyle(changeObj.prevState.id, changeObj.prevState.styleName, changeObj.prevState.styleValue, true);
                        break;
                    case "changeStyle":
                        connectorsArrayContext.updateConnectorStyle(changeObj.prevState.id, changeObj.prevState.styleName, changeObj.prevState.styleValue, true);
                        break;
                    default:
                        break;
                }
            }

            blocksArrayContext.toggleUserModificationIndicator(false);
            connectorsArrayContext.toggleUserModificationIndicator(false);
        }
    }

    function redoHandler() {
        if (optionsContext.changesArrayPointer !== optionsContext.changesArray.length) {

            if(optionsContext.isConnectingModeActive) {
                return;
            }

            optionsContext.redo();

            const changeObj = optionsContext.changesArray[optionsContext.changesArrayPointer];

            if (changeObj.culprit === "block") {
                switch (changeObj.type) {
                    case "add":
                        blocksArrayContext.updateBlockStyles(changeObj.newState.id, changeObj.newState.styleName, changeObj.newState.styleValue, true);
                        break;
                    case "delete":
                        blocksArrayContext.updateBlockStyles(changeObj.newState.id, changeObj.newState.styleName, changeObj.newState.styleValue, true);
                        break;
                    case "changePosition":
                        blocksArrayContext.updateBlockPosition(changeObj.newState.id, changeObj.newState.position);
                        break;
                    case "changeStyle":
                        blocksArrayContext.updateBlockStyles(changeObj.newState.id, changeObj.newState.styleName, changeObj.newState.styleValue, true);
                        break;
                    case "changeContent":
                        blocksArrayContext.updateBlockContent(changeObj.newState.id, changeObj.newState.content);
                        break;
                    case "changeStyleGrouped":
                        changeObj.newState.map((state) => {
                            blocksArrayContext.updateBlockStyles(state.id, state.styleName, state.styleValue, state.isValidValue);
                        });
                        break;
                    case "changePositionGrouped":
                        changeObj.newState.map((state) => {
                            blocksArrayContext.updateBlockPosition(state.id, state.position);
                        });
                        break;
                    case "changeType":
                        blocksArrayContext.changeBlockType(changeObj.newState.id, changeObj.newState.value);
                        break;
                    case "changeTypeGrouped":
                        changeObj.newState.map((state) => {
                            blocksArrayContext.changeBlockType(state.id, state.value);
                        });
                        break;
                    default:
                        break;
                }
            } else if (changeObj.culprit === "connector") {
                switch (changeObj.type) {
                    case "add":
                        connectorsArrayContext.updateConnectorStyle(changeObj.newState.id, changeObj.newState.styleName, changeObj.newState.styleValue, true);
                        break;
                    case "delete":
                        connectorsArrayContext.updateConnectorStyle(changeObj.newState.id, changeObj.newState.styleName, changeObj.newState.styleValue, true);
                        break;
                    case "changeStyle":
                        connectorsArrayContext.updateConnectorStyle(changeObj.newState.id, changeObj.newState.styleName, changeObj.newState.styleValue, true);
                        break;
                    default:
                        break;
                }
            }

            blocksArrayContext.toggleUserModificationIndicator(false);
            connectorsArrayContext.toggleUserModificationIndicator(false);
        }
    }

    const ctxValue = {
        undo: undoHandler,
        redo: redoHandler,
    };

    return (
        <ChangesContext.Provider value={ctxValue} {...restProps}>
            {children}
        </ChangesContext.Provider>
    );
}
