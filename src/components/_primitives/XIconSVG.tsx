import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const XIcon = (props: Props) => {
    return (
        <svg
            baseProfile='basic'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            //   width="47.386px"
            //   height="49.153px"
            viewBox='0 0 47.386 49.153'
            xmlSpace='preserve'
            {...props}
        >
            <switch>
                <g>
                    <path
                        // fill="#FFF"
                        d='M36.501 4.209h6.65L28.623 20.814l17.091 22.594H32.332l-10.48-13.702L9.855 43.408H3.202l15.54-17.76L2.347 4.209H16.07l9.472 12.525L36.501 4.209zm-2.334 35.219h3.684l-12.314-16.28L14.065 7.98h-3.952l24.054 31.448z'
                    />
                </g>
            </switch>
        </svg>
    );
};

export default XIcon;
