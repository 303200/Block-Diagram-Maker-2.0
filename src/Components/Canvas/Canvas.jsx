import styles from './Canvas.module.css'
import { useContext, useEffect, useState } from 'react'
import { BlocksArrayContext } from '../../store/block-array-context';
import { ConnectorsArrayContext } from '../../store/connector-array-context';
import GridLines from 'react-gridlines';
import Block from './Block';
import FormBlock from '../Menu/FormBlock';
import FormConnector from '../Menu/FormConnector';
import Connector from './Connector';
import { OptionsContext } from '../../store/options-context';
import Modal from '../Menu/Modal';

export default function Canvas() {

  //kontekst przechowujący informacje o tablicy bloków
  const blocksArrayContext = useContext(BlocksArrayContext); 

  //kontekst przechowujący informacje o tablicy łączników
  const connectorsArrayContext = useContext(ConnectorsArrayContext);

  //kontekst przechowujący informacje ogólne, potrzebne w kilku miejscach aplikacji
  const optionsContext = useContext(OptionsContext);


  //przechowuje informacje o długości tablicy bloków
  const [blockArrayLength, setBlockArrayLength] = useState(blocksArrayContext.blocksArray.length);

  //przechowuje informacje o długości tablicy łączników
  const [connectorsArrayLength, setConnectorsArrayLength] = useState(connectorsArrayContext.connectorsArray.length);


  //obecna pozycja kursora użytkownika
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  //pozycja w której został złapany blok
  const [anchorPosition, setAnchorPosition] = useState({x: 0, y: 0});


  //obecnie wybrany blok
  const [selectedBlock, setSelectedBlock] = useState(null);

  //przechowuje id bloku startowego do utworzenia łącznika
  const [connectId, setConnectId] = useState(null);

  //tablica zgrupowanych bloków
  const [groupedBlocks, setGroupedBlocks] = useState([]);


  //czy obecnie odbywa się ruszanie blokiem
  const [isDragging, setIsDragging] = useState(false);

  //czy obecnie odbywa się wybieranie bloków do połączenia
  const [isConnecting, setIsConnecting] = useState(false);


  //blok którego formularz jest wyświetlany
  const [blockFormElement, setBlockFormElement] = useState(null);

  //łącznik którego formularz jest wyświetlany
  const [connectorFormElement, setConnectorFormElement] = useState(null);


  //obserwuje zamiany w długości tablicy przechowującej informacje o blokach
  useEffect(() => {

    //usuwane jest id bloku startowego do utworzenia łącznika
    setConnectId(null);

    //usuwana jest grupa bloków
    setGroupedBlocks([]);

    //jeśli obecnie otwarty jest formularz
    if(blockFormElement) {

      //sprawdzane jest czy blok dla którego otwarty jest formularz istnieje
      let formElementIndex = blocksArrayContext.blocksArray.findIndex((element) => element.id === blockFormElement.id);

      if(formElementIndex < 0) {
        //jeśli blok dla którego otwarty jest formularz przestał istnieć to należy zamknąć formularz (usunięto blok dla którego otwarty był formularz)

        setBlockFormElement(null);
        setSelectedBlock(null);
      } else {
        //jeśli formularz jest otworzony, a odpowiadający mu blok istnieje to otwierany jest dla najnowszego elementu w tablicy (uworzono nowy blok i należy zastąpić aktualny formularz)

        setConnectorFormElement(null);
        setBlockFormElement(blocksArrayContext.blocksArray[blocksArrayContext.blocksArray.length-1]);
        setSelectedBlock(blocksArrayContext.blocksArray[blocksArrayContext.blocksArray.length-1]);
      }
    } else {
      //jeśli formularz nie jest otworzony, to zostanie otwarty dla najnowszego bloku w tablicy (uworzono nowy blok i należy jemu otworzyć formularz)

      if((blocksArrayContext.blocksArray.length - blockArrayLength) === 1) {
        //formularz otwierany wtedy gdy nie jest to pierwsze uruchomienie
        setConnectorFormElement(null);
        setBlockFormElement(blocksArrayContext.blocksArray[blocksArrayContext.blocksArray.length-1]);
        setSelectedBlock(blocksArrayContext.blocksArray[blocksArrayContext.blocksArray.length-1]);
      }
    }

    setBlockArrayLength(blocksArrayContext.blocksArray.length);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksArrayContext.blocksArray.length])
  
  //obserwuje zamiany w długości tablicy przechowującej informacje o łącznikach
  useEffect(() => {

    //usuwana jest grupa bloków
    setGroupedBlocks([]);

    //jeśli obecnie otwaty jest formularz
    if(connectorFormElement) {

      //sprawdzane jest czy łącznik dla którego otwarty jest formularz istnieje
      let formElementIndex = connectorsArrayContext.connectorsArray.findIndex((element) => element.id === connectorFormElement?.id);

      if(formElementIndex < 0) {
        //jeśli blok dla którego otwarty jest formularz przestał istnieć to należy zamknąć formularz (usunięto łącznik dla którego otwarty był formularz)

        setConnectorFormElement(null);
      } else {
        //jeśli formularz jest otworzony, a odpowiadający mu łącznik istnieje to otwierany jest dla najnowszego elementu w tablicy (uworzono nowy łącznik i należy zastąpić aktualny formularz)
        setBlockFormElement(null);
        setConnectorFormElement(connectorsArrayContext.connectorsArray[connectorsArrayContext.connectorsArray.length-1]);
      }
    } else {
      //jeśli formularz nie jest otworzony, to zostanie otwarty dla najnowszego łącznika w tablicy (uworzono nowy łącznik i należy jemu otworzyć formularz)

      if((connectorsArrayContext.connectorsArray.length - connectorsArrayLength) === 1) {
        //formularz otwierany wtedy gdy nie jest to pierwsze uruchomienie
        setBlockFormElement(null);
        setConnectorFormElement(connectorsArrayContext.connectorsArray[connectorsArrayContext.connectorsArray.length-1]);
      }
    }

    setConnectorsArrayLength(connectorsArrayContext.connectorsArray.length);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorsArrayContext.connectorsArray.length])

  //obserwuje czy w menu zostało wybrane łączenie bloków
  useEffect(() => {
    setIsConnecting(optionsContext.connectingMode);
    if(optionsContext.connectingMode){
      setBlockFormElement(null);
      setConnectorFormElement(null);
      setSelectedBlock(null);
      setGroupedBlocks([]);
    }
  }, [optionsContext.connectingMode])

  //funkcja wykonuje się gdy zostanie wybrany łącznik i należy wyświetlić odpowiedni formularz
  function connectorSelectionHandler (e, id) {

    const connectorObject = connectorsArrayContext.connectorsArray.find((element) => element.id === id);

    setBlockFormElement(null);
    setConnectorFormElement(connectorObject);
  }

  //funkcja wykonuje się gdy zostanie wybrany blok (poprzez naciśnięcie lewym przyciskiem myszy) i należy wyświetlić odpowiedni formularz (dodatkowo jego id jest zapisywane na wypadek przesuwania)
  function blockSelectionHandler(e, id) {

    e.preventDefault();

    //znalezienie danego elementu w tablicy bloków i zapisanie go
    let selected = blocksArrayContext.blocksArray.find((block) => block.id === id);

    setSelectedBlock(selected);

    if(e.ctrlKey) {

      //jeśli element nie jest zgrupowany to zostaje dodany do grupy
      if(!groupedBlocks.find((element) => element.id === selected.id)) {
        setGroupedBlocks((prev) => {
          const updatedArray = [...prev, selected]
          return updatedArray;
        });
      }

      setBlockFormElement(null);
    } else {
      setGroupedBlocks([]);
    }

    //zapisanie miejsca w którym blok został złapany
    setAnchorPosition(prev => { 
      let tmp = {...prev};

      tmp.x = e.clientX;
      tmp.y = e.clientY;
 
      return tmp;
    })

    //ustawienie obecnej pozycji kursora
    setMousePosition(prev => {
      let tmp = {...prev};
      tmp.x = e.clientX;
      tmp.y = e.clientY;

      return tmp;
    })

    //ustawienie stanu
    setIsDragging(true);
    setIsConnecting(false);
    optionsContext.toggleConnectingMode(false);
    setConnectId(null);

    if(!e.ctrlKey) {
      setBlockFormElement(selected);
    }
    setConnectorFormElement(null);
  }

  //gdy blok zostanie puszczony zmieniany jest stan
  function onMouseUpHandler() {
    setIsDragging(false);
    setSelectedBlock(null);
  }

  //obsługa ruszania blokiem
  function onMouseMoveHandler(e) {

    //korekcja pozycji po trybie wolnego przesuwania
    if(!e.altKey && (selectedBlock.style.top % 12 !== 0 || selectedBlock.style.left % 12 !== 0)){
      const gridProperPositionY = Math.round(selectedBlock.style.top/12)*12;
      const gridProperPositionX = Math.round(selectedBlock.style.left/12)*12;

      blocksArrayContext.updateBlockPosition(selectedBlock.id, {top: gridProperPositionY, left: gridProperPositionX});

      //jeśli bloki są zgrupowane to należy skorygować pozycję wszystkich
      if(e.ctrlKey) {
        groupedBlocks.map((element) => {
          const gridProperPositionY = Math.round(element.style.top/12)*12;
          const gridProperPositionX = Math.round(element.style.left/12)*12;

          blocksArrayContext.updateBlockPosition(element.id, {top: gridProperPositionY, left: gridProperPositionX})
        })
      } 
      return;
    }

    //ustawienie obecnej pozycji kursora
    setMousePosition(prev => {
      let tmp = {...prev};
      tmp.x = e.clientX;
      tmp.y = e.clientY;

      return tmp;
    });

    //obliczenie różnicy między obecną pozycją kursora, a miejscem w którym blok został oryginalnie złapany
    let xDifference = anchorPosition.x - mousePosition.x;
    let yDifference = anchorPosition.y - mousePosition.y;

    let multiX = 0;
    let multiY = 0;

    //jeśli różnica jest większa niż szerokość komórki lub mniejsza niż jej przeciwność wtedy należy przesunąć blok
    if(xDifference >= 12 || xDifference <= -12){

      //obliczenie którą wielokrotnością jest różnica
      multiX = Math.floor(Math.abs(xDifference/12));

      if(xDifference < 0 ) {
        multiX = multiX * (-1);
      }

      multiX = 12 * multiX;
    }

    //to samo co wyżej tyle, że dla drugiej współrzędnej
    if(yDifference >= 12 || yDifference <= -12){

      //obliczenie którą wielokrotnością jest różnica
      multiY = Math.floor(Math.abs(yDifference/12));

      if(yDifference < 0 ) {
        multiY = multiY * (-1);
      }

      multiY = 12 * multiY;
    }

    //jeśli przyciśnięty jest klawisz alt to włączony jest tryb wolnego przesuwania
    if(e.altKey){
      multiX = xDifference;
      multiY = yDifference;
    }

    ///przesunięcie puntu kotwicznego
    setAnchorPosition(prev => { 
      let tmp = {...prev};
      tmp.x = tmp.x - multiX;
      tmp.y = tmp.y - multiY;
      return tmp;
    })

    //przesunięcie bloku
    blocksArrayContext.updateBlockPosition(selectedBlock.id, {top: selectedBlock.style.top - multiY, left: selectedBlock.style.left - multiX});
    
    if(e.ctrlKey) {
      groupedBlocks.map((block) => {
        blocksArrayContext.updateBlockPosition(block.id, {top: block.style.top - multiY, left: block.style.left - multiX});
      });
    }

  }

  //kliknięcie poza elementami powiązanymi z formularzamia powoduje zamknięcie formularzy
  function onClickHandler(e) {
    if(e.target.id === 'gridArea') {
      setSelectedBlock(null);
      setBlockFormElement(null);
      setConnectorFormElement(null);
    }
  }

  //funkcja odpowiedzialna za połączenie dwóch bloków łącznikiem
  function onConnectingBlocks(e, id) {
    e.preventDefault();

    if(connectId === null) {
      setConnectId(id);
      setIsConnecting(true);
      optionsContext.toggleConnectingMode(true);
      setBlockFormElement(null);
      setConnectorFormElement(null);
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

  ///////////////////////////////////////////////////
  //funkcja testowa do sprawdzania zajętości local storage
  // function localStorage () {
  //   let value = '';

  //   for(let key in window.localStorage){
  //       if(window.localStorage.hasOwnProperty(key)){
  //         value += window.localStorage[key];
  //       }
  //   }

  //   return value ? (3 + ((value.length*16)/(8*1024))) + ' KB' : 'Puste (0 KB)';
  // }

  // console.log(localStorage())

  /////////////////////////////////////////////////////

  return (

    <GridLines id="gridArea" className={styles.gridArea} cellWidth={60} strokeWidth={1} cellWidth2={12} onMouseUp={onMouseUpHandler} onMouseMove={isDragging ? onMouseMoveHandler : undefined}
      onClick={onClickHandler}>

      {isConnecting && <Modal />}

      {blocksArrayContext.blocksArray.map((block) => (
          <Block key={block.id} id={block.id} onLeftClick={blockSelectionHandler} onRightClick={onConnectingBlocks} block={block} 
            isSelected={blockFormElement && (blockFormElement.id === block.id) ? true : false} isConnectingStart={connectId && (connectId === block.id)}
            isConnecting={isConnecting} isGrouped={groupedBlocks.find((element) => element.id === block.id)}/>
      ))}

      {connectorsArrayContext.connectorsArray.map((connector) => (
        <Connector key={connector.id} connector={connector} onSelect={connectorSelectionHandler} isConnecting={isConnecting}/>
      ))}

      {blockFormElement && <FormBlock key={blockFormElement.id} blockObject={blockFormElement} type="individual"/>}

      {connectorFormElement && <FormConnector key={connectorFormElement.id} elementObject={connectorFormElement} type="individual"/>}

    </GridLines>
  )
}
