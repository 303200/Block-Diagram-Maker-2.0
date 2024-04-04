import styles from "./App.module.css";
import BlockArrayContextProvider from "./store/block-array-context";
import ConnectorArrayContextProvider from "./store/connector-array-context";
import OptionsContextProvider from "./store/options-context";
import Canvas from "./Components/Canvas/Canvas";
import MainMenu from "./Components/Menu/MainMenu";
import FormContainer from "./Components/Forms/FormContainer";
import UpperMenu from "./Components/Menu/UpperMenu";
import ChangesContextProvider from "./store/changes-array-context";

function App() {
    return (
        <OptionsContextProvider>
            <ConnectorArrayContextProvider>
                <BlockArrayContextProvider>
                    <ChangesContextProvider>
                        <div className={styles.mainContainer}>
                            <div className={styles.upperMenuContainer}>
                                <UpperMenu />
                            </div>
                            <div className={styles.container}>
                                <MainMenu />
                                <Canvas />
                                <FormContainer />
                            </div>
                        </div>
                    </ChangesContextProvider>
                </BlockArrayContextProvider>
            </ConnectorArrayContextProvider>
        </OptionsContextProvider>
    );
}

export default App;
