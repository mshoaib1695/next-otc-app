import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const DiscordIcon = (props: Props) => {
    return (
        <svg
            baseProfile='basic'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            //   width="53.535px"
            //   height="49.153px"
            viewBox='0 0 53.535 49.153'
            xmlSpace='preserve'
            {...props}
        >
            <switch>
                <g>
                    <path
                        // fill="#FFF"
                        d='M44.858 7.482a41.285 41.285 0 00-10.454-3.284c-.451.813-.978 1.91-1.34 2.78a38.397 38.397 0 00-11.586 0c-.362-.87-.9-1.966-1.354-2.78A41.051 41.051 0 009.663 7.49c-6.616 9.998-8.409 19.747-7.514 29.356 4.389 3.277 8.642 5.269 12.82 6.57a31.664 31.664 0 002.748-4.522 26.672 26.672 0 01-4.324-2.104c.362-.269.716-.55 1.059-.839 8.337 3.901 17.396 3.901 25.635 0a25 25 0 001.06.839 26.9 26.9 0 01-4.332 2.11 31.911 31.911 0 002.746 4.52c4.185-1.301 8.441-3.292 12.829-6.573 1.052-11.14-1.797-20.801-7.532-29.365M18.854 30.937c-2.504 0-4.557-2.337-4.557-5.182 0-2.846 2.01-5.185 4.557-5.185 2.545 0 4.598 2.335 4.556 5.185.003 2.845-2.012 5.182-4.556 5.182m16.834 0c-2.503 0-4.556-2.337-4.556-5.182 0-2.846 2.008-5.185 4.556-5.185 2.545 0 4.599 2.335 4.555 5.185-.001 2.845-2.011 5.182-4.555 5.182'
                    />
                </g>
            </switch>
        </svg>
    );
};

export default DiscordIcon;
