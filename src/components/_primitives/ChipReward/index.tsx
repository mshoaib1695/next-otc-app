import clsx from 'clsx';

import LightningBoltSvgComponent from '../LightningBolt';
import styles from './ChipReward.module.css';
type ChipRewardProps = {
    fill?: string;
    text?: string;
    style?: React.CSSProperties;
    pulse?: boolean;
};

const ChipReward = ({
    text,
    style,
    fill = '#ffffff66',
    pulse = false,
}: ChipRewardProps) => {
    return (
        <div>
            {pulse ? (
                <div className={clsx(styles.container, styles.pulsate)}>
                    <LightningBoltSvgComponent
                        fill="black"
                        width={50}
                        style={{ marginRight: '10px' }}
                    />
                    <h4 className={styles.normal}>{text}</h4>
                </div>
            ) : (
                <div
                    className={clsx(styles.container)}
                    style={{ backgroundColor: fill, ...style }}
                >
                    <h4 className={styles.normal}>{text}</h4>
                </div>
            )}
        </div>
    );
};

export default ChipReward;
