import {ReactNode} from "react";

interface WrapperComponentProps {
    width?: string;
    children: any;
}
function Wrapper(props: WrapperComponentProps) {
    return (
        <div className=' m-auto p-[20px]' style={{
            width: props.width || '100%',
            color: '#fff',

        }}>
            {props.children}
        </div>
    )
}

interface TitleProps{
    title: string;
    children?: ReactNode;
}

function Title (props: TitleProps) {
    return (
        <div style={{
            fontSize: '18px',
            color: '#fff',
            width: '100%',
            fontWeight: 'bold',
            textAlign: 'left',
            borderBottom: '1px solid #fff',
        }}>
            {props.title}
            {props.children}
        </div>
    )
}

Wrapper.Title = Title;
export default Wrapper;
