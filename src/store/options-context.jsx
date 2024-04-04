import { createContext, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

export const OptionsContext = createContext({
    projectName: [],
    formElement: {},
    changesArray: [],
    changesArrayPointer: Number,
    isConnectingModeActive: Boolean,
    isMainMenuVisible: Boolean,
    setProjectName: () => {},
    setFormElement: () => {},
    toggleConnectingMode: () => {},
    toggleMainMenu: () => {},
    addToChangesArray: () => {},
    undo: () => {},
    redo: () => {},
});

function optionsReducer(state, action) {
    if (action.type === "SET_PROJECT_NAME") {
        let currentProject = JSON.parse(localStorage.getItem("currentProject"));

        currentProject = {
            ...currentProject,
            name: action.payload.name,
        };

        localStorage.setItem("currentProject", JSON.stringify(currentProject));

        return {
            ...state,
            projectName: action.payload.name,
        };
    } else if (action.type === "SET_FORM_ELEMENT") {
        let newFormElement;

        if (action.payload.elementType === "grouped") {
            //jeśli formularz ma być wyświetlony dla grupy bloków to należy dodać do tablicy
            if (state.formElement.elementObject && state.formElement.elementObject.length) {
                newFormElement = {elementType: action.payload.elementType, elementObject: [...state.formElement.elementObject, action.payload.elementObject]};
            } else {
                newFormElement = {elementType: action.payload.elementType, elementObject: [action.payload.elementObject]};
            }

            return {
                ...state,
                formElement: newFormElement,
            };
        } else {
            //jeśli formularz ma być wyświetlony dla pojedyńczego elementu to należy zapisać
            return {
                ...state,
                formElement: {
                    elementType: action.payload.elementType,
                    elementObject: action.payload.elementObject,
                },
            };
        }
    } else if (action.type === "TOGGLE_CONNECTING_MODE") {
        return {
            ...state,
            isConnectingModeActive: action.payload.value,
        };
    } else if (action.type === "TOGGLE_MAIN_MENU") {
        if (window.innerWidth < 1360 && action.payload.value) {
            return {
                ...state,
                isMainMenuVisible: action.payload.value,
                formElement: { elementType: null, elementObject: null },
            };
        } else {
            return {
                ...state,
                isMainMenuVisible: action.payload.value,
            };
        }
    } else if (action.type === "ADD_CHANGES") {
        let newArray = [...state.changesArray];

        if (state.changesArrayPointer !== state.changesArray.length) {
            newArray = state.changesArray.slice(0, state.changesArrayPointer);
        }

        let updatedArray = [...newArray, action.payload.info];

        return {
            ...state,
            changesArray: updatedArray,
            changesArrayPointer: updatedArray.length,
        };
    } else if (action.type === "UNDO") {
        let newValue = state.changesArrayPointer > 0 ? state.changesArrayPointer - 1 : 0;

        return {
            ...state,
            changesArrayPointer: newValue,
        };
    } else if (action.type === "REDO") {
        let newValue = state.changesArrayPointer === state.changesArray.length ? state.changesArrayPointer : state.changesArrayPointer + 1;

        return {
            ...state,
            changesArrayPointer: newValue
        };
    }

    return state;
}

export default function OptionsContextProvider({ children, ...restProps }) {
    const [optionsState, optionsDispatch] = useReducer(optionsReducer, {projectName: "", formElement: {}, isConnectingModeActive: false, isMainMenuVisible: window.innerWidth < 1360 ? false : true,
        changesArray: [], changesArrayPointer: 0});

    useEffect(() => {
        const currentProject = localStorage.getItem("currentProject");

        //jeśli nie ma zapisanego aktualnego projektu w pamięci to aplikacja jest uruchamiana po raz pierwszy i trzeba zainicjować niezbędne struktury
        if (!currentProject) {
            let newId = uuidv4();

            let newProject = { id: newId, name: newId };

            localStorage.clear();

            localStorage.setItem("currentProject", JSON.stringify(newProject));
        }

        optionsDispatch({
            type: "SET_PROJECT_NAME",
            payload: {
                name: JSON.parse(localStorage.getItem("currentProject")).name,
            },
        });

        //ustawienie tytułu karty jako nazwa projektu (jeśli nie ma nazwy to ustawianie jest id projektu)
        document.title =
            JSON.parse(localStorage.getItem("currentProject")).name ||
            JSON.parse(localStorage.getItem("currentProject")).id;
    }, []);

    function setProjectNameHandler(name) {
        optionsDispatch({
            type: "SET_PROJECT_NAME",
            payload: {
                name,
            },
        });
    }

    function setFormElementHandler(elementType, elementObject) {
        optionsDispatch({
            type: "SET_FORM_ELEMENT",
            payload: {
                elementObject,
                elementType,
            },
        });
    }

    function toggleConnectingModeHandler(value) {
        optionsDispatch({
            type: "TOGGLE_CONNECTING_MODE",
            payload: {
                value,
            },
        });
    }

    function toggleMainMenuHandler(value) {
        optionsDispatch({
            type: "TOGGLE_MAIN_MENU",
            payload: {
                value,
            },
        });
    }

    function addToChangesArrayHandler(info) {
        optionsDispatch({
            type: "ADD_CHANGES",
            payload: {
                info,
            },
        });
    }

    function undoHandler() {
        optionsDispatch({
            type: "UNDO",
        });
    }

    function redoHandler() {
        optionsDispatch({
            type: "REDO",
        });
    }

    const ctxValue = {
        projectName: optionsState.projectName,
        formElement: optionsState.formElement,
        changesArray: optionsState.changesArray,
        changesArrayPointer: optionsState.changesArrayPointer,
        isConnectingModeActive: optionsState.isConnectingModeActive,
        isMainMenuVisible: optionsState.isMainMenuVisible,
        setProjectName: setProjectNameHandler,
        setFormElement: setFormElementHandler,
        toggleConnectingMode: toggleConnectingModeHandler,
        toggleMainMenu: toggleMainMenuHandler,
        addToChangesArray: addToChangesArrayHandler,
        undo: undoHandler,
        redo: redoHandler,
    };

    return (
        <OptionsContext.Provider value={ctxValue} {...restProps}>
            {children}
        </OptionsContext.Provider>
    );
}
