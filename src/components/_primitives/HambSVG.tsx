import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const HambSVG = (props: Props) => {
    return (
        <svg
            viewBox='0 0 32 32'
            // width="32px"
            // height="32px"
            xmlSpace='preserve'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
        >
            <path d='M4 10h24a2 2 0 000-4H4a2 2 0 000 4zm24 4H4a2 2 0 000 4h24a2 2 0 000-4zm0 8H4a2 2 0 000 4h24a2 2 0 000-4z' />
        </svg>
    );
};

export default HambSVG;
