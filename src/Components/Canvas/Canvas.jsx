import styles from "./Canvas.module.css";
import { useContext, useEffect, useState } from "react";
import { BlocksArrayContext } from "../../store/block-array-context";
import { ConnectorsArrayContext } from "../../store/connector-array-context";
import Block from "./Block";
import Connector from "./Connector";
import { OptionsContext } from "../../store/options-context";
import Modal from "../Misc/Modal";

export default function Canvas() {

    //kontekst przechowujący informacje o tablicy bloków
    const blocksArrayContext = useContext(BlocksArrayContext);

    //kontekst przechowujący informacje o tablicy łączników
    const connectorsArrayContext = useContext(ConnectorsArrayContext);

    //kontekst przechowujący informacje ogólne, potrzebne w kilku miejscach aplikacji
    const optionsContext = useContext(OptionsContext);

    //obecna pozycja kursora użytkownika
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    //pozycja w której został złapany blok
    const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });

    //obecnie wybrany blok
    const [selectedBlock, setSelectedBlock] = useState([]);

    //poprzednia pozycja bloku
    const [prevBlockPosition, setPrevBlockPosition] = useState({});

    //przechowuje id bloku startowego do utworzenia łącznika
    const [connectId, setConnectId] = useState(null);

    //tablica zgrupowanych bloków
    const [groupedBlocks, setGroupedBlocks] = useState([]);

    //głęboka kopia tablicy zgrupowanych bloków
    const [groupedBlocksPrev, setGroupedBlocksPrev] = useState(JSON.parse(JSON.stringify(groupedBlocks)));

    //czy obecnie odbywa się ruszanie blokiem
    const [isDragging, setIsDragging] = useState(false);

    //czy obecnie odbywa się wybieranie bloków do połączenia
    const [isConnecting, setIsConnecting] = useState(false);

    //szerokość komórki siatki
    const step = 12;

    //obserwuje zamiany w długości tablicy przechowującej informacje o blokach
    useEffect(() => {
        //usuwane jest id bloku startowego do utworzenia łącznika i usuwany jest tryb łączenia
        setConnectId(null);
        optionsContext.toggleConnectingMode(false);

        //usuwana jest grupa bloków
        setGroupedBlocks([]);
        optionsContext.setFormElement(null, null);

        //jeżeli długość tablicy się zmieniła i tablica została zainicjalizowana to znaczy, że dodano blok
        if (blocksArrayContext.isInitialized && window.innerWidth > 1359) {
            optionsContext.setFormElement("block", blocksArrayContext.blocksArray[blocksArrayContext.blocksArray.length - 1]);

            setSelectedBlock(blocksArrayContext.blocksArray[blocksArrayContext.blocksArray.length - 1]);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocksArrayContext.blocksArray.length]);

    //obserwuje zamiany w długości tablicy przechowującej informacje o łącznikach
    useEffect(() => {
        //usuwane jest id bloku startowego do utworzenia łącznika i usuwany jest tryb łączenia
        setConnectId(null);
        optionsContext.toggleConnectingMode(false);

        //usuwana jest grupa bloków
        setGroupedBlocks([]);
        optionsContext.setFormElement(null, null);

        //jeżeli długość tablicy się zmieniła i tablica została zainicjalizowana to znaczy, że dodano blok
        if (connectorsArrayContext.isInitialized && window.innerWidth > 1359) {
            optionsContext.setFormElement("connector", connectorsArrayContext.connectorsArray[connectorsArrayContext.connectorsArray.length - 1]);
            setSelectedBlock(null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectorsArrayContext.connectorsArray.length]);

    useEffect(() => {
        const lastElement = optionsContext.changesArray[optionsContext.changesArray.length - 1];

        if (lastElement?.type === "delete" && lastElement?.prevState.id === optionsContext.formElement.elementObject?.id) {
            optionsContext.setFormElement(null, null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsContext.changesArray]);

    //obserwuje czy w menu zostało wybrane łączenie bloków
    useEffect(() => {
        setIsConnecting(optionsContext.isConnectingModeActive);
        if (optionsContext.isConnectingModeActive) {
            setSelectedBlock(null);
            setGroupedBlocks([]);
            optionsContext.setFormElement(null, null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsContext.isConnectingModeActive]);

    //funkcja wykonuje się gdy zostanie wybrany łącznik i należy wyświetlić odpowiedni formularz
    function connectorSelectionHandler(e, id) {
        e.preventDefault();

        const connectorObject = connectorsArrayContext.connectorsArray.find(
            (element) => element.id === id
        );

        optionsContext.setFormElement("connector", connectorObject);
    }

    //funkcja wykonuje się gdy zostanie wybrany blok (poprzez naciśnięcie lewym przyciskiem myszy) i należy wyświetlić odpowiedni formularz (dodatkowo jego id jest zapisywane na wypadek przesuwania)
    function blockSelectionHandler(e, id) {
        //znalezienie danego elementu w tablicy bloków i zapisanie go
        let selected = blocksArrayContext.blocksArray.find((block) => block.id === id);

        setSelectedBlock(selected);

        setPrevBlockPosition({top: selected.style.top, left: selected.style.left});

        if (groupedBlocks.length > 0) {
            setGroupedBlocksPrev(JSON.parse(JSON.stringify(groupedBlocks)));
        }

        if (e.ctrlKey) {
            //jeśli element nie jest zgrupowany to zostaje dodany do grupy
            if (!groupedBlocks.find((element) => element.id === selected.id)) {

                setGroupedBlocks((prev) => {
                    const updatedArray = [...prev, selected];
                    return updatedArray;
                });
            }

            optionsContext.setFormElement("grouped", selected);
        } else {
            setGroupedBlocks([]);
            optionsContext.setFormElement(null, null);
        }

        let cordinateX = e.touches ? e.touches[0].pageX : e.clientX;
        let cordinateY = e.touches ? e.touches[0].pageY : e.clientY;

        //zapisanie miejsca w którym blok został złapany
        setAnchorPosition((prev) => {
            let tmp = { ...prev };

            tmp.x = cordinateX;
            tmp.y = cordinateY;

            return tmp;
        });

        //ustawienie obecnej pozycji kursora
        setMousePosition((prev) => {
            let tmp = { ...prev };
            tmp.x = cordinateX;
            tmp.y = cordinateY;

            return tmp;
        });

        //ustawienie stanu
        setIsDragging(true);
        setIsConnecting(false);
        optionsContext.toggleConnectingMode(false);
        setConnectId(null);

        if ((!e.ctrlKey && e.nativeEvent.type === "mousedown") ||e.nativeEvent.pointerType === "touch") {
            optionsContext.setFormElement("block", selected);
        }
    }

    //gdy blok zostanie puszczony zmieniany jest stan
    function onMouseUpHandler() {
        if (selectedBlock && prevBlockPosition.top && prevBlockPosition.left && (selectedBlock.style.top !== prevBlockPosition.top || selectedBlock.style.left !== prevBlockPosition.left)) {
            let prevState = [];
            let newState = [];

            const obj = {
                culprit: "block",
                type: "changePosition",
                prevState,
                newState,
            };

            if (groupedBlocks.length > 0) {
                groupedBlocks.map((block, index) => {
                    let prevStateElement = {id: block.id, position: {top: groupedBlocksPrev[index]?.style.top, left: groupedBlocksPrev[index]?.style.left}};
                    let newStateElement = {id: block.id, position: {top: block.style.top, left: block.style.left}};

                    prevState.push(prevStateElement);
                    newState.push(newStateElement);
                });

                obj.type = "changePositionGrouped";
                obj.prevState = prevState;
                obj.newState = newState;
            } else {
                obj.prevState = {id: selectedBlock.id, position: prevBlockPosition};
                obj.newState = {id: selectedBlock.id, position: {top: selectedBlock.style.top, left: selectedBlock.style.left}};
            }

            optionsContext.addToChangesArray(obj);
        }
        setIsDragging(false);
        setSelectedBlock(null);
    }

    //obsługa ruszania blokiem
    function onMouseMoveHandler(e) {
        if (!selectedBlock) return;

        //korekcja pozycji po trybie wolnego przesuwania
        if (!e.altKey && (selectedBlock.style.top % step !== 0 || selectedBlock.style.left % step !== 0)) {
            const gridProperPositionY = Math.round(selectedBlock.style.top / step) * step;
            const gridProperPositionX = Math.round(selectedBlock.style.left / step) * step;

            blocksArrayContext.updateBlockPosition(selectedBlock.id, {top: gridProperPositionY, left: gridProperPositionX});

            //jeśli bloki są zgrupowane to należy skorygować pozycję wszystkich
            if (e.ctrlKey) {
                groupedBlocks.map((element) => {
                    const gridProperPositionY = Math.round(element.style.top / step) * step;
                    const gridProperPositionX = Math.round(element.style.left / step) * step;

                    blocksArrayContext.updateBlockPosition(element.id, {top: gridProperPositionY, left: gridProperPositionX});
                });
            }
            return;
        }

        let cordinateX = e.touches ? e.touches[0].pageX : e.clientX;
        let cordinateY = e.touches ? e.touches[0].pageY : e.clientY;

        //ustawienie obecnej pozycji kursora
        setMousePosition((prev) => {
            let tmp = { ...prev };
            tmp.x = cordinateX;
            tmp.y = cordinateY;

            return tmp;
        });

        //obliczenie różnicy między obecną pozycją kursora, a miejscem w którym blok został oryginalnie złapany
        let xDifference = anchorPosition.x - mousePosition.x;
        let yDifference = anchorPosition.y - mousePosition.y;

        let multiX = 0;
        let multiY = 0;

        //jeśli różnica jest większa niż szerokość komórki lub mniejsza niż jej przeciwność wtedy należy przesunąć blok
        if (xDifference >= step || xDifference <= ((-1)*step)) {
            //obliczenie którą wielokrotnością jest różnica
            multiX = Math.floor(Math.abs(xDifference / step));

            if (xDifference < 0) {
                multiX = multiX * -1;
            }

            multiX = step * multiX;
        }

        //to samo co wyżej tyle, że dla drugiej współrzędnej
        if (yDifference >= step || yDifference <= ((-1)*-step)) {
            //obliczenie którą wielokrotnością jest różnica
            multiY = Math.floor(Math.abs(yDifference / step));

            if (yDifference < 0) {
                multiY = multiY * -1;
            }

            multiY = step * multiY;
        }

        //jeśli przyciśnięty jest klawisz alt to włączony jest tryb wolnego przesuwania
        if (e.altKey) {
            multiX = xDifference;
            multiY = yDifference;
        }

        ///przesunięcie puntu kotwicznego
        setAnchorPosition((prev) => {
            let tmp = { ...prev };
            tmp.x = tmp.x - multiX*optionsContext.zoom;
            tmp.y = tmp.y - multiY*optionsContext.zoom;
            return tmp;
        });

        let topValue = selectedBlock.style.top - multiY;
        let leftValue = selectedBlock.style.left - multiX;

        if (topValue < 0) {
            topValue = 0;
        } else if (topValue > 2604) {
            topValue = 2604;
        }

        if (leftValue < 0) {
            leftValue = 0;
        } else if (leftValue > 2904) {
            leftValue = 2904;
        }

        //przesunięcie bloku
        blocksArrayContext.updateBlockPosition(selectedBlock.id, {top: topValue, left: leftValue});

        //przesunięcie wszystkich zgrupowanych bloków
        if (e.ctrlKey) {
            groupedBlocks.map((block) => {
                topValue = block.style.top - multiY;
                leftValue = block.style.left - multiX;

                if (topValue < 0) {
                    topValue = 0;
                } else if (topValue > 2604) {
                    topValue = 2604;
                }

                if (leftValue < 0) {
                    leftValue = 0;
                } else if (leftValue > 2904) {
                    leftValue = 2904;
                }

                blocksArrayContext.updateBlockPosition(block.id, {top: topValue, left: leftValue});
            });
        }
    }

    //kliknięcie poza elementami powiązanymi z formularzamia powoduje zamknięcie formularzy
    function onClickHandler(e) {
        if (e.target.id === "gridArea") {
            setSelectedBlock(null);
            optionsContext.setFormElement(null, null);
            setGroupedBlocks([]);
        }
    }

    //funkcja odpowiedzialna za połączenie dwóch bloków łącznikiem
    function onConnectingBlocks(e, id) {
        e.preventDefault();

        if (connectId === null) {
            setConnectId(id);
            setIsConnecting(true);
            optionsContext.toggleConnectingMode(true);
            optionsContext.setFormElement(null, null);
            setSelectedBlock(null);
        } else if (connectId !== id) {
            connectorsArrayContext.addNewConnector(connectId, id);
            setConnectId(null);
            setIsConnecting(false);
            optionsContext.toggleConnectingMode(false);
        } else {
            setConnectId(null);
            setIsConnecting(false);
            optionsContext.toggleConnectingMode(false);
        }
    }

    return (
        <div className={styles.container}>
            <div id="gridArea" style={{zoom: optionsContext.zoom}} className={styles.gridArea} onMouseLeave={isDragging ? onMouseUpHandler : undefined} onClick={onClickHandler} onMouseUp={onMouseUpHandler}
                onMouseMove={isDragging ? onMouseMoveHandler : undefined} onTouchEnd={onMouseUpHandler} onTouchMove={isDragging ? onMouseMoveHandler : undefined}>
                
                {isConnecting && <Modal />}

                {blocksArrayContext.blocksArray.map((block) => (
                    <Block key={block.id} id={block.id} onLeftClick={blockSelectionHandler} onRightClick={onConnectingBlocks} block={block}
                        isSelected={(optionsContext.formElement.elementType === "block" && optionsContext.formElement.elementObject.id === block.id) || selectedBlock?.id === block.id ? true : false}
                        isConnectingStart={connectId && connectId === block.id} isConnecting={isConnecting} isGrouped={groupedBlocks.find((element) => element.id === block.id)}
                    />
                ))}

                {connectorsArrayContext.connectorsArray.map((connector) => (
                    <Connector key={connector.id} connector={connector} onSelect={connectorSelectionHandler} isConnecting={isConnecting}/>
                ))}
            </div>
        </div>
    );
}
