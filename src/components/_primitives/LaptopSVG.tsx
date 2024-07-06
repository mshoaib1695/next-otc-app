import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const LaptopSVG = (props: Props) => {
    return (
        <svg
            id='Layer_1'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            viewBox='0 0 13.3 9.2'
            xmlSpace='preserve'
            {...props}
        >
            <path d='M.6 7.8c0 .4.3.7.7.7h10.8c.4 0 .7-.3.7-.7H.6zm6.9.4H5.7c-.1 0-.2-.1-.2-.2h2.2c0 .1 0 .2-.2.2zM1.9 7.6h9.4c.3 0 .6-.3.6-.6V1c0-.3-.3-.6-.6-.6H1.9c-.3 0-.6.3-.6.6v6c.1.3.3.6.6.6zM6.6.7c.1 0 .1.1.1.1 0 .1-.1.1-.1.1-.1 0-.1-.1-.1-.1 0-.1.1-.1.1-.1zM2 1.1h9.3V7H2V1.1z' />
        </svg>
    );
};

export default LaptopSVG;
