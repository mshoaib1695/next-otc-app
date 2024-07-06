import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;
const InfoSVG = (props: Props) => {
    return (
        <svg
            baseProfile='basic'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            x='0px'
            y='0px'
            // width="480px"
            // height="480px"
            viewBox='0 0 480 480'
            xmlSpace='preserve'
            {...props}
        >
            <switch>
                <g>
                    <defs>
                        <path
                            id='a'
                            d='M36.876 36.876H443.12399999999997V443.12399999999997H36.876z'
                        />
                    </defs>
                    <clipPath id='b'>
                        <use xlinkHref='#a' overflow='visible' />
                    </clipPath>
                    <path
                        clipPath='url(#b)'
                        //   fill="#FFF"
                        d='M239.928 36.876c-112.003 0-203.124 91.13-203.124 203.124 0 111.985 91.121 203.124 203.124 203.124 111.985 0 203.124-91.139 203.124-203.124 0-111.994-91.139-203.124-203.124-203.124m0 369.316c-91.662 0-166.192-74.566-166.192-166.192s74.53-166.192 166.192-166.192c91.644 0 166.192 74.566 166.192 166.192s-74.549 166.192-166.192 166.192'
                    />
                    <path
                        clipPath='url(#b)'
                        //   fill="#FFF"
                        d='M218.071 212.301H267.951V357.15999999999997H218.071z'
                    />
                    <path
                        clipPath='url(#b)'
                        //   fill="#FFF"
                        d='M242.993 116.438c-16.302 0-29.898 13.624-29.898 29.935 0 16.284 13.597 29.917 29.898 29.917s29.917-13.633 29.917-29.917c0-16.311-13.615-29.935-29.917-29.935'
                    />
                </g>
            </switch>
        </svg>
    );
};

export default InfoSVG;
