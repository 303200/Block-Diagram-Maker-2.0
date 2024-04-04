import { createContext, useContext, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_CONNECTORS_STYLES } from "../Utils/ConnectorsStyles";
import { OptionsContext } from "./options-context";

export const ConnectorsArrayContext = createContext({
    connectorsArray: [],
    customDefaultStyles: [],
    isInitialized: Boolean,
    addNewConnector: () => {},
    deleteConnector: () => {},
    updateDefaultCustomStyles: () => {},
    updateConnectorStyle: () => {},
});

function connectorsArrayReducer(state, action) {
    //związane z tablicą łączników
    if (action.type === "INIT_CONNECTORS_ARRAY") {
        return {
            ...state,
            connectorsArray: action.payload.connectorsArray,
        };
    } else if (action.type === "ADD_CONNECTOR") {
        let defaultStyle = { ...state.customDefaultStyles.style };

        let newConnector = {id: uuidv4(), start: action.payload.start, end: action.payload.end, style: defaultStyle};

        let updatedArray = [...state.connectorsArray, newConnector];

        return {
            ...state,
            connectorsArray: updatedArray,
            isInitialized: true,
        };
    } else if (action.type === "DELETE") {
        let updatedArray = [...state.connectorsArray];

        let updatedElementIndex = updatedArray.findIndex((element) => element.id === action.payload.id);

        updatedArray.splice(updatedElementIndex, 1);

        return {
            ...state,
            connectorsArray: updatedArray,
        };
    }

    //związane ze stylami łączników
    if (action.type === "INIT_STYLES") {
        localStorage.setItem(
            JSON.stringify(action.payload.keyValue),
            JSON.stringify(action.payload.styleObject)
        );

        return {
            ...state,
            customDefaultStyles: action.payload.styleObject,
        };
    } else if (action.type === "INIT_STYLES_STORAGE") {
        return {
            ...state,
            customDefaultStyles: action.payload.styleObject,
        };
    } else if (action.type === "UPDATE_STYLES") {
        //zamiana domyślnych stylów łączników zapisywana do localStorage
        const currentProject = JSON.parse(
            localStorage.getItem("currentProject")
        );

        const storageStyles = JSON.parse(
            localStorage.getItem(
                JSON.stringify(`${currentProject.id}-connectorsStyles`)
            )
        );

        let updatedStyle = { ...storageStyles.style };

        let updatedNestedStyle = { ...updatedStyle.middleLabelStyle };

        let properValue = action.payload.styleValue + "px";

        if (action.payload.styleName === "middleLabelStyleMarginLeft") {
            updatedNestedStyle.marginLeft = properValue;
        } else if (action.payload.styleName === "middleLabelStyleMarginTop") {
            updatedNestedStyle.marginTop = properValue;
        } else {
            updatedStyle[action.payload.styleName] = action.payload.styleValue;
        }

        updatedStyle.middleLabelStyle = updatedNestedStyle;

        storageStyles.style = updatedStyle;

        localStorage.setItem(
            JSON.stringify(`${currentProject.id}-connectorsStyles`),
            JSON.stringify(storageStyles)
        );

        return {
            ...state,
            customDefaultStyles: storageStyles,
        };
    } else if (action.type === "UPDATE_CONNECTOR_STYLES") {
        //zamiana stylu konkretnego łącznika
        let updatedArray = [...state.connectorsArray];

        let updatedObject = updatedArray.find((element) => element.id === action.payload.elementId);

        let updatedStyle = { ...updatedObject.style };

        let updatedNestedStyle = { ...updatedStyle.middleLabelStyle };

        let properValue = action.payload.styleValue;

        if (!action.payload.isValidValue) {
            properValue += "px";
        }

        if (action.payload.styleName === "middleLabelStyleMarginLeft") {
            updatedNestedStyle.marginLeft = properValue;
        } else if (action.payload.styleName === "middleLabelStyleMarginTop") {
            updatedNestedStyle.marginTop = properValue;
        } else {
            updatedStyle[action.payload.styleName] = action.payload.styleValue;
        }

        updatedStyle.middleLabelStyle = updatedNestedStyle;

        updatedObject.style = updatedStyle;

        return {
            ...state,
            connectorsArray: updatedArray,
        };
    }

    return state;
}

