import {HTMLAttributes} from "react";

interface ButtonBasicProps extends HTMLAttributes<HTMLDivElement>{
    children?: any;
}
export const ButtonBasic = (props: ButtonBasicProps) => {
    return (
        <div {...props} style={{
            minWidth: '100px',
            display: "inline-block",
            borderRadius: '4px',
            padding: '2px 5px',
            color: '#fff',
            background: '#208353',
            cursor: 'pointer',
        }}>
            {props.children}

        </div>
    )
}