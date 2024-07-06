import { useNavigate } from 'react-router-dom';
import OTCStake from '../OTCStake';
import OTCStakeHistory from '../OTCStakeHistory';
import OTCSwap from '../OTCSwap';
import styles from './OTCBox.module.css';

type OTCBoxProps = {
    otcOption: string;
};
const OTCBox = ({ otcOption }: OTCBoxProps) => {
    const navigate = useNavigate();
    return (
        <div className={styles.content}>
            <div className={styles.topButtons}>
                <div className={styles.button}>
                    <button
                        className={otcOption === 'swap' ? styles.active : ''}
                        onClick={() => navigate('/otc/swap')}
                    >
                        <h2>Swap</h2>
                    </button>
                </div>
                <div className={styles.button}>
                    <button
                        className={
                            otcOption === 'stakeAction' || otcOption === 'stakeHistory'
                                ? styles.active
                                : ''
                        }
                        onClick={() => navigate('/otc/stake')}
                    >
                        <h2>Stake</h2>
                    </button>
                </div>
            </div>

            <div className={styles.otcBox}>
                {otcOption === 'swap' && <OTCSwap />}
                {otcOption === 'stakeAction' && <OTCStake />}
                {otcOption === 'stakeHistory' && <OTCStakeHistory />}
            </div>
        </div>
    );
};

export default OTCBox;