export default function ConnectorsArrayContextProvider({children, ...restProps}) {
    const [connectorsArrayState, connectorsArrayDispatch] = useReducer(connectorsArrayReducer, { connectorsArray: [], customDefaultStyles: [], isInitialized: false });

    const optionsContext = useContext(OptionsContext);

    //przy pierwszym uruchomieniu sprawdzane jest czy w localStorage są odpowiednie struktury
    useEffect(() => {
        const currentProject = localStorage.getItem("currentProject");

        //jeśli currentProject istnieje to znaczy że odpowiednie struktury są w local storage i należy je pobrać
        if (currentProject) {
            const currentProject = JSON.parse(
                localStorage.getItem("currentProject")
            );

            const keyValueStyles = `${currentProject.id}-connectorsStyles`;

            const keyValueArray = `${currentProject.id}-connectorsArray`;

            const connectorsStyles = JSON.parse(
                localStorage.getItem(JSON.stringify(keyValueStyles))
            );

            const connectorsArray = JSON.parse(
                localStorage.getItem(JSON.stringify(keyValueArray))
            );

            const filteredConnectorsArray = connectorsArray.filter((connector) => connector.style.showXarrow === true);

            connectorsArrayDispatch({
                type: "INIT_STYLES_STORAGE",
                payload: {
                    keyValueStyles,
                    styleObject: connectorsStyles,
                },
            });

            connectorsArrayDispatch({
                type: "INIT_CONNECTORS_ARRAY",
                payload: {
                    connectorsArray: filteredConnectorsArray,
                },
            });
        }
    }, []);

    //przy pierwszym uruchomieniu, gdy już zostanie zainicjowany currentProject
    useEffect(() => {
        const currentProject = JSON.parse(
            localStorage.getItem("currentProject")
        );

        let keyValue = "";

        if (currentProject) {
            keyValue = `${currentProject.id}-connectorsStyles`;
        }

        const connectorsStyles = localStorage.getItem(JSON.stringify(keyValue));

        //jeśli currentProject istnieje, ale nie ma zapisanych styli łączników to należy je stworzyć
        if (currentProject && !connectorsStyles) {
            let connectorsDefaultStyle = DEFAULT_CONNECTORS_STYLES.find((element) => element.type === "default");

            connectorsArrayDispatch({
                type: "INIT_STYLES",
                payload: {
                    keyValue,
                    styleObject: connectorsDefaultStyle,
                },
            });

            connectorsArrayDispatch({
                type: "INIT_CONNECTORS_ARRAY",
                payload: {
                    connectorsArray: [],
                },
            });
        }
    }, [optionsContext.projectName]);

    //gdy zajdzie zmiana w tablicy bloków to zamiany zapisywane są do localStorage
    useEffect(() => {
        const currentProject = JSON.parse(
            localStorage.getItem("currentProject")
        );

        if (currentProject) {
            const keyValueArray = `${currentProject.id}-connectorsArray`;

            localStorage.setItem(
                JSON.stringify(keyValueArray),
                JSON.stringify(connectorsArrayState.connectorsArray)
            );
        }
    }, [connectorsArrayState.connectorsArray]);

    useEffect(() => {
        if (connectorsArrayState.isInitialized) {
            const prevState = {id: connectorsArrayState.connectorsArray[connectorsArrayState.connectorsArray.length - 1].id, styleName: "showXarrow", styleValue: false, isValidValue: true};
            const newState = {id: connectorsArrayState.connectorsArray[connectorsArrayState.connectorsArray.length - 1].id, styleName: "showXarrow", styleValue: true, isValidValue: true,};

            const obj = {
                culprit: "connector",
                type: "add",
                prevState,
                newState,
            };

            optionsContext.addToChangesArray(obj);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectorsArrayState.connectorsArray.length]);

    function addNewConnectorHandler(start, end) {
        connectorsArrayDispatch({
            type: "ADD_CONNECTOR",
            payload: {
                start,
                end,
            },
        });
    }

    function deleteConnectorHandler(id) {
        const prevState = {id, styleName: "showXarrow", styleValue: true, isValidValue: true};
        const newState = {id, styleName: "showXarrow", styleValue: false, isValidValue: true};

        const obj = {
            culprit: "connector",
            type: "delete",
            prevState,
            newState,
        };

        optionsContext.addToChangesArray(obj);

        connectorsArrayDispatch({
            type: "UPDATE_CONNECTOR_STYLES",
            payload: {
                elementId: id,
                styleName: "showXarrow",
                styleValue: false,
                isValidValue: true,
            },
        });
    }

    function updateDefaultCustomStylesHandler(elementType, styleName, styleValue, isValidValue) {
        connectorsArrayDispatch({
            type: "UPDATE_STYLES",
            payload: {
                elementType,
                styleName,
                styleValue,
                isValidValue,
            },
        });
    }

    function updateConnectorStyleHandler(elementId, styleName, styleValue, isValidValue) {
        connectorsArrayDispatch({
            type: "UPDATE_CONNECTOR_STYLES",
            payload: {
                elementId,
                styleName,
                styleValue,
                isValidValue,
            },
        });
    }

    const ctxValue = {
        connectorsArray: connectorsArrayState.connectorsArray,
        customDefaultStyles: connectorsArrayState.customDefaultStyles,
        isInitialized: connectorsArrayState.isInitialized,
        addNewConnector: addNewConnectorHandler,
        deleteConnector: deleteConnectorHandler,
        updateDefaultCustomStyles: updateDefaultCustomStylesHandler,
        updateConnectorStyle: updateConnectorStyleHandler,
    };

    return (
        <ConnectorsArrayContext.Provider value={ctxValue} {...restProps}>
            {children}
        </ConnectorsArrayContext.Provider>
    );
}
