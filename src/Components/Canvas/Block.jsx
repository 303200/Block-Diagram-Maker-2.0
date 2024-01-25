import { useContext, useEffect, useRef } from 'react';
import styles from './Block.module.css'
import { BlocksArrayContext } from '../../store/block-array-context';

export default function Block({block, onLeftClick, onRightClick, isSelected, isConnectingStart, isConnecting, isGrouped}) {

    const blocksArrayContext = useContext(BlocksArrayContext);

    const blockRef = useRef();

    //ustawia obserwator moniturujące zmiany szerokości i wysokości bloku (potrzebne do manualnego sterowania rozmiarem bloku)
    useEffect(() => {
        if(!blockRef.current) return;

        const resizeObserver = new ResizeObserver(() => {

            let updatedStyles = {...block.style};

            //jeśli blok jest typu warunkowego to wysokość i szerokość bloku muszą być takie same, aby zachować kształt diamentu
            if(block.type === 'warunkowy') {

                const properValue = `${blockRef.current.offsetWidth}px`;

                updatedStyles = {
                    ...updatedStyles,
                    height: properValue
                };
            }

            updatedStyles = {
                ...updatedStyles,
                widthValue: blockRef.current.offsetWidth,
                heightValue: block.type === 'warunkowy' ? blockRef.current.offsetWidth : blockRef.current.offsetHeight,
            };

            let updatedObject = {
                ...block,
                style: updatedStyles
            };

            blocksArrayContext.updateBlockStyles(updatedObject);
        })
        
        resizeObserver.observe(blockRef.current);

        return () => resizeObserver.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //funkcja wykonywana gdy użyty zostanie lewy przycisk myszy (przesuwanie bloków)
    function onMouseDownHandler(e) {
        e.preventDefault();

        if(e.button === 0 && !isConnecting) {
            //jeśli przyciśnięty został lewy przycisk myszy i tryb łączenia jest wyłączony, to blok zostanie oznaczony jako 'selected'
            onLeftClick(e, block.id);
        } else if(e.button === 0 && isConnecting) {
            //jeśli przyciśnięty został prawy przycisk myszy i tryb łączenia jest włączony, to blok zostanie wytypowany do łączenia
            onRightClick(e, block.id);
        }
    }
    
    //funkcja wykonywana gdy użyty zostanie prawy przycisk myszy (łączenie bloków)
    function onContexMenuHandler(e) {
        
        e.preventDefault();
        
        //jeśli grupowanie nie jest w toku to blok zostanie wytypowany do łączenia
        if(!e.ctrlKey){
            onRightClick(e, block.id);
        }
        
    }

    function onDeleteHandler(e) {
        //blok może być usunięty jeśli tryb łączenia nie jest włączony, blok nie jest wytypowany do łączenia oraz grupowanie nie jest w toku
        if(e.shiftKey && !isConnecting && isConnectingStart === null && !e.ctrlKey) {
            blocksArrayContext.deleteBlock(block.id);
        }
    }

    return (
        <div ref={blockRef} id={block.id} style={block.style} 
            className={`${styles.container} ${isSelected ? styles.selected : undefined} ${isConnectingStart ? styles.connecting : undefined} 
            ${isConnecting ? styles.connectingContainer : undefined} ${isGrouped ? styles.grouped : undefined}`} 
            onMouseDown={onMouseDownHandler} onContextMenu={onContexMenuHandler} onClick={onDeleteHandler}>
            <div className={`${block.type === 'wejscia-wyjscia' ? styles.insideSkew : undefined} ${block.type === 'warunkowy' ? styles.insideRotate : undefined}`}>
                {block.content}
            </div>
        </div>
    )
}
