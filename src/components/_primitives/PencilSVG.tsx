import { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;
const PencilSvg = (props: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="Layer_1"
            x={0}
            y={0}
            // style={{
            //   enableBackground: "new 0 0 20 21",
            // }}
            viewBox="0 0 20 21"
            {...props}
        >
            {/* <style>{".st0{fill:#fff}"}</style> */}
            <path
                d="m7.6 16.9 8.1-8.1.2-.2 1.5-1.5.7-.7c.6-.6.9-1.4.9-2.2 0-.8-.3-1.6-.9-2.2-.6-.6-1.4-.9-2.2-.9s-1.6.3-2.1.9l-.8.8-1.5 1.5-.2.2-8.1 8.1c-.1 0-.1.1-.1.2L1 18.6c0 .1 0 .3.1.4.1.1.2.1.2.1h.1l6-2.1c.1 0 .1 0 .2-.1zm-4.4.9-.8-.8 1.2-3.5.9.9 1.3 1.3.9.9-3.5 1.2zM15.4 8l-1-1-1.3-1.3-1-1 1.2-1.2 3.4 3.4L15.4 8zm-1.1-5.5c.4-.4 1-.7 1.7-.7s1.2.2 1.7.7c.4.4.7 1 .7 1.7 0 .6-.2 1.2-.7 1.7l-.5.5L13.8 3l.5-.5zm-2.7 2.7 1 1 1.3 1.3 1 1-7.7 7.7-1-1L5 13.9l-1-1 7.6-7.7zM2.1 17.7l.4.3-.5.2.1-.5zM18.6 19.2H2.5c-.2 0-.4.2-.4.4s.2.4.4.4h16.1c.2 0 .4-.2.4-.4s-.2-.4-.4-.4z"
                className="st0"
            />
        </svg>
    );
};

export default PencilSvg;
