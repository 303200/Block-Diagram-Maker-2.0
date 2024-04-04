import { useContext, useEffect } from "react";
import Button from "../Misc/Button";
import styles from "./Form.module.css";
import { OptionsContext } from "../../store/options-context";
import { downloadHandler, uploadHandler, deleteHandler } from "../../Utils/Methods";

export default function FormProject() {
    const optionsContext = useContext(OptionsContext);

    useEffect(() => {
        document.title = optionsContext.projectName || JSON.parse(localStorage.getItem("currentProject")).id;
    }, [optionsContext.projectName]);

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.element}>
                    <label>Nazwa: </label>
                    <input value={optionsContext.projectName} onChange={(e) => optionsContext.setProjectName(e.target.value)} maxLength={40}/>
                </div>
            </div>
            <div className={styles.expandedOptionsContainer}>
                <div className={styles.section}>
                    <div className={styles.expandedOptions}>
                        <div className={styles.specialButton}>
                            <label>Zapisz</label>
                            <Button type="download" onClick={downloadHandler} />
                        </div>
                        <div>
                            <label htmlFor="file" className={styles.specialButton}>
                                Importuj
                                <Button type="upload" />
                            </label>
                            <input id="file" type="file" onChange={(e) => window.confirm("Wczytanie projektu nadpisze obecny projekt. Do obecnego projektu, bez kopii zapasowej, nie będzie można wrócić! Kontunuować?") ? uploadHandler(e) : undefined}/>
                        </div>
                        <div className={styles.specialButton}>
                            <label>Usuń</label>
                            <Button type="trash" onClick={() => window.confirm("Tej operacji nie można cofnąć! Projekt zostanie usunięty. Kontynuować?") ? deleteHandler() : undefined}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
