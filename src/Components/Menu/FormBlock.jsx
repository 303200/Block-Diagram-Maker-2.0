import { useContext, useEffect, useRef, useState } from "react"
import { BlocksArrayContext } from "../../store/block-array-context"
import styles from './Form.module.css'

export default function Form({blockObject, type}) {

    const blocksArrayContext = useContext(BlocksArrayContext);

    const contentRef = useRef();

    const [customOptions, setCustomOptions] = useState(blockObject);

    //pozycja kursora w textArea odpowiedzialnym za zmianę zawartości bloku
    const [cursorPosition, setCursorPosition] = useState(blockObject.content ? blockObject.content.length : 0);

    //ustawienie pozycji kursora w textArea odpowiedzialnym za zaminę zawartości bloku
    useEffect(() => {
        if(contentRef.current) {
            contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.content])

    useEffect(() => {
        if(type === 'default') {
            blocksArrayContext.updateDefaultCustomStyles(customOptions);
        } else if (customOptions.content !== blockObject.content) {
            blocksArrayContext.updateBlockContent(customOptions);
        } else {
            blocksArrayContext.updateBlockStyles(customOptions);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customOptions])

    function optionsChangeHandler(e) {
        
        setCustomOptions((prev) => {
            let updatedObject = {...prev}

            let updatedOptions = updatedObject.style;

            switch(e.target.name) {
                case 'backgroundColor': {
                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        backgroundColor: e.target.value
                    };
                    break;
                } case 'autoSize': {
                    const properValueWidth = `${blockObject.style.widthValue}px`;
                    const properValueHeight = `${blockObject.style.heightValue}px`;

                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        autoSize: e.target.checked,
                        widthValue: blockObject.style.widthValue,
                        heightValue: blockObject.style.heightValue,
                        width: e.target.checked ? 'fit-content' : properValueWidth,
                        height: e.target.checked ? 'fit-content' : properValueHeight
                    };
                    break;
                } case 'color': {
                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        color: e.target.value
                    };
                    break;
                } case 'width': {
                    const properValue = `${e.target.value}px`;

                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        width: properValue,
                        widthValue: e.target.value,
                    };

                    if(blockObject.type === 'warunkowy'){
                        updatedOptions = {
                            ...updatedOptions,
                            height: properValue,
                            heightValue: e.target.value
                        };
                    }
                    break;
                } case 'height': {
                    const properValue = `${e.target.value}px`;

                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        height: properValue,
                        heightValue: e.target.value
                    };
                    break;
                } case 'borderWidth': {
                    const properValue = `${e.target.value}px`;

                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        borderWidth: properValue
                    };
                    break;
                } case 'borderColor' : {
                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        borderColor: e.target.value
                    };
                    break;
                } case 'borderStyle': {
                    updatedOptions = {
                        ...updatedOptions,
                        top: blockObject.style.top,
                        left: blockObject.style.left,
                        borderStyle: e.target.value
                    };
                    break;
                }
            }

            return {
                ...updatedObject,
                style: updatedOptions
            };
        })
    }

    function contentChangeHandler(e) {

        setCursorPosition(contentRef.current.selectionStart);

        setCustomOptions((prev) => {
            let updatedObject = {...prev};

            updatedObject = {
                ...updatedObject,
                content: e.target.value
            };

            return updatedObject;
        
        })
        
    }

    function deleteHandler() {
        blocksArrayContext.deleteBlock(blockObject.id);
    }

    return (
        <div className={`${styles.container} ${type === 'individual' ? styles.sticky : undefined}`}>  
            {type === 'individual' && <div>
                <label>Tekst: </label>
                <textarea ref={contentRef} name='content' value={blockObject.content} onChange={contentChangeHandler} autoFocus></textarea>
            </div>}
            <div>
                <label>Automatyczne wymiary</label>
                <input name="autoSize" type="checkbox" checked={blockObject.style.autoSize} onChange={optionsChangeHandler}/>
            </div>
            <div>
                <label>Szerokość: </label>
                <input name="width" type="number" min={60} max={480} value={blockObject.style.widthValue} onChange={optionsChangeHandler} disabled={blockObject.style.autoSize}/>
            </div>
            <div>
                <label>Wysokość: </label>
                <input name="height" type="number" min={60} value={blockObject.style.heightValue} onChange={optionsChangeHandler} disabled={blockObject.style.autoSize || blockObject.type === 'warunkowy'}/>
            </div>
            <div className={styles.element}>
                <label>Kolor tła: </label>
                <input name='backgroundColor' type='color' value={blockObject.style.backgroundColor} onChange={optionsChangeHandler}/>
            </div>
            <div className={styles.element}>
                <label>Kolor tekstu: </label>
                <input name='color' type='color' value={blockObject.style.color} onChange={optionsChangeHandler}/>
            </div>
            <div className={styles.element}>
                <label>Obramowanie: </label>
                <input name='borderWidth' type='number' min={0} value={(blockObject.style.borderWidth.slice(0, -2))} onChange={optionsChangeHandler}/> px
            </div>
            <div className={styles.element}>
                <label>Kolor obramowania: </label>
                <input name='borderColor' type='color' value={blockObject.style.borderColor} onChange={optionsChangeHandler}/>
            </div>
            <div className={styles.element}>
                <label>Typ obramowania: </label>
                <select name='borderStyle' value={blockObject.style.borderStyle} onChange={optionsChangeHandler}>
                    <option value="soild">Linia ciągła</option>
                    <option value="dashed">Linia kreskowana</option>
                    <option value="dotted">Linia kropkowana</option>
                    <option value="double">Linia ciągła podwójna</option>
                </select>
            </div>
            {type === 'individual' && <div className={styles.element}>
                <button onClick={deleteHandler}>Usuń blok</button>
            </div>}
        </div>
    )
}
