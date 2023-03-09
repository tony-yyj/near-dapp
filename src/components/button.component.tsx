interface ButtonBasicProps {
    children: any;
}
export const ButtonBasic = (props:any) => {
    return (
        <div className='bg-green-400 cursor-pointer' {...props}>
            {props.children}

        </div>
    )
}