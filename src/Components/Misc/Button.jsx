import { Plus, Pencil, Download, Upload, Trash, X, Menu2, ArrowBackUp, ArrowForwardUp } from "tabler-icons-react";
import styles from "./Button.module.css";

export default function Button({ type, isDisabled = false, ...restProps }) {
    return (
        <div {...restProps} className={styles.container}>
            {type === "plus" && <Plus />}
            {type === "pencil" && <Pencil />}
            {type === "trash" && <Trash />}
            {type === "download" && <Download />}
            {type === "upload" && <Upload />}
            {type === "X" && <X />}
            {type === "menu" && <Menu2 />}
            {type === "back" && (<ArrowBackUp color={isDisabled ? "#c7c8c9" : "black"} />)}
            {type === "forward" && (<ArrowForwardUp color={isDisabled ? "#c7c8c9" : "black"} />)}
        </div>
    );
}
