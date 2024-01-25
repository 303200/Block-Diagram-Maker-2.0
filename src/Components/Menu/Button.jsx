import { Plus, Pencil, Download, Upload, Trash, X } from 'tabler-icons-react';
import styles from './Button.module.css'

export default function Button({type, ...restProps}) {
  return (
    <div {...restProps} className={styles.container}>
      {type === 'plus' && <Plus />}
      {type === 'pencil' && <Pencil />}
      {type === 'trash' && <Trash/>}
      {type === 'download' && <Download/>}
      {type === 'upload' && <Upload/>}
      {type === 'X' && <X/>}
    </div>
  )
}
