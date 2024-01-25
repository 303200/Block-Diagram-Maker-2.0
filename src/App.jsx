import styles from './App.module.css'
import BlockArrayContextProvider from './store/block-array-context';
import ConnectorArrayContextProvider from './store/connector-array-context';
import OptionsContextProvider from './store/options-context';
import Canvas from './Components/Canvas/Canvas';
import Menu from './Components/Menu/Menu';

function App() {
  return (
    <OptionsContextProvider>
      <ConnectorArrayContextProvider>
        <BlockArrayContextProvider>
          <div className={styles.container}>
            <Menu />
            <Canvas />
          </div>
        </BlockArrayContextProvider>
      </ConnectorArrayContextProvider>
    </OptionsContextProvider>
  )
}

export default App