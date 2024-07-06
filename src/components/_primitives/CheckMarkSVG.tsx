import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const CheckMark = (props: Props) => {
    return (
        <svg
            baseProfile='basic'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            // width='480px'
            // height='480px'
            viewBox='0 0 480 480'
            xmlSpace='preserve'
            {...props}
        >
            <switch>
                <g>
                    <path
                        // fill='#0FF'
                        d='M146.144 196.508l-32.06 32.038 103.03 103.03 228.901-228.924-32.038-32.06-196.863 196.864-70.97-70.948zM423.13 240c0 100.729-82.401 183.13-183.13 183.13S56.87 340.729 56.87 240 139.271 56.87 240 56.87c18.305 0 34.329 2.302 50.364 6.873l36.607-36.63C299.516 17.96 269.758 11.076 240 11.076 114.084 11.076 11.076 114.084 11.076 240S114.084 468.924 240 468.924c125.905 0 228.924-103.008 228.924-228.924H423.13z'
                    />
                </g>
            </switch>
        </svg>
    );
};

export default CheckMark;
