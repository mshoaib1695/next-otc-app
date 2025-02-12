import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const ButtonSVG = (props: Props) => {
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
                        // fill='#0FF'
                        d='M58 0H29C12.984 0 0 12.984 0 29c0 16.017 12.984 29 29 29h29V0M29.92 4.114c8.361 0 15.756 4.123 20.276 10.442H9.644C14.164 8.237 21.558 4.114 29.92 4.114m-4.072 28.338l5.162-14.06a.468.468 0 01.44-.309h13.298a.47.47 0 01.284.844l-18.459 14.06c-.373.285-.887-.094-.725-.535m-4.268 1.471a.47.47 0 01-.848.072h-.033l-8.781-15.206a.47.47 0 01.407-.705h14.419a.47.47 0 01.44.633L21.58 33.923zM5 29.034c0-3.919.907-7.625 2.519-10.923L17.704 35.76l10.46 18.127C15.222 52.984 5 42.206 5 29.034m24.514 20.201L24.077 39.8a.47.47 0 01.123-.609l19.437-14.789c.408-.311.948.164.691.608l-5.188 8.984-8.813 15.24a.469.469 0 01-.813.001m2.196 4.649L42.169 35.76l10.152-17.648a24.825 24.825 0 012.519 10.923c0 13.16-10.204 23.931-23.13 24.849'
                    />
                </g>
            </switch>
        </svg>
    );
};

export default ButtonSVG;
