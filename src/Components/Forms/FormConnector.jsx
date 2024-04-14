import { useContext, useEffect, useState } from "react";
import { ConnectorsArrayContext } from "../../store/connector-array-context";
import styles from "./Form.module.css";
import { OptionsContext } from "../../store/options-context";

export default function FormConnector({ elementObject, type }) {
    const connectorsArrayContext = useContext(ConnectorsArrayContext);

    const optionsContext = useContext(OptionsContext);

    const [connectorId, setConnectorId] = useState(elementObject.id);

    const [headColor, setHeadColor] = useState(elementObject.style.headColor);
    const [tailColor, setTailColor] = useState(elementObject.style.tailColor);
    const [lineColor, setLineColor] = useState(elementObject.style.lineColor);

    const [headSize, setHeadSize] = useState(elementObject.style.headSize);
    const [tailSize, setTailSize] = useState(elementObject.style.tailSize);
    const [strokeWidth, setStrokeWidth] = useState(elementObject.style.strokeWidth);

    const [middleLabelText, setMiddleLabelText] = useState(elementObject.style.middleLabelText);
    const [middleLabelStyleMarginLeft, setMiddleLabelStyleMarginLeft] = useState(elementObject.style.middleLabelStyle.marginLeft);
    const [middleLabelStyleMarginTop, setMiddleLabelStyleMarginTop] = useState(elementObject.style.middleLabelStyle.marginTop);

    useEffect(() => {
        if (type !== "default") {
            let timer = setTimeout(() => {

                const obj = {
                    culprit: "connector",
                    type: "changeStyle",
                    prevState: {},
                    newState: {},
                };

                if (elementObject.id !== connectorId) {
                    return;
                } else if (headColor !== elementObject.style.headColor) {
                    obj.prevState = {id: elementObject.id, styleName: "headColor", styleValue: headColor, isValidValue: true};
                    obj.newState = {id: elementObject.id, styleName: "headColor", styleValue: elementObject.style.headColor, isValidValue: true};
                    setHeadColor(elementObject.style.headColor);
                } else {
                    return;
                }

                if(connectorsArrayContext.wasModifiedByUser){
                    optionsContext.addToChangesArray(obj);
                }
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementObject.style.headColor]);

    useEffect(() => {
        if (type !== "default") {
            let timer = setTimeout(() => {

                const obj = {
                    culprit: "connector",
                    type: "changeStyle",
                    prevState: {},
                    newState: {},
                };

                if (elementObject.id !== connectorId) {
                    return;
                } else if (tailColor !== elementObject.style.tailColor) {
                    obj.prevState = {id: elementObject.id, styleName: "tailColor", styleValue: tailColor, isValidValue: true};
                    obj.newState = {id: elementObject.id, styleName: "tailColor", styleValue: elementObject.style.tailColor, isValidValue: true};
                    setTailColor(elementObject.style.tailColor);
                } else {
                    return;
                }

                if(connectorsArrayContext.wasModifiedByUser){
                    optionsContext.addToChangesArray(obj);
                }
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementObject.style.tailColor]);

    useEffect(() => {

        if (type !== "default") {
            let timer = setTimeout(() => {

                const obj = {
                    culprit: "connector",
                    type: "changeStyle",
                    prevState: {},
                    newState: {},
                };

                if (elementObject.id !== connectorId) {
                    return;
                } else if (lineColor !== elementObject.style.lineColor) {
                    obj.prevState = {id: elementObject.id, styleName: "lineColor", styleValue: lineColor, isValidValue: true};
                    obj.newState = {id: elementObject.id, styleName: "lineColor", styleValue: elementObject.style.lineColor, isValidValue: true};
                    setLineColor(elementObject.style.lineColor);
                } else {
                    return;
                }

                if(connectorsArrayContext.wasModifiedByUser){
                    optionsContext.addToChangesArray(obj);
                }
            }, 100);

            return () => {
                clearTimeout(timer);
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementObject.style.lineColor]);

    useEffect(() => {
        if (connectorId !== elementObject.id) {
            setConnectorId(elementObject.id);
            setHeadColor(elementObject.style.headColor);
            setTailColor(elementObject.style.tailColor);
            setLineColor(elementObject.style.lineColor);
            setHeadSize(elementObject.style.headSize);
            setTailSize(elementObject.style.tailSize);
            setStrokeWidth(elementObject.style.strokeWidth);
            setMiddleLabelText(elementObject.style.middleLabelText);
            setMiddleLabelStyleMarginLeft(elementObject.style.middleLabelStyle.marginLeft);
            setMiddleLabelStyleMarginTop(elementObject.style.middleLabelStyle.marginTop);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementObject.id]);

    function styleChangeHandler(e, isValidValue = true) {
        if (type === "default") {
            connectorsArrayContext.updateDefaultCustomStyles(elementObject.type, e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue);
        } else {
            connectorsArrayContext.toggleUserModificationIndicator(true);

            if (e.target.name === "showHead" || e.target.name === "endAnchor" || e.target.name === "showTail" || e.target.name === "startAnchor" || e.target.name === "dashness" || e.target.name === "path") {
                const prevState = {id: elementObject.id, styleName: e.target.name, styleValue: elementObject.style[e.target.name], isValidValue: true};
                const newState = {id: elementObject.id, styleName: e.target.name, styleValue: e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue};

                const obj = {
                    culprit: "connector",
                    type: "changeStyle",
                    prevState,
                    newState,
                };

                optionsContext.addToChangesArray(obj);
            }

            connectorsArrayContext.updateConnectorStyle(elementObject.id, e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value, isValidValue);
        }
    }

    function inputSaveHandler(e, isValidValue = true) {
        let prevState;
        let newState;

        e.target.blur();

        if ((headSize === elementObject.headSize && tailSize === elementObject.tailSize && strokeWidth === elementObject.strokeWidth && middleLabelText === elementObject.style.middleLabelText &&
                middleLabelStyleMarginLeft === elementObject.style.middleLabelStyle.marginLeft && middleLabelStyleMarginTop === elementObject.style.middleLabelStyle.marginTop) || 
                elementObject.id !== connectorId || type === "default") {
            return;
        } else if (headSize !== elementObject.style.headSize) {
            prevState = {id: elementObject.id, styleName: e.target.name, styleValue: headSize, isValidValue: true};
            newState = {id: elementObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
            setHeadSize(elementObject.style.headSize);
        } else if (tailSize !== elementObject.style.tailSize) {
            prevState = {id: elementObject.id, styleName: e.target.name, styleValue: tailSize, isValidValue: true};
            newState = {id: elementObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
            setTailSize(elementObject.style.tailSize);
        } else if (strokeWidth !== elementObject.style.strokeWidth) {
            prevState = {id: elementObject.id, styleName: e.target.name, styleValue: strokeWidth, isValidValue: true};
            newState = {id: elementObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
            setStrokeWidth(elementObject.style.strokeWidth);
        } else if (middleLabelText !== elementObject.style.middleLabelText) {
            prevState = {id: elementObject.id, styleName: e.target.name, styleValue: middleLabelText, isValidValue: true};
            newState = {id: elementObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
            setMiddleLabelText(elementObject.style.middleLabelText);
        } else if (middleLabelStyleMarginLeft !== elementObject.style.middleLabelStyle.marginLeft) {
            prevState = {id: elementObject.id, styleName: e.target.name, styleValue: middleLabelStyleMarginLeft, isValidValue: true};
            newState = {id: elementObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
            setMiddleLabelStyleMarginLeft(elementObject.style.middleLabelStyle.marginLeft);
        } else if (middleLabelStyleMarginTop !== elementObject.style.middleLabelStyle.marginTop) {
            prevState = {id: elementObject.id, styleName: e.target.name, styleValue: middleLabelStyleMarginTop, isValidValue: true};
            newState = {id: elementObject.id, styleName: e.target.name, styleValue: e.target.value, isValidValue};
            setMiddleLabelStyleMarginTop(elementObject.style.middleLabelStyle.marginTop);
        } else {
            return;
        }

        connectorsArrayContext.updateConnectorStyle(elementObject.id, e.target.name, e.target.value, isValidValue);

        const obj = {
            culprit: "connector",
            type: "changeStyle",
            prevState,
            newState,
        };

        optionsContext.addToChangesArray(obj);
    }

    function deleteHandler() {
        connectorsArrayContext.deleteConnector(elementObject.id);
    }

    return (
        <div className={`${styles.container} ${type === "individual" ? styles.sticky : undefined}`}>
            <div className={styles.section}>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Grot łącznika: </label>
                        <input name="showHead" checked={elementObject.style.showHead} type="checkbox" onChange={styleChangeHandler}/>
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Położenie: </label>
                        <select name="endAnchor" value={elementObject.style.endAnchor} onChange={styleChangeHandler}>
                            <option value="auto">Automatyczne</option>
                            <option value="top">Góra</option>
                            <option value="bottom">Dół</option>
                            <option value="left">Lewo</option>
                            <option value="right">Prawo</option>
                        </select>
                    </div>
                </div>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Kolor: </label>
                        <input name="headColor" value={elementObject.style.headColor} type="color"onChange={styleChangeHandler}/>
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Wielkość: </label>
                        <input name="headSize" value={elementObject.style.headSize} type="number" onChange={styleChangeHandler} onBlur={(e) => inputSaveHandler(e)}
                            onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e) : undefined}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Lotka łącznika: </label>
                        <input name="showTail" checked={elementObject.style.showTail} type="checkbox" onChange={styleChangeHandler}/>
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Położenie: </label>
                        <select name="startAnchor" value={elementObject.style.startAnchor} onChange={styleChangeHandler}>
                            <option value="auto">Automatyczne</option>
                            <option value="top">Góra</option>
                            <option value="bottom">Dół</option>
                            <option value="left">Lewo</option>
                            <option value="right">Prawo</option>
                        </select>
                    </div>
                </div>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Kolor: </label>
                        <input name="tailColor" value={elementObject.style.tailColor} type="color" onChange={styleChangeHandler}/>
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Wielkość: </label>
                        <input name="tailSize" value={elementObject.style.tailSize} type="number" onChange={styleChangeHandler} onBlur={(e) => inputSaveHandler(e)}
                            onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e) : undefined}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Kolor lini: </label>
                        <input name="lineColor" value={elementObject.style.lineColor} type="color" onChange={styleChangeHandler}/>
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Linia przerywana: </label>
                        <input name="dashness" checked={elementObject.style.dashness} type="checkbox" onChange={styleChangeHandler}/>
                    </div>
                </div>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Skala łącznika: </label>
                        <input name="strokeWidth" value={elementObject.style.strokeWidth} type="number" onChange={styleChangeHandler} onBlur={(e) => inputSaveHandler(e)}
                            onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e) : undefined}
                        />
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Rodzaj łączenia: </label>
                        <select name="path" value={elementObject.style.path} onChange={styleChangeHandler}>
                            <option value="smooth">Zaokrąglone</option>
                            <option value="grid">Siatka</option>
                            <option value="straight">Proste</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={`${styles.inputLabel} ${styles.inputLabelSpecial}`}>
                    <label>Etykieta: </label>
                    <textarea name="middleLabelText" value={elementObject.style.middleLabelText} onChange={styleChangeHandler} onBlur={(e) => inputSaveHandler(e)}
                        onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e) : undefined}
                    />
                </div>
                <div className={styles.element}>
                    <div className={styles.inputLabel}>
                        <label>Oś X: </label>
                        <input name="middleLabelStyleMarginLeft" value={elementObject.style.middleLabelStyle.marginLeft.slice(0, -2)} type="number" step={10} onChange={(e) => styleChangeHandler(e, false)}
                            onBlur={(e) => inputSaveHandler(e, false)} onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e, false) : undefined}
                        />
                    </div>
                    <div className={styles.inputLabel}>
                        <label>Oś Y: </label>
                        <input name="middleLabelStyleMarginTop" value={elementObject.style.middleLabelStyle.marginTop.slice(0, -2)} type="number" step={10} onChange={(e) => styleChangeHandler(e, false)}
                            onBlur={(e) => inputSaveHandler(e, false)} onKeyDown={(e) => e.key === "Enter" ? inputSaveHandler(e, false) : undefined}
                        />
                    </div>
                </div>
            </div>
            {type === "individual" && (
                <div className={styles.section}>
                    <div className={styles.button}>
                        <button onClick={deleteHandler}>Usuń łącznik</button>
                    </div>
                </div>
            )}
        </div>
    );
}
