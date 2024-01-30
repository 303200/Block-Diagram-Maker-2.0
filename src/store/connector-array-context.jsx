import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_CONNECTORS_STYLES } from '../Utils/ConnectorsStyles'
import { OptionsContext } from "./options-context";

export const ConnectorsArrayContext = createContext({
    connectorsArray: [],
    customDefaultStyles: [],
    addNewConnector: () => {},
    deleteConnector: () => {},
    updateDefaultCustomStyles: () => {},
    updateConnectorStyle: () => {},
})

function connectorsArrayReducer(state, action) {

    //związane z tablicą łączników
    if(action.type === 'INIT_CONNECTORS_ARRAY') {
        return {
            ...state,
            connectorsArray: action.payload.connectorsArray
        };
    } else if (action.type === 'ADD_CONNECTOR') {

        let defaultStyle = {...state.customDefaultStyles.style};

        let newConnector = {id: uuidv4(), start: action.payload.start, end: action.payload.end, style: defaultStyle};

        let updatedArray = [...state.connectorsArray, newConnector];

        return {
            ...state,
            connectorsArray: updatedArray,
        };
    } else if (action.type === 'DELETE') {
        let updatedArray = [...state.connectorsArray];

        let updatedElementIndex = updatedArray.findIndex((element) => element.id === action.payload.id);

        updatedArray.splice(updatedElementIndex, 1);

        return {
            ...state,
            connectorsArray: updatedArray
        };
    } 
    
    //związane ze stylami łączników
    if(action.type === 'INIT_STYLES') {

        localStorage.setItem(JSON.stringify(action.payload.keyValue), JSON.stringify(action.payload.styleObject));

        return {
            ...state,
            customDefaultStyles: action.payload.styleObject
        };
    } else if (action.type === 'INIT_STYLES_STORAGE') {
        return {
            ...state,
            customDefaultStyles: action.payload.styleObject
        };
    } else if (action.type === 'UPDATE_STYLES') {
        //zamiana domyślnych stylów łączników zapisywana do localStorage
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));

        const storageStyles = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-connectorsStyles`)));

        let updatedStyle = {...storageStyles.style}

        let updatedNestedStyle = {...updatedStyle.middleLabelStyle};

        let properValue = action.payload.styleValue + 'px';
        
        if(action.payload.styleName === 'middleLabelStyleMarginLeft') {
            updatedNestedStyle.marginLeft = properValue;
        } else if (action.payload.styleName === 'middleLabelStyleMarginTop') {
            updatedNestedStyle.marginTop = properValue;
        } else {
            updatedStyle[action.payload.styleName] = action.payload.styleValue;
        }

        updatedStyle.middleLabelStyle = updatedNestedStyle;

        storageStyles.style = updatedStyle;

        localStorage.setItem(JSON.stringify(`${currentProject.id}-connectorsStyles`), JSON.stringify(storageStyles));

        return {
            ...state,
            customDefaultStyles: storageStyles,
        };
    } else if (action.type === 'UPDATE_CONNECTOR_STYLES') {
        //zamiana stylu konkretnego łącznika
        let updatedArray = [...state.connectorsArray];

        let updatedObject = updatedArray.find((element) => element.id === action.payload.elementId);

        let updatedStyle = {...updatedObject.style};

        let updatedNestedStyle = {...updatedStyle.middleLabelStyle};

        let properValue = action.payload.styleValue + 'px';

        if(action.payload.styleName === 'middleLabelStyleMarginLeft') {
            updatedNestedStyle.marginLeft = properValue;
        } else if (action.payload.styleName === 'middleLabelStyleMarginTop') {
            updatedNestedStyle.marginTop = properValue;
        } else {
            updatedStyle[action.payload.styleName] = action.payload.styleValue;
        }

        updatedStyle.middleLabelStyle = updatedNestedStyle;

        updatedObject.style = updatedStyle;

        return {
            ...state,
            connectorsArray: updatedArray
        };
    }

    return state;
}

export default function ConnectorsArrayContextProvider({children, ...restProps}) {
    const [connectorsArrayState, connectorsArrayDispatch] = useReducer(connectorsArrayReducer, {connectorsArray: [], customDefaultStyles: []});

    const optionsContext = useContext(OptionsContext);

    //przy pierwszym uruchomieniu sprawdzane jest czy w localStorage są odpowiednie struktury
    useEffect(() => {

        const currentProject = localStorage.getItem("currentProject");

        //jeśli currentProject istnieje to znaczy że odpowiednie struktury są w local storage i należy je pobrać
        if(currentProject) {

            const currentProject = JSON.parse(localStorage.getItem("currentProject"));

            const keyValueStyles = `${currentProject.id}-connectorsStyles`;

            const keyValueArray = `${currentProject.id}-connectorsArray`;
            
            const connectorsStyles = JSON.parse(localStorage.getItem(JSON.stringify(keyValueStyles)));

            const connectorsArray = JSON.parse(localStorage.getItem(JSON.stringify(keyValueArray)));

            connectorsArrayDispatch({
                type: 'INIT_STYLES_STORAGE',
                payload: {
                    keyValueStyles,
                    styleObject: connectorsStyles,
                }
            });

            connectorsArrayDispatch({
                type: 'INIT_CONNECTORS_ARRAY',
                payload: {
                    connectorsArray
                }
            });

        } 

    }, [])

    //przy pierwszym uruchomieniu, gdy już zostanie zainicjowany currentProject
    useEffect(() => {
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));

        let keyValue = '';

        if(currentProject) {
            keyValue = `${currentProject.id}-connectorsStyles`;
        }

        const connectorsStyles = localStorage.getItem(JSON.stringify(keyValue));

        //jeśli currentProject istnieje, ale nie ma zapisanych styli łączników to należy je stworzyć
        if(currentProject && !connectorsStyles) {

            let connectorsDefaultStyle = DEFAULT_CONNECTORS_STYLES.find((element) => element.type === 'default');

            connectorsArrayDispatch({
                type: 'INIT_STYLES',
                payload: {
                    keyValue,
                    styleObject: connectorsDefaultStyle
                }
            });

            connectorsArrayDispatch({
                type: 'INIT_CONNECTORS_ARRAY',
                payload: {
                    connectorsArray: []
                }
            });
        }

    }, [optionsContext.projectName])

    //gdy zajdzie zmiana w tablicy bloków to zamiany zapisywane są do localStorage
    useEffect(() => {

        const currentProject = JSON.parse(localStorage.getItem("currentProject"));
        
        if(currentProject) {
    
            const keyValueArray = `${currentProject.id}-connectorsArray`;
    
            localStorage.setItem(JSON.stringify(keyValueArray), JSON.stringify(connectorsArrayState.connectorsArray));
    
        }
    }, [connectorsArrayState.connectorsArray])
    
    function addNewConnectorHandler(start, end){
        connectorsArrayDispatch({
            type: 'ADD_CONNECTOR',
            payload: {
                start,
                end,
            }
        });
    }

    function deleteConnectorHandler(id) {
        connectorsArrayDispatch({
            type: 'DELETE',
            payload: {
                id,
            }
        });
    }

    function updateDefaultCustomStylesHandler(elementType, styleName, styleValue, isValidValue) {
        connectorsArrayDispatch({
            type: 'UPDATE_STYLES',
            payload: {
                elementType,
                styleName,
                styleValue,
                isValidValue
            }
        });
    }

    function updateConnectorStyleHandler(elementId, styleName, styleValue, isValidValue) {
        connectorsArrayDispatch({
            type: 'UPDATE_CONNECTOR_STYLES',
            payload: {
                elementId,
                styleName,
                styleValue,
                isValidValue
            }
        });
    }

    const ctxValue = {
        connectorsArray: connectorsArrayState.connectorsArray,
        customDefaultStyles: connectorsArrayState.customDefaultStyles,
        addNewConnector: addNewConnectorHandler,
        deleteConnector: deleteConnectorHandler,
        updateDefaultCustomStyles: updateDefaultCustomStylesHandler,
        updateConnectorStyle: updateConnectorStyleHandler,
    }

    return (
        <ConnectorsArrayContext.Provider value={ctxValue} {...restProps}>
            {children}
        </ConnectorsArrayContext.Provider>
    )
}