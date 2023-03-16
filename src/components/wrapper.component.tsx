interface WrapperComponentProps {
    width?: string;
    children: any;
}
function Wrapper(props: WrapperComponentProps) {
    return (
        <div className=' m-auto p-[20px]' style={{
            border: '1px solid #ccc',
            width: props.width || '100%',
            color: '#fff',

        }}>
            {props.children}
        </div>
    )
}

interface TitleProps{
    title: string;
}

function Title (props: TitleProps) {
    return (
        <div style={{
            fontSize: '18px',
            color: '#fff',
            width: '100%',
            fontWeight: 'bold',
            textAlign: 'left'
        }}>
            {props.title}
        </div>
    )
}

Wrapper.Title = Title;
export default Wrapper;
