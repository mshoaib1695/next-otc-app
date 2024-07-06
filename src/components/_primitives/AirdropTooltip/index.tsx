import { PropsWithChildren } from 'react';
import styles from './AirdropTooltip.module.css';

type AirdropTooltipProps = PropsWithChildren & {
    tooltipText: string;
};

const AirdropTooltip = ({ children, tooltipText }: AirdropTooltipProps) => {
    return (
        <div className={styles.container}>
            {children}
            <div className={styles.tooltip} aria-label={tooltipText}>
                {tooltipText}
            </div>
        </div>
    );
};

export default AirdropTooltip;
