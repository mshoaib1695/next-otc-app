import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const HambClose = (props: Props) => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 256 256' {...props}>
            <path d='M16 11c-4.1 1.8-6.4 6.4-5.5 11.2.4 2.1 6.2 8.2 52 54l51.7 51.7-51.7 51.7c-56 56.1-53.2 52.9-52.1 58.6.6 2.9 4.5 6.8 7.4 7.4 5.6 1 2.5 3.9 58.6-52.1l51.7-51.7 51.7 51.7c56 56 52.8 53.2 58.5 52.1 2.9-.6 6.8-4.5 7.4-7.4 1-5.6 3.9-2.5-52.1-58.6L141.8 128l51.7-51.7c56-56 53.2-52.8 52.1-58.5-.6-2.9-4.5-6.8-7.4-7.4-5.6-1-2.5-3.9-58.6 52.1L128 114.2 76.6 62.8C47.8 34 24.4 11.1 23.5 10.8c-2.4-.9-5.2-.8-7.5.2z' />
        </svg>
    );
};

export default HambClose;
