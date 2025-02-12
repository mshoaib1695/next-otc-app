import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const LightningBoltSvgComponent = (props: Props) => {
    return (
        <svg
            baseProfile='basic'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            viewBox='0 0 480 480'
            xmlSpace='preserve'
            {...props}
        >
            <switch>
                <g>
                    <g
                    // fill='#FFF'
                    >
                        <path d='M370.024 213.638L255.456 211.176 401.515 12.536 115.084 250.697 239.128 250.653 86.712 467.464z' />
                        <path d='M108.797 398.836c-69.178-56.603-96.327-154.08-60.091-240.641C92.857 52.721 214.581 2.831 320.081 46.992c1.435.602 2.834 1.267 4.233 1.904l11.884-9.883a227.119 227.119 0 00-10.751-4.844C212.898-12.948 82.992 40.28 35.9 152.83c-38.803 92.688-9.51 197.1 64.909 257.394l7.988-11.388zM384.973 71.158l-8.271 11.247c65.104 57.161 89.862 151.725 54.583 235.947-44.028 105.217-165.273 155.09-270.562 111.531l-11.353 10.175c1.718.778 3.436 1.594 5.189 2.32 112.549 47.109 242.438-6.11 289.547-118.66 37.778-90.262 10.982-191.645-59.133-252.56' />
                    </g>
                </g>
            </switch>
        </svg>
    );
};

export default LightningBoltSvgComponent;
