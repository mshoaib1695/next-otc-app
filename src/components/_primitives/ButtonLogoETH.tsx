import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const ButtonLogoETH = (props: Props) => {
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
                <g>
                    <path
                        fill='#8C8C8C'
                        d='M58 0H29C12.984 0 0 12.984 0 29c0 16.017 12.984 29 29 29h29V0m-3.917 29c0 13.577-11.006 24.584-24.583 24.584S4.917 42.577 4.917 29 15.923 4.417 29.5 4.417 54.083 15.423 54.083 29z'
                    />
                    <path
                        fill='#F3BA2F'
                        d='M35.215 29l-5.709-5.714-4.222 4.223-.488.483-.999 1 5.709 5.705 5.709-5.693V29z'
                    />
                    <path
                        fill='#343434'
                        d='M28.996 3.793l-.338 1.148v33.336l.338.336 15.473-9.146L28.996 3.793z'
                    />
                    <path fill='#8C8C8C' d='M28.996 3.793L13.521 29.468l15.474 9.146V3.793z' />
                    <path
                        fill='#3C3C3B'
                        d='M28.996 41.544l-.191.232v11.875l.191.556 15.482-21.806-15.482 9.143z'
                    />
                    <path fill='#8C8C8C' d='M28.996 54.207V41.544l-15.474-9.143 15.474 21.806z' />
                    <path fill='#141414' d='M28.996 38.613l15.473-9.146-15.473-7.033v16.179z' />
                    <path fill='#393939' d='M13.521 29.468l15.474 9.146V22.435l-15.474 7.033z' />
                </g>
            </switch>
        </svg>
    );
};

export default ButtonLogoETH;
