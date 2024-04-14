import { useContext } from "react";
import styles from "./UpperMenu.module.css";
import { OptionsContext } from "../../store/options-context";
import { downloadHandler, uploadHandler, deleteHandler } from "../../Utils/Methods";
import Button from "../Misc/Button";
import { ChangesContext } from "../../store/changes-array-context";

export default function UpperMenu() {
    const optionsContext = useContext(OptionsContext);

    const changesContext = useContext(ChangesContext);

    return (
        <div className={styles.container}>
            <div className={styles.menuContainer}>
                <div className={styles.nameContainer}>
                    {optionsContext.projectName ? optionsContext.projectName : JSON.parse(localStorage.getItem("currentProject"))?.id}
                </div>
                <div className={styles.optionsContainer}>
                    <div className={styles.option}>
                        <Button type="menu" onClick={() => optionsContext.toggleMainMenu(!optionsContext.isMainMenuVisible)}/>
                    </div>
                    <div className={`${styles.option} ${styles.expandedOption}`} onClick={downloadHandler}>
                        <div className={styles.optionString}> 
                            Zapisz 
                        </div>
                        <Button type="download" />
                    </div>
                    <div>
                        <label htmlFor="file">
                            <div className={`${styles.option} ${styles.expandedOption}`} onChange={(e) => window.confirm("Wczytanie projektu nadpisze obecny projekt. Do obecnego projektu, bez kopii zapasowej, nie będzie można wrócić! Kontunuować?") ? uploadHandler(e) : undefined}>
                                <div className={styles.optionString}>
                                    Importuj
                                </div>
                                <Button type="upload" />
                            </div>
                        </label>
                        <input id="file" type="file" onChange={(e) => window.confirm("Wczytanie projektu nadpisze obecny projekt. Do obecnego projektu, bez kopii zapasowej, nie będzie można wrócić! Kontunuować?") ? uploadHandler(e) : undefined}/>
                    </div>
                    <div className={`${styles.option} ${styles.expandedOption}`} onClick={() => window.confirm("Tej operacji nie można cofnąć! Projekt zostanie usunięty. Kontynuować?") ? deleteHandler() : undefined}>
                        <div className={styles.optionString}> 
                            Usuń 
                        </div>
                        <Button type="trash" />
                    </div>
                    <div className={`${styles.option} ${optionsContext.changesArrayPointer === 0 ? styles.disabledOption : styles.activeOption}`} onClick={changesContext.undo}>
                        <div className={`${styles.optionString} ${optionsContext.changesArrayPointer === 0 ? styles.disabledString : undefined}`}>
                            Cofnij
                        </div>
                        <Button type="back" isDisabled={optionsContext.changesArrayPointer === 0}/>
                    </div>
                    <div className={`${styles.option} ${optionsContext.changesArrayPointer === optionsContext.changesArray.length ? styles.disabledString : styles.activeOption}`} onClick={changesContext.redo}>
                        <div className={`${styles.optionString} ${optionsContext.changesArrayPointer === optionsContext.changesArray.length ? styles.disabledString : undefined}`}>   
                            Powtórz
                        </div>
                        <Button type="forward" isDisabled={optionsContext.changesArrayPointer === optionsContext.changesArray.length}/>
                    </div>
                    <div className={`${styles.option} ${optionsContext.zoom < 0.55 ? styles.disabledOption : styles.activeOption}`} onClick={() => optionsContext.modifyZoomLevel('zoomOut')}>
                        <div className={`${styles.optionString} ${optionsContext.zoom < 0.55 ? styles.disabledString : undefined}`}>   
                            Oddal
                        </div>
                        <Button type="zoomout" isDisabled={optionsContext.zoom < 0.55}/>
                    </div>
                    <div className={`${styles.option} ${optionsContext.zoom === 1 ? styles.disabledOption : styles.activeOption}`} onClick={() => optionsContext.modifyZoomLevel('zoomIn')}>
                        <div className={`${styles.optionString} ${optionsContext.zoom === 1 ? styles.disabledString : undefined}`}>   
                            Powiększ
                        </div>
                        <Button type="zoomin" isDisabled={optionsContext.zoom === 1}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
