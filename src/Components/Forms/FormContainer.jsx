import styles from "./FormContainer.module.css";
import styles2 from "./Form.module.css";
import FormBlock from "./FormBlock";
import { useContext } from "react";
import { OptionsContext } from "../../store/options-context";
import FormConnector from "./FormConnector";

export default function FormContainer() {
    const optionsContext = useContext(OptionsContext);

    return (
        <>
            {optionsContext.formElement.elementType && (
                <div className={styles.container}>
                    {optionsContext.formElement.elementType === "block" && (
                        <>
                            <FormBlock type="individual" blockObject={optionsContext.formElement.elementObject} blocksArray={[]}/>
                            <div className={`${styles2.section} ${styles.cordinates}`}>
                                {`X: ${optionsContext.formElement.elementObject.style.left} Y: ${optionsContext.formElement.elementObject.style.top}`}
                            </div>
                        </>
                    )}
                    {optionsContext.formElement.elementType === "connector" && (
                        <FormConnector type="individual" elementObject={optionsContext.formElement.elementObject} blocksArray={[]}/>
                    )}
                    {optionsContext.formElement?.elementType === "grouped" &&
                        optionsContext.formElement.elementObject.length > 0 && (
                            <FormBlock type="grouped" blockObject={optionsContext.formElement.elementObject[0]} blocksArray={optionsContext.formElement.elementObject}/>
                        )}
                </div>
            )}
        </>
    );
}
