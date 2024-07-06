import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const ButtonLogoBTC = (props: Props) => {
    return (
        <svg
            baseProfile='basic'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            // width='58px'
            // height='58px'
            viewBox='0 0 58 58'
            xmlSpace='preserve'
            {...props}
        >
            <switch>
                <g fill='#F3BA2F'>
                    <path d='M58 0H29C12.984 0 0 12.984 0 29c0 16.017 12.984 29 29 29h29V0m-3.917 29c0 13.577-11.006 24.584-24.583 24.584S4.917 42.577 4.917 29 15.923 4.417 29.5 4.417 54.083 15.423 54.083 29z' />
                    <path d='M19.831 25.026l9.675-9.672 9.68 9.68 5.626-5.631L29.506 4.094 14.2 19.398l5.631 5.628zM4.591 29.004l5.627-5.631 5.63 5.631-5.63 5.626-5.627-5.626zM19.831 32.978l9.675 9.675 9.68-9.679 5.63 5.623L29.51 53.906 14.2 38.608l5.631-5.63zM43.152 29.004l5.626-5.631L54.409 29l-5.631 5.634-5.626-5.63z' />
                    <path d='M35.215 29l-5.709-5.714-4.222 4.223-.488.483-.999 1 5.709 5.705 5.709-5.693V29z' />
                </g>
            </switch>
        </svg>
    );
};

export default ButtonLogoBTC;
