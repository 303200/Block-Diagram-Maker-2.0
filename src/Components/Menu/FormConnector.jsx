import { useContext } from "react"
import { ConnectorsArrayContext } from '../../store/connector-array-context';
import styles from './Form.module.css'

export default function FormConnector({elementObject, type}) {
  
  const connectorsArrayContext = useContext(ConnectorsArrayContext);

  function styleChangeHandler(e, isValidValue = true) {

    if(type === 'default') {
      connectorsArrayContext.updateDefaultCustomStyles(elementObject.type, e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value, isValidValue);
    } else {
      connectorsArrayContext.updateConnectorStyle(elementObject.id, e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value, isValidValue);
    }
  }

  function deleteHandler() {
    connectorsArrayContext.deleteConnector(elementObject.id);
  }

  return (
    <div className={`${styles.container} ${type === 'individual' ? styles.sticky : undefined}`}>
      <div className={styles.section}>
        <div className={styles.element}>
          <label>Strzałka (head): </label>
          <input name='showHead' checked={elementObject.style.showHead} type='checkbox' onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Położenie: </label>
          <select name='endAnchor' value={elementObject.style.startAnchor} onChange={styleChangeHandler}>
              <option value="auto">Automatyczne</option>
              <option value="top">Góra</option>
              <option value="bottom">Dół</option>
              <option value="left">Lewo</option>
              <option value="right">Prawo</option>
          </select>
        </div>
        <div className={styles.element}>
          <label>Kolor: </label>
          <input name='headColor' value={elementObject.style.headColor} type='color' onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Wielkość: </label>
          <input name='headSize' value={elementObject.style.headSize} type='number' onChange={styleChangeHandler}/>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.element}>
          <label>Strzałka (tail): </label>
          <input name='showTail' checked={elementObject.style.showTail} type='checkbox' onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Położenie: </label>
          <select name='startAnchor' value={elementObject.style.endAnchor} onChange={styleChangeHandler}>
              <option value="auto">Automatyczne</option>
              <option value="top">Góra</option>
              <option value="bottom">Dół</option>
              <option value="left">Lewo</option>
              <option value="right">Prawo</option>
          </select>
        </div>
        <div className={styles.element}>
          <label>Kolor: </label>
          <input name='tailColor' value={elementObject.style.tailColor} type='color' onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Wielkość: </label>
          <input name='tailSize' value={elementObject.style.tailSize} type='number' onChange={styleChangeHandler}/>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.element}>
          <label>Kolor lini: </label>
          <input name='lineColor' value={elementObject.style.lineColor} type='color' onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Linia przerywana: </label>
          <input name='dashness' checked={elementObject.style.dashness} type='checkbox' onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Skala łącznika: </label>
          <input name='strokeWidth' value={elementObject.style.strokeWidth} type='number' onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Rodzaj łączenia: </label>
          <select name='path' value={elementObject.style.path} onChange={styleChangeHandler}>
              <option value="smooth">Zaokrąglone</option>
              <option value="grid">Siatka</option>
              <option value="straight">Proste</option>
          </select>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.element}>
          <label>Etykieta: </label>
          <textarea name="middleLabelText" value={elementObject.style.middleLabelText} onChange={styleChangeHandler}/>
        </div>
        <div className={styles.element}>
          <label>Przesunięcie oś X: </label>
          <input name='middleLabelStyleMarginLeft' value={(elementObject.style.middleLabelStyle.marginLeft).slice(0,-2)} type='number' step={10} onChange={(e) => styleChangeHandler(e, false)}/>
        </div>
        <div className={styles.element}>
          <label>Przesunięcie oś Y: </label>
          <input name='middleLabelStyleMarginTop' value={(elementObject.style.middleLabelStyle.marginTop).slice(0,-2)} type='number' step={10} onChange={(e) => styleChangeHandler(e, false)}/>
        </div>
      </div>
      {type === 'individual' && <div className={styles.element}>
        <button onClick={deleteHandler}>Usuń łącznik</button>
      </div>}
    </div>
  )
}
