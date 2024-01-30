import { useContext, useEffect, useRef, useState } from "react"
import { BlocksArrayContext } from "../../store/block-array-context"
import styles from './Form.module.css'

export default function Form({blockObject, type, blocksArray}) {

    const blocksArrayContext = useContext(BlocksArrayContext);

    const contentRef = useRef();

    //pozycja kursora w textArea odpowiedzialnym za zmianę zawartości bloku
    const [cursorPosition, setCursorPosition] = useState(blockObject.content ? blockObject.content.length : 0);

    //ustawienie pozycji kursora w textArea odpowiedzialnym za zamianę zawartości bloku
    useEffect(() => {
        if(contentRef.current) {
            contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockObject.content])

    function optionsChangeHandler (e, isValidValue = true) {
        if(type === 'default') {
            blocksArrayContext.updateDefaultCustomStyles(blockObject.type, e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value, isValidValue);
        } else if (type === 'grouped') {
            blocksArray.map((element) => {
                blocksArrayContext.updateBlockStyles(element.id, e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value, isValidValue);
            })
        } else if (e.target.name === 'content') {
            setCursorPosition(contentRef.current.selectionStart);
            blocksArrayContext.updateBlockContent(blockObject.id, e.target.value);
        } else {
            blocksArrayContext.updateBlockStyles(blockObject.id, e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value, isValidValue);
        }
    }

    function deleteHandler() {
        blocksArrayContext.deleteBlock(blockObject.id);
    }

    return (
        <div className={`${styles.container} ${type === 'individual' ? styles.sticky : undefined}`}>  
            {type === 'individual' && <div>
                <label>Tekst: </label>
                <textarea ref={contentRef} name='content' value={blockObject.content} onChange={optionsChangeHandler} autoFocus></textarea>
            </div>}
            <div>
                <label>Automatyczne wymiary</label>
                <input name="autoSize" type="checkbox" checked={blockObject.style.autoSize} onChange={optionsChangeHandler}/>
            </div>
            <div>
                <label>Szerokość: </label>
                <input name="width" type="number" min={60} max={480} value={blockObject.style.widthValue} onChange={(e) => optionsChangeHandler(e, false)} disabled={blockObject.style.autoSize}/>
            </div>
            <div>
                <label>Wysokość: </label>
                <input name="height" type="number" min={60} value={blockObject.style.heightValue} onChange={(e) => optionsChangeHandler(e, false)} disabled={blockObject.style.autoSize || blockObject.type === 'warunkowy'}/>
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
                <input name='borderWidth' type='number' min={0} value={(blockObject.style.borderWidth.slice(0, -2))} onChange={(e) => optionsChangeHandler(e, false)}/> px
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
