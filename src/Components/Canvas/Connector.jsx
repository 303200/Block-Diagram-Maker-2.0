import Xarrow from "react-xarrows";
import styles from './Connector.module.css'
import { useContext } from "react";
import { ConnectorsArrayContext } from "../../store/connector-array-context";

export default function Connector({connector, onSelect, isConnecting}) {

  const connectorsArrayContext = useContext(ConnectorsArrayContext);

  function onSelectHandler(e) {
    if (e.shiftKey && !isConnecting) {
      connectorsArrayContext.deleteConnector(connector.id);
    } else if(!isConnecting){
      onSelect(e, connector.id);
    }
  }

  return (
    <div onClick={onSelectHandler} className={`${isConnecting ? undefined : styles.container}`}>
      <Xarrow start={connector.start} end={connector.end}
          showHead={connector.style.showHead} startAnchor={connector.style.startAnchor} headColor={connector.style.headColor} headSize={Number(connector.style.headSize)} 
          showTail={connector.style.showTail} endAnchor={connector.style.endAnchor} tailColor={connector.style.tailColor} tailSize={Number(connector.style.tailSize)} 
          color={connector.style.color} lineColor={connector.style.lineColor} strokeWidth={Number(connector.style.strokeWidth)} path={connector.style.path} dashness={connector.style.dashness}
          labels={{middle: <div style={connector.style.middleLabelStyle}>{connector.style.middleLabelText}</div>}}/>
    </div>
  )
}
