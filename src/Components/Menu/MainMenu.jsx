import { useContext } from "react";
import styles from "./MainMenu.module.css";
import MenuElement from "./MenuElement";
import { OptionsContext } from "../../store/options-context";

export default function MainMenu() {
    const optionsContext = useContext(OptionsContext);

    return (
        <div className={styles.fullMenuContainer} style={optionsContext.isMainMenuVisible ? { display: "initial" } : { display: "none" }}>
            <div className={styles.menuElements}>
                <MenuElement title="Projekt" elementType="projekt" />
                <MenuElement title="Blok graniczny" elementType="graniczny" />
                <MenuElement title="Blok wejścia-wyjścia" elementType="wejscia-wyjscia"/>
                <MenuElement title="Blok operacyjny" elementType="operacyjny" />
                <MenuElement title="Blok warunkowy" elementType="warunkowy" />
                <MenuElement title="Łącznik" elementType="connector" />
            </div>
        </div>
    );
}
