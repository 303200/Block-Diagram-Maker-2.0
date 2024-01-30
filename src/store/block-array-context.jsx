import { createContext, useReducer, useEffect, useContext } from "react";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_BLOCKS_STYLES } from '../Utils/BlocksStyles'
import { OptionsContext } from "./options-context";
import { ConnectorsArrayContext } from "./connector-array-context";

export const BlocksArrayContext = createContext({
    blocksArray: [],
    customDefaultStyles: [],
    addNewBlock: () => {},
    updateBlockPosition: () => {},
    updateBlockContent: () => {},
    deleteBlock: () => {},
    updateDefaultCustomStyles: () => {},
    updateBlockStyles: () => {}
});

function blocksArrayReducer(state, action) {

    //związane z tablicą bloków
    if (action.type === 'INIT_BLOCKS_ARRAY') {
        return {
            ...state,
            blocksArray: action.payload.blocksArray
        };
    } else if (action.type === 'ADD_BLOCK'){

        //indywidualny styl dla danego rodzaju bloku
        let blockIndividualStyle = DEFAULT_BLOCKS_STYLES.find((element) => element.type === action.payload.type);

        //styl dla danego rodzaju bloku, który może modyfikować użytkownik
        let blockDefaultStyle = state.customDefaultStyles.find((element) => element.type === action.payload.type);

        let blockStyle = {...blockDefaultStyle.style, ...blockIndividualStyle.style};

        //zapewnienie że blok powstanie w miejscu widocznym na ekranie
        blockStyle.top = Math.floor(window.scrollY/12)*12 + 60;

        blockStyle.left = Math.floor(window.scrollX/12)*12 + 360;

        let newBlock = {id: uuidv4(), content: 'Tekst', type: action.payload.type, style: blockStyle};

        let updatedArray = [...state.blocksArray, newBlock];

        return {
            ...state,
            blocksArray: updatedArray
        };

    } else if (action.type === 'UPDATE_POSITION') {

        let updatedArray = [...state.blocksArray];

        let updatedElement = updatedArray.find((element) => element.id === action.payload.id);
        
        updatedElement.style = {
            ...updatedElement.style,
            top: action.payload.position.top,
            left: action.payload.position.left
        };
        
        return {
            ...state,
            blocksArray: updatedArray,
        };

    } else if (action.type === 'UPDATE_CONTENT') {

        let updatedArray = [...state.blocksArray];

        let updatedElement = updatedArray.find((element) => element.id === action.payload.blockId);

        updatedElement.content = action.payload.content;

        return {
            ...state,
            blocksArray: updatedArray,
        };

    } else if (action.type === 'DELETE') {
        let updatedArray = [...state.blocksArray];

        let updatedElementIndex = updatedArray.findIndex((element) => element.id === action.payload.id);

        updatedArray.splice(updatedElementIndex, 1);

        return {
            ...state,
            blocksArray: updatedArray
        };
    }

    //związane ze stylami bloków
    if(action.type === 'INIT_STYLES') {
        let updatedStyles = [...state.customDefaultStyles];

        updatedStyles = [{type: 'graniczny', style: action.payload.styleObject}, {type: 'wejscia-wyjscia', style: action.payload.styleObject}, 
        {type: 'operacyjny', style: action.payload.styleObject}, {type: 'warunkowy', style: action.payload.styleObject}];

        localStorage.setItem(JSON.stringify(action.payload.keyValue), JSON.stringify(updatedStyles));

        return {
            ...state,
            customDefaultStyles: updatedStyles
        };

    } else if(action.type === 'INIT_STYLES_STORAGE') {
        return {
            ...state,
            customDefaultStyles: action.payload.styleObject
        };
    } else if (action.type === 'UPDATE_STYLES') {
        //zamiana domyślnych stylów bloków zapisywana do localStorage
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));

        const storageStyles = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-blocksStyles`)));

        const updatedStorageStyle = storageStyles.find((element) => element.type === action.payload.blockType);

        let updatedStyle = {...updatedStorageStyle.style}  

        if(action.payload.styleName === 'autoSize') {
            const properValueWidth = `${updatedStyle.widthValue}px`;
            const properValueHeight = `${updatedStyle.heightValue}px`;

            updatedStyle[action.payload.styleName] = action.payload.styleValue
            updatedStyle['width'] = action.payload.styleValue ? 'fit-content' : properValueWidth;
            updatedStyle['height'] = action.payload.styleValue ? 'fit-content' : properValueHeight;
        } else {
            let properValue = action.payload.styleValue;
    
            //czasem wartość musi być zapisana jako wartość + px
            if(!action.payload.isValidValue) {
                properValue += 'px';
            }

            if(action.payload.styleName === 'width') {
                updatedStyle['widthValue'] = action.payload.styleValue;
            }

            if(action.payload.styleName === 'height') {
                updatedStyle['heightValue'] = action.payload.styleValue;
            }
    
            updatedStyle[action.payload.styleName] = properValue;
        }

        updatedStorageStyle.style = updatedStyle;

        localStorage.setItem(JSON.stringify(`${currentProject.id}-blocksStyles`), JSON.stringify(storageStyles));

        return {
            ...state,
            customDefaultStyles: storageStyles
        };
        
    } else if(action.type === 'UPDATE_BLOCK_STYLES') {
        //zamiana stylu konkretnego bloku
        let updatedArray = [...state.blocksArray];

        let updatedElement = updatedArray.find((element) => element.id === action.payload.blockId);

        let updatedStyle = {...updatedElement.style};

        //automatyczny rozmiar bloku potrzebuje specjalnej obsługi
        if(action.payload.styleName === 'autoSize') {
            const properValueWidth = `${updatedStyle.widthValue}px`;
            const properValueHeight = `${updatedStyle.heightValue}px`;

            updatedStyle[action.payload.styleName] = action.payload.styleValue
            updatedStyle['width'] = action.payload.styleValue ? 'fit-content' : properValueWidth;
            updatedStyle['height'] = action.payload.styleValue ? 'fit-content' : properValueHeight;
        } else {

            let properValue = action.payload.styleValue;

            //czasem wartość musi być zapisana jako wartość + px
            if(!action.payload.isValidValue) {
                properValue += 'px'
            }

            updatedStyle[action.payload.styleName] = properValue;
        }

        updatedElement.style = updatedStyle;

        return{
            ...state,
            blocksArray: updatedArray
        };
    }

    return state;
}

export default function BlocksArrayContextProvider({children, ...restProps}) {
    const [blocksArrayState, blocksArrayDispatch] = useReducer(blocksArrayReducer, {blocksArray: [], customDefaultStyles: []});
    
    const optionsContext = useContext(OptionsContext);

    const connectorsArrayContext = useContext(ConnectorsArrayContext);

    //przy pierwszym uruchomieniu sprawdzane jest czy w local storage są odpowiednie struktury
    useEffect(() => {

        const currentProject = localStorage.getItem("currentProject");

        //jeśli currentProject istnieje to znaczy że odpowiednie struktury są w local storage i należy je pobrać
        if(currentProject) {

            const currentProject = JSON.parse(localStorage.getItem("currentProject"));

            const keyValueStyles = `${currentProject.id}-blocksStyles`;

            const keyValueArray = `${currentProject.id}-blocksArray`;
            
            const blocksStyles = JSON.parse(localStorage.getItem(JSON.stringify(keyValueStyles)));

            const blocksArray = JSON.parse(localStorage.getItem(JSON.stringify(keyValueArray)));

            blocksArrayDispatch({
                type: 'INIT_STYLES_STORAGE',
                payload: {
                    keyValueStyles,
                    styleObject: blocksStyles,
                }
            });

            blocksArrayDispatch({
                type: 'INIT_BLOCKS_ARRAY',
                payload: {
                    blocksArray
                }
            });
        } 
        
    }, [])

    //przy pierwszym uruchomieniu, gdy już zostanie zainicjowany currentProject
    useEffect(() => {
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));

        let keyValue = '';

        if(currentProject) {
            keyValue = `${currentProject.id}-blocksStyles`;
        }

        const blocksStyles = localStorage.getItem(JSON.stringify(keyValue));

        //jeśli currentProject istnieje, ale nie ma zapisanych struktur dotyczących bloków
        if(currentProject && !blocksStyles) {

            let blockDefaultStyle = DEFAULT_BLOCKS_STYLES.find((element) => element.type === 'default');

            blocksArrayDispatch({
                type: 'INIT_STYLES',
                payload: {
                    keyValue,
                    styleObject: blockDefaultStyle.style,
                }
            });

            blocksArrayDispatch({
                type: 'INIT_BLOCKS_ARRAY',
                payload: {
                    blocksArray: []
                }
            });
        }

    }, [optionsContext.projectName])

    //gdy zajdzie zmiana w tablicy bloków to zamiany zapisywane są do localStorage
    useEffect(() => {

        const currentProject = JSON.parse(localStorage.getItem("currentProject"));
        
        if(currentProject) {
    
            const keyValueArray = `${currentProject.id}-blocksArray`;
    
            localStorage.setItem(JSON.stringify(keyValueArray), JSON.stringify(blocksArrayState.blocksArray));
    
        }
    }, [blocksArrayState.blocksArray])

    function addNewBlockHandler(blockType) {
        blocksArrayDispatch({
            type: 'ADD_BLOCK',
            payload: {
                type: blockType
            }
        });
    }

    function updateBlockPositionHandler(id, position) {
        blocksArrayDispatch({
            type: 'UPDATE_POSITION',
            payload: {
                position,
                id,
            }
        });
    }

    function updateBlockContentHandler(blockId, content){
        blocksArrayDispatch({
            type: 'UPDATE_CONTENT',
            payload: {
                blockId,
                content
            }
        });
    }

    function deleteBlockHandler(id) {
        connectorsArrayContext.connectorsArray.map((element) => {
            if(element.start === id || element.end === id) {
                connectorsArrayContext.deleteConnector(element.id)
            }
        });

        blocksArrayDispatch({
            type: 'DELETE',
            payload: {
                id,
            }
        });
    }

    function updateDefaultStylesHandler(blockType, styleName, styleValue, isValidValue) {
        blocksArrayDispatch({
            type: 'UPDATE_STYLES',
            payload: {
                blockType,
                styleName,
                styleValue,
                isValidValue
            }
        });
    }

    function updateBlockStylesHandler(blockId, styleName, styleValue, isValidValue) {
        blocksArrayDispatch({
            type: 'UPDATE_BLOCK_STYLES',
            payload: {
                blockId,
                styleName,
                styleValue,
                isValidValue
            }
        });
    }

    const ctxValue = {
        blocksArray: blocksArrayState.blocksArray,
        customDefaultStyles: blocksArrayState.customDefaultStyles,
        addNewBlock: addNewBlockHandler,
        updateBlockPosition: updateBlockPositionHandler,
        updateBlockContent: updateBlockContentHandler,
        deleteBlock: deleteBlockHandler,
        updateDefaultCustomStyles: updateDefaultStylesHandler,
        updateBlockStyles: updateBlockStylesHandler
    };

    return (
        <BlocksArrayContext.Provider value={ctxValue} {...restProps}>
            {children}
        </BlocksArrayContext.Provider>
    )
}