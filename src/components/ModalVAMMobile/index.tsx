import SeedTokensMobile from '../SeedTokensMobile';
import UserDashList from '../UserDashList';
import styles from './ModalVAMMobile.module.css';

type ModalVAMProps = {
    isOpen: boolean;
    onClose: () => void;
};
const ModalVAMMobile = ({ isOpen, onClose }: ModalVAMProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content}>
                <h1>
                    VAM
                    <br />
                    Multiplier
                </h1>
                <div className={styles.seed}>
                    <SeedTokensMobile />
                </div>
                <div className={styles.dashItems}>
                    <UserDashList
                        dashItems={[
                            {
                                label: 'airdrop.vammodal.range',
                                value: '1.00 - 2.00',
                            },
                            {
                                label: 'airdrop.vammodal.calculation',
                                value: '1 + (0.01 MULTIPLIER PER 0.2 ETH SPEND)',
                            },
                            {
                                label: 'airdrop.vammodal.placeholder1',
                                value: 'CALCULATED',
                            },
                            {
                                label: 'airdrop.vammodal.placeholder2',
                                value: 'CALCULATED',
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ModalVAMMobile;
