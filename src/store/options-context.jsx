import { createContext, useEffect, useReducer } from "react"
import { v4 as uuidv4 } from 'uuid';

export const OptionsContext = createContext({
    projectName: [],
    connectingMode: Boolean,
    setProjectName: () => {},
    toggleConnectingMode: () => {}
})

function optionsReducer(state, action) {

    if(action.type === 'SET_PROJECT_NAME') {

        let currentProject = JSON.parse(localStorage.getItem("currentProject"));

        currentProject = {
            ...currentProject,
            name: action.payload.name
        };

        localStorage.setItem("currentProject", JSON.stringify(currentProject));

        return {
            ...state,
            projectName: action.payload.name
        };

    } else if (action.type === 'TOGGLE_CONNECTING_MODE') {
        return {
            ...state,
            connectingMode: action.payload.value
        };
    }

    return state;
}

export default function OptionsContextProvider({children, ...restProps}) {
    const [optionsState, optionsDispatch] = useReducer(optionsReducer, {projectName: '', connectingMode: false});

    useEffect(() => {

        const currentProject = localStorage.getItem("currentProject");

        //jeśli nie ma zapisanego aktualnego projektu w pamięci to aplikacja jest uruchamiana po raz pierwszy i trzeba zainicjować niezbędne struktury
        if(!currentProject) {

            let newId = uuidv4();

            let newProject = {id: newId, name: newId};

            localStorage.clear();

            localStorage.setItem("currentProject", JSON.stringify(newProject));
            
        }

        optionsDispatch({
            type: 'SET_PROJECT_NAME',
            payload: {
                name: JSON.parse(localStorage.getItem("currentProject")).name
            }
        });

        //ustawienie tytułu karty jako nazwa projektu (jeśli nie ma nazwy to ustawianie jest id projektu)
        document.title = JSON.parse(localStorage.getItem("currentProject")).name || JSON.parse(localStorage.getItem("currentProject")).id;
    }, [])

    function setProjectNameHandler(name) {
        optionsDispatch({
            type: 'SET_PROJECT_NAME',
            payload: {
                name,
            }
        });
    }

    function toggleConnectingModeHandler(value) {
        optionsDispatch({
            type: 'TOGGLE_CONNECTING_MODE',
            payload: {
                value
            }
        });
    }

    const ctxValue = {
        projectName: optionsState.projectName,
        connectingMode: optionsState.connectingMode,
        setProjectName: setProjectNameHandler,
        toggleConnectingMode: toggleConnectingModeHandler,
    }

    return (
        <OptionsContext.Provider value={ctxValue} {...restProps}>
            {children}
        </OptionsContext.Provider>
    )
}