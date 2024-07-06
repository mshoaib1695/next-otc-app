import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ConnectWallet from '../../components/ButtonConnectWallet';
import { RootState } from '../../state/store';
import styles from './Early.module.css';

const Early = () => {
    const { t } = useTranslation();
    const wallet = useSelector((state: RootState) => state.profile.wallet);

    return (
        <div className={styles.container}>
            <section className={styles.left}>
                <h1>{t('airdrop.early.youare')}</h1>
                <h2>{t('airdrop.early.connect')}</h2>
                <h3>{t('airdrop.early.claim')}</h3>
                {!wallet && (
                    <div className={styles.btnConnect}>
                        <ConnectWallet />
                    </div>
                )}
            </section>
        </div>
    );
};

export default Early;
