export function downloadHandler() {
    const currentProject = JSON.parse(localStorage.getItem("currentProject"));

    const blocksArray = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-blocksArray`)));

    const connectorsArray = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-connectorsArray`)));

    const blocksStyle = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-blocksStyles`)));

    const connectorsStyle = JSON.parse(localStorage.getItem(JSON.stringify(`${currentProject.id}-connectorsStyles`)));

    if (currentProject.name.length === 0) {
        currentProject.name = currentProject.id;
    }

    const newObject = JSON.stringify({currentProject, blocksArray, connectorsArray, blocksStyle, connectorsStyle});

    const blob = new Blob([newObject], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const fileName = currentProject.name || currentProject.id;

    link.download = fileName + ".json";
    link.href = url;
    link.click();
}

export function uploadHandler(e) {
    let file = e.target.files[0];

    const fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onload = () => {
        const result = JSON.parse(fileReader.result);

        const currentProjectId = result.currentProject.id;

        if (result.currentProject.name.length === 0) {
            result.currentProject.name = result.currentProject.id;
        }

        localStorage.clear();

        localStorage.setItem("currentProject", JSON.stringify(result.currentProject));

        localStorage.setItem(JSON.stringify(`${currentProjectId}-blocksArray`), JSON.stringify(result.blocksArray));

        localStorage.setItem(JSON.stringify(`${currentProjectId}-connectorsArray`), JSON.stringify(result.connectorsArray));

        localStorage.setItem(JSON.stringify(`${currentProjectId}-blocksStyles`), JSON.stringify(result.blocksStyle));

        localStorage.setItem(JSON.stringify(`${currentProjectId}-connectorsStyles`), JSON.stringify(result.connectorsStyle));

        window.location.reload(false);
    };
}

export function deleteHandler() {
    localStorage.clear();

    window.location.reload(false);
}
