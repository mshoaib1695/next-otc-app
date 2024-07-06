import { useTranslation } from 'react-i18next';
import SeedTokens from '../SeedTokens';
import UserDashList from '../UserDashList';
import styles from './ModalVAM.module.css';

type ModalVAMProps = {
    isOpen: boolean;
    onClose: () => void;
};
const ModalVAM = ({ isOpen, onClose }: ModalVAMProps) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <h2>{t('airdrop.vammodal.title')}</h2>
                    <div className={styles.items}>
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
                                    label: '',
                                    value: '',
                                },
                                {
                                    label: 'airdrop.vammodal.placeholder1',
                                    value: 'CALCULATED',
                                },
                                {
                                    label: 'airdrop.vammodal.placeholder2',
                                    value: 'CALCULATED',
                                },
                                {
                                    label: 'airdrop.vammodal.placeholder3',
                                    value: 'CALCULATED',
                                },
                            ]}
                        />
                    </div>
                </div>
                <div className={styles.right}>
                    <SeedTokens />
                </div>
            </div>
        </div>
    );
};

export default ModalVAM;
