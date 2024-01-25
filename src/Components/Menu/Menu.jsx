import styles from './Menu.module.css'
import MenuElement from './MenuElement'

export default function Menu() {

  return (
    <div className={styles.container}>
        <MenuElement title="Blok graniczny" elementType="graniczny"/>
        <MenuElement title="Blok wejścia-wyjścia" elementType="wejscia-wyjscia"/>
        <MenuElement title="Blok operacyjny" elementType="operacyjny"/>
        <MenuElement title="Blok warunkowy" elementType="warunkowy"/>
        <MenuElement title='Łącznik' elementType="connector" />
        <MenuElement title='Projekt' elementType="projekt" />
    </div>
  )
}
