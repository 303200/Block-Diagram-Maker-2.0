export const DEFAULT_BLOCKS_STYLES = [
    {
        type: 'default',
        style: {
            autoSize: true,
            widthValue: 120,
            heightValue: 60,

            width: 'fit-content',
            height: 'fit-content',
            top: 60,
            left: 360,
            
            color: '#000000',
            backgroundColor: '#ffffff',
            outline: '',
            borderWidth: '0px',
            borderStyle: 'solid',
            borderColor: '#c2c2c2'
        }
    },
    {
        type: 'graniczny',
        style : {
            borderRadius: 30
        }
    },
    {
        type: 'wejscia-wyjscia',
        style: {
            transform: 'skew(-10deg)',
        }
    },
    {
        type: 'operacyjny',
        style: {
            
        }
    },
    {
        type: 'warunkowy',
        style: {
            transform: 'scaleY(0.4) rotateZ(45deg)'
        }
    }
]