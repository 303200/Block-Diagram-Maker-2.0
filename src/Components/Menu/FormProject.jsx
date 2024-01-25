import { useContext, useEffect, useState } from 'react'
import Button from './Button'
import styles from './Form.module.css'
import { OptionsContext } from '../../store/options-context'

export default function FormProject() {

    const optionsContext = useContext(OptionsContext);

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        document.title = optionsContext.projectName || JSON.parse(localStorage.getItem("currentProject")).id;
    }, [optionsContext.projectName])

    function downloadHandler() {
        const currentProject = JSON.parse(localStorage.getItem("currentProject"));
        const blocksArray = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-blocksArray`)));
        const connectorsArray = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-connectorsArray`)));
        const blocksStyle = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-blocksStyles`)));
        const connectorsStyle = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-connectorsStyles`)));

        const newObject = JSON.stringify({currentProject, blocksArray, connectorsArray, blocksStyle, connectorsStyle})

        const blob = new Blob([newObject], {type: 'text/plain'});

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        
        const fileName = currentProject.name || currentProject.id;

        link.download = fileName + '.json';
        link.href = url;
        link.click();
    }

    function uploadHandler(e) {
        let file = e.target.files[0];

        const fileReader = new FileReader();

        fileReader.readAsText(file);

        fileReader.onload = () => {

            const result = JSON.parse(fileReader.result);

            const currentProjectId = result.currentProject.id;

            localStorage.clear();
            localStorage.setItem("currentProject", JSON.stringify(result.currentProject));
            localStorage.setItem(JSON.stringify(`${currentProjectId}-blocksArray`), JSON.stringify(result.blocksArray));
            localStorage.setItem(JSON.stringify(`${currentProjectId}-connectorsArray`), JSON.stringify(result.connectorsArray));
            localStorage.setItem(JSON.stringify(`${currentProjectId}-blocksStyles`), JSON.stringify(result.blocksStyle));
            localStorage.setItem(JSON.stringify(`${currentProjectId}-connectorsStyles`), JSON.stringify(result.connectorsStyle));
            window.location.reload(false);
        }
    }

    function deleteHandler() {
        localStorage.clear();
        
        window.location.reload(false);
    }

    return (
        <div className={styles.container}>
            <div>
                <label>Nazwa: </label>
                <input value={optionsContext.projectName} onChange={(e) => optionsContext.setProjectName(e.target.value)}/>
            </div>
            <div>
                <Button type='download' onClick={downloadHandler}/>
                <label htmlFor='file'>
                    <Button type='upload'/>
                </label>
                <input id='file' type="file" onChange={uploadHandler}/>
                <Button type='trash' onClick={() => setIsModalVisible(true)}/>
            </div>
            {isModalVisible && <div>
                <div>
                    Tej opracji nie można cofnąć! Projekt zostanie usunięty. Kontynuować?
                </div>
                <button onClick={deleteHandler}>Tak</button>
                <button onClick={() => setIsModalVisible(false)}>Nie</button>
            </div>}
        </div>
    )
}
