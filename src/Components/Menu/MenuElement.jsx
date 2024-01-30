import style from './MenuElement.module.css'
import { useContext, useState } from 'react';
import { BlocksArrayContext } from '../../store/block-array-context';
import Button from './Button';
import FormBlock from './FormBlock';
import FormConnector from './FormConnector';
import { ConnectorsArrayContext } from '../../store/connector-array-context';
import FormProject from './FormProject';
import { OptionsContext } from '../../store/options-context';

export default function MenuElement({title, elementType}) {
  
    const blocksArrayContext = useContext(BlocksArrayContext);

    const optionsContext = useContext(OptionsContext);

    const blockInitialStyles = blocksArrayContext.customDefaultStyles.find((style) => style.type === elementType);

    const connectorsArrayContext = useContext(ConnectorsArrayContext);

    const [isFormVisible, setIsFormVisible] = useState(false);
    
    return (
        <div>
            <div className={style.container}>
                <div>{title}</div>
                <div className={style.buttons}>
                    {(elementType !== 'connector') && (elementType !== 'projekt') && <Button onClick={() => blocksArrayContext.addNewBlock(elementType)} type='plus'/>}
                    {(elementType === 'connector') && (!optionsContext.connectingMode) && <Button type='plus' onClick={() => optionsContext.toggleConnectingMode(true)}/>}
                    {(elementType === 'connector') && (optionsContext.connectingMode) && <Button type='X' onClick={() => optionsContext.toggleConnectingMode(false)}/>}
                    <Button onClick={() => setIsFormVisible(!isFormVisible)} type='pencil'/>
                </div>
            </div>
            {(isFormVisible && elementType === 'projekt') && <FormProject /> }
            {(isFormVisible && elementType === 'connector') && <FormConnector elementObject={connectorsArrayContext.customDefaultStyles} type="default"/> }
            {(isFormVisible && (elementType !== 'connector') && (elementType !== 'projekt')) && <FormBlock blockObject={blockInitialStyles} type="default"/>}
        </div>
  )
}
