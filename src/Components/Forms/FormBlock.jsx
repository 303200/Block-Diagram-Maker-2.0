import { useContext, useEffect, useRef, useState } from "react";
import { BlocksArrayContext } from "../../store/block-array-context";
import styles from "./Form.module.css";
import { OptionsContext } from "../../store/options-context";

export default function Form({ blockObject, type, blocksArray }) {
    const blocksArrayContext = useContext(BlocksArrayContext);
    const optionsContext = useContext(OptionsContext);

    const [blockId, setBlockId] = useState(blockObject.id);
    const [blocksArrayPrevState, setBlocksArrayPrevState] = useState(JSON.parse(JSON.stringify(blocksArray)));

    const [backgroundColor, setBackGroundColor] = useState(blockObject.style.backgroundColor);
    const [color, setColor] = useState(blockObject.style.color);
    const [borderColor, setBorderColor] = useState(blockObject.style.borderColor);

    const [content, setContent] = useState(blockObject.content);
    const [borderWidth, setBorderWidth] = useState(blockObject.style.borderWidth);
    const [width, setWidth] = useState(blockObject.style.widthValue);
    const [height, setHeight] = useState(blockObject.style.heightValue);

    const contentRef = useRef();

    //pozycja kursora w textArea odpowiedzialnym za zmianę zawartości bloku
    const [cursorPosition, setCursorPosition] = useState(blockObject.content ? blockObject.content.length : 0);

    //ustawienie pozycji kursora w textArea odpowiedzialnym za zamianę zawartości bloku
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.content]);

    useEffect(() => {
        if (!blocksArrayContext.wasModifiedByUser) {
            setBorderWidth(blockObject.style.borderWidth);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.style.borderWidth]);

    useEffect(() => {
        if (type !== "default") {
            let timer = setTimeout(() => {
                let prevState = [];
                let newState = [];

                let obj = {
                    culprit: "block",
                    type: "changeStyle",
                    prevState: {},
                    newState: {},
                };

                if (blockObject.id !== blockId) {
                    return;
                } else if (backgroundColor !== blockObject.style.backgroundColor || blocksArrayPrevState.find((element) => element.style.backgroundColor !== blockObject.style.backgroundColor) !== undefined) {
                    if (type === "grouped") {
                        blocksArrayPrevState.map((element) => {
                            let prevStateElement = {id: element.id, styleName: "backgroundColor", styleValue: element.style["backgroundColor"], isValidValue: true};
                            let newStateElement = {id: element.id, styleName: "backgroundColor", styleValue: blockObject.style.backgroundColor, isValidValue: true};

                            prevState.push(prevStateElement);
                            newState.push(newStateElement);
                        });

                        obj.type = "changeStyleGrouped";
                        obj.prevState = prevState;
                        obj.newState = newState;
                    } else {
                        obj.prevState = {id: blockObject.id, styleName: "backgroundColor", styleValue: backgroundColor, isValidValue: true};
                        obj.newState = {id: blockObject.id, styleName: "backgroundColor", styleValue: blockObject.style.backgroundColor, isValidValue: true};
                    }

                    setBackGroundColor(blockObject.style.backgroundColor);
                } else {
                    return;
                }

                if (blocksArrayContext.wasModifiedByUser) {
                    optionsContext.addToChangesArray(obj);
                }
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.style.backgroundColor]);

    useEffect(() => {
        if (type !== "default") {
            let timer = setTimeout(() => {
                let prevState = [];
                let newState = [];

                let obj = {
                    culprit: "block",
                    type: "changeStyle",
                    prevState: {},
                    newState: {},
                };

                if (blockObject.id !== blockId) {
                    return;
                } else if (color !== blockObject.style.color || blocksArrayPrevState.find((element) => element.style.color !== blockObject.style.color ) !== undefined) {
                    if (type === "grouped") {
                        blocksArrayPrevState.map((element) => {
                            let prevStateElement = {id: element.id, styleName: "color", styleValue: element.style["color"], isValidValue: true};
                            let newStateElement = {id: element.id, styleName: "color", styleValue: blockObject.style.color, isValidValue: true};

                            prevState.push(prevStateElement);
                            newState.push(newStateElement);
                        });

                        obj.type = "changeStyleGrouped";
                        obj.prevState = prevState;
                        obj.newState = newState;
                    } else {
                        obj.prevState = {id: blockObject.id, styleName: "color", styleValue: color, isValidValue: true};
                        obj.newState = {id: blockObject.id, styleName: "color", styleValue: blockObject.style.color, isValidValue: true};
                    }

                    setColor(blockObject.style.color);
                } else {
                    return;
                }

                if (blocksArrayContext.wasModifiedByUser) {
                    optionsContext.addToChangesArray(obj);
                }
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.style.color]);

    useEffect(() => {
        if (type !== "default") {
            let timer = setTimeout(() => {
                let prevState = [];
                let newState = [];

                let obj = {
                    culprit: "block",
                    type: "changeStyle",
                    prevState: {},
                    newState: {},
                };

                if (blockObject.id !== blockId) {
                    return;
                } else if (borderColor !== blockObject.style.borderColor || blocksArrayPrevState.find((element) => element.style.borderColor !== blockObject.style.borderColor) !== undefined) {
                    if (type === "grouped") {
                        blocksArrayPrevState.map((element) => {
                            let prevStateElement = { id: element.id, styleName: "borderColor", styleValue: element.style["borderColor"], isValidValue: true};
                            let newStateElement = {id: element.id, styleName: "borderColor", styleValue: blockObject.style.borderColor, isValidValue: true};

                            prevState.push(prevStateElement);
                            newState.push(newStateElement);
                        });

                        obj.type = "changeStyleGrouped";
                        obj.prevState = prevState;
                        obj.newState = newState;
                    } else {
                        obj.prevState = {id: blockObject.id, styleName: "borderColor", styleValue: borderColor, isValidValue: true};
                        obj.newState = {id: blockObject.id, styleName: "borderColor", styleValue: blockObject.style.borderColor, isValidValue: true};
                    }
                    setBorderColor(blockObject.style.borderColor);
                } else {
                    return;
                }

                if (blocksArrayContext.wasModifiedByUser) {
                    optionsContext.addToChangesArray(obj);
                }
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.style.borderColor]);

    useEffect(() => {
        if (blockId !== blockObject.id) {
            setBlockId(blockObject.id);
            setBackGroundColor(blockObject.style.backgroundColor);
            setColor(blockObject.style.color);
            setBorderColor(blockObject.style.borderColor);
            setContent(blockObject.content);
            setBorderWidth(blockObject.style.borderWidth);
            setWidth(blockObject.style.widthValue);
            setHeight(blockObject.style.heightValue);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.id]);

    useEffect(() => {
        setBlocksArrayPrevState(JSON.parse(JSON.stringify(blocksArray)));
    }, [blocksArray, blockObject.style, blockObject.type]);

    useEffect(() => {
        setWidth(blockObject.style.widthValue);
    }, [blockObject.style.widthValue]);

    useEffect(() => {
        setHeight(blockObject.style.heightValue);
    }, [blockObject.style.heightValue]);

    function optionsChangeHandler(e, isValidValue = true) {
        if (type === "default") {
            blocksArrayContext.updateDefaultCustomStyles(blockObject.type, e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue);
        } else if (type === "grouped") {
            blocksArrayContext.toggleUserModificationIndicator(true);

            let prevState = [];
            let newState = [];

            if (e.target.name === "autoSize" || e.target.name === "borderStyle") {
                blocksArrayPrevState.map((element) => {
                    let prevStateElement = {id: element.id, styleName: e.target.name, styleValue: element.style[e.target.name], isValidValue: true};
                    let newStateElement = {id: element.id, styleName: e.target.name, styleValue: e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue};

                    prevState.push(prevStateElement);
                    newState.push(newStateElement);
                });

                optionsContext.addToChangesArray({
                    culprit: "block",
                    type: "changeStyleGrouped",
                    prevState,
                    newState,
                });
            } else if(e.target.name === 'blockType') {
                blocksArrayPrevState.map((element) => {
                    let prevStateElement = {id: element.id, value: element.type, width: element.style.width, height: element.style.height};
                    let newStateElement = {id: element.id, value: e.target.value}

                    prevState.push(prevStateElement);
                    newState.push(newStateElement);
                });

                const obj = {
                    culprit: "block",
                    type: "changeTypeGrouped",
                    prevState,
                    newState,
                };

                optionsContext.addToChangesArray(obj);

                blocksArray.map((element) => {
                    blocksArrayContext.changeBlockType(element.id, e.target.value);
                });

                return;
            }

            if (e.target.name !== "width" && e.target.name !== "height") {
                blocksArray.map((element) => {
                    blocksArrayContext.updateBlockStyles(element.id, e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue);
                });
            } else if (e.target.name === "width") {
                setWidth(e.target.value);
            } else if (e.target.name === "height") {
                setHeight(e.target.value);
            }
        } else if (e.target.name === "content") {
            setCursorPosition(contentRef.current.selectionStart);
            blocksArrayContext.updateBlockContent(blockObject.id, e.target.value);
        } else {
            blocksArrayContext.toggleUserModificationIndicator(true);

            //kolory oraz inputy tekstowe/numeryczne potrzebują specjalnego traktowania ze względu na zapisywanie do undo/redo
            if (e.target.name === "autoSize" || e.target.name === "borderStyle") {
                const prevState = {id: blockObject.id, styleName: e.target.name, styleValue: blockObject.style[e.target.name], isValidValue: true};
                const newState = {id: blockObject.id, styleName: e.target.name, styleValue: e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue};

                const obj = {
                    culprit: "block",
                    type: "changeStyle",
                    prevState,
                    newState,
                };

                optionsContext.addToChangesArray(obj);

                blocksArrayContext.updateBlockStyles(blockObject.id, e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue);
            } else if(e.target.name === 'blockType') {
                const prevState = {id: blockObject.id, value: blockObject.type, width: blockObject.style.width, height: blockObject.style.height};
                const newState = {id: blockObject.id, value: e.target.value}

                const obj = {
                    culprit: "block",
                    type: "changeType",
                    prevState,
                    newState,
                };

                optionsContext.addToChangesArray(obj);

                blocksArrayContext.changeBlockType(blockObject.id, e.target.value);

                return;
            }

            if (e.target.name !== "width" && e.target.name !== "height") {
                blocksArrayContext.updateBlockStyles(blockObject.id, e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue);
            } else if (e.target.name === "width") {
                setWidth(e.target.value);
            } else if (e.target.name === "height") {
                setHeight(e.target.value);
            }
        }
    }

    function inputSaveHandler(e, isValidValue = true) {

        e.target.blur();

        let prevState = [];
        let newState = [];

        let obj = {
            culprit: "block",
            type: "changeStyle",
            prevState: {},
            newState: {},
        };

        if (blockObject.id !== blockId || type === "default") {
            return;
        } else if (e.target.name === "content" && content !== blockObject.content) {
            obj.prevState = { id: blockObject.id, content };
            obj.newState = { id: blockObject.id, content: blockObject.content };
            obj.type = "changeContent";
            setContent(blockObject.content);
        } else if (e.target.name === "borderWidth" && (borderWidth !== blockObject.style.borderWidth || blocksArrayPrevState.find((element) => element.style.borderWidth !== blockObject.style.borderWidth) !== undefined)) {
            if (type === "grouped") {
                blocksArrayPrevState.map((element) => {
                    let prevStateElement = {id: element.id, styleName: e.target.name, styleValue: element.style["borderWidth"], isValidValue: true};
                    let newStateElement = { id: element.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};

                    prevState.push(prevStateElement);
                    newState.push(newStateElement);

                    blocksArrayContext.updateBlockStyles(
                        element.id,
                        e.target.name,
                        e.target.value,
                        isValidValue
                    );
                });

                obj.type = "changeStyleGrouped";
                obj.prevState = prevState;
                obj.newState = newState;
            } else {
                obj.prevState = {id: blockObject.id, styleName: e.target.name, styleValue: borderWidth, isValidValue: true};
                obj.newState = {id: blockObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
                blocksArrayContext.updateBlockStyles(blockObject.id, e.target.name, e.target.value, isValidValue);
            }

            setBorderWidth(blockObject.style.borderWidth);
        } else if (
            e.target.name === "width" && (width !== blockObject.style.widthValue || blocksArrayPrevState.find((element) => element.style.widthValue !== blockObject.style.widthValue) !== undefined)) {
            if (type === "grouped") {
                blocksArrayPrevState.map((element) => {
                    let prevStateElement = {id: element.id, styleName: e.target.name, styleValue: element.style["width"], isValidValue: true};
                    let newStateElement = {id: element.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};

                    prevState.push(prevStateElement);
                    newState.push(newStateElement);

                    blocksArrayContext.updateBlockStyles(element.id, e.target.name, e.target.value > 59 ? e.target.value : 60, isValidValue);
                });

                obj.type = "changeStyleGrouped";
                obj.prevState = prevState;
                obj.newState = newState;
            } else {
                obj.prevState = {id: blockObject.id, styleName: e.target.name, styleValue: blockObject.style.widthValue, isValidValue: true};
                obj.newState = {id: blockObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
                blocksArrayContext.updateBlockStyles(blockObject.id, e.target.name, e.target.value > 59 ? e.target.value : 60, isValidValue);
            }

            setWidth(blockObject.style.widthValue);
        } else if (e.target.name === "height" && (height !== blockObject.style.heightValue || blocksArrayPrevState.find((element) => element.style.heightValue !== blockObject.style.heightValue) !== undefined)) {
            if (type === "grouped") {
                blocksArrayPrevState.map((element) => {
                    let prevStateElement = {id: element.id, styleName: e.target.name, styleValue: element.style["height"], isValidValue: true};
                    let newStateElement = { id: element.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};

                    prevState.push(prevStateElement);
                    newState.push(newStateElement);

                    blocksArrayContext.updateBlockStyles(element.id, e.target.name, e.target.value > 59 ? e.target.value : 60, isValidValue);
                });

                obj.type = "changeStyleGrouped";
                obj.prevState = prevState;
                obj.newState = newState;
            } else {
                obj.prevState = {id: blockObject.id, styleName: e.target.name, styleValue: blockObject.style.heightValue, isValidValue: true};
                obj.newState = {id: blockObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
                blocksArrayContext.updateBlockStyles(blockObject.id, e.target.name, e.target.value > 59 ? e.target.value : 60, isValidValue);
            }

            setHeight(blockObject.style.heightValue);
        } else {
            return;
        }

        optionsContext.addToChangesArray(obj);
    }

    function deleteHandler() {
        blocksArrayContext.deleteBlock(blockObject.id);
    }

    return (
        <div className={`${styles.container} ${type === "individual" ? styles.sticky : undefined}`}>
            {type === "individual" && (
                <div className={styles.section}>
                    <div className={styles.element}>
                        <div className={`${styles.inputLabel} ${styles.inputLabelSpecial}`}>
                            <label>Tekst:</label>
                            <textarea ref={contentRef} name="content" value={blockObject.content} onChange={optionsChangeHandler} autoFocus={window.innerWidth < 1360 ? false : true}onBlur={inputSaveHandler}></textarea>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.section}>
                <div className={styles.element}>
                    <div className={`${styles.inputLabel} ${styles.inputLabelSpecial} ${styles.inputLabelHorizontal}`}>
                        <label>Automatyczne wymiary:</label>
                        <input name="autoSize" type="checkbox" checked={blockObject.style.autoSize} onChange={optionsChangeHandler}/>
                    </div>
                </div>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Szerokość: </label>
                        <input name="width" type="number" value={width} onChange={(e) => optionsChangeHandler(e, false)} onBlur={(e) => inputSaveHandler(e, false)}
                            onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e, false) : undefined} disabled={blockObject.style.autoSize}
                        />
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Wysokość:</label>
                        <input name="height" type="number" value={height} onChange={(e) => optionsChangeHandler(e, false)} onBlur={(e) => inputSaveHandler(e, false)}
                            onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e, false) : undefined} disabled={blockObject.style.autoSize ||blockObject.type === "warunkowy"}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Tło:</label>
                        <input name="backgroundColor" type="color" value={blockObject.style.backgroundColor} onChange={optionsChangeHandler}/>
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Tekst:</label>
                        <input name="color" type="color" value={blockObject.style.color} onChange={optionsChangeHandler}/>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Ramka:</label>
                        <input name="borderWidth" type="number" min={0} value={blockObject.style.borderWidth.slice(0, -2)} onChange={(e) => optionsChangeHandler(e, false)} onBlur={(e) => inputSaveHandler(e, false)} 
                            onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e, false) : undefined}/>
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Kolor:</label>
                        <input name="borderColor" type="color" value={blockObject.style.borderColor} onChange={optionsChangeHandler}/>
                    </div>
                </div>
                <div className={styles.element}>
                    <div className={`${styles.inputLabel} ${styles.inputLabelSpecial}`}>
                        <label>Typ obramowania:</label>
                        <select name="borderStyle" value={blockObject.style.borderStyle} onChange={optionsChangeHandler}>
                            <option value="solid">Linia ciągła</option>
                            <option value="dashed">Linia kreskowana</option>
                            <option value="dotted">Linia kropkowana</option>
                            <option value="double">Linia ciągła podwójna</option>
                        </select>
                    </div>
                </div>
            </div>
            {type !== "default" && (
                <div className={styles.section}>
                    <div className={styles.element}>
                        <div className={`${styles.inputLabel} ${styles.inputLabelSpecial}`}>
                            <label>Typ bloku:</label>
                            <select name="blockType" value={blockObject.type} onChange={optionsChangeHandler}>
                                <option value="graniczny">Blok graniczny</option>
                                <option value="wejscia-wyjscia">Blok wejścia-wyjścia</option>
                                <option value="operacyjny">Blok operacyjny</option>
                                <option value="warunkowy">Blok warunkowy</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
            {type === "individual" && (
                <div className={styles.section}>
                    <div className={styles.button}>
                        <button onClick={deleteHandler}>Usuń blok</button>
                    </div>
                </div>
            )}
        </div>
    );
}
