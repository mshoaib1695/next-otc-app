import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Navigate } from 'react-router-dom';
import InviteCode from '../../components/InviteCode';
import { RootState } from '../../state/store';
import styles from './Refer.module.css';

const Refer = () => {
    const { t } = useTranslation();
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const shortlink = useSelector((state: RootState) => state.profile.shortlink.value);

    if (!wallet) return <Navigate to='/' />;

    return (
        <div className={styles.container}>
            <h1>{t('airdrop.refer.title')}</h1>
            <h2>{t('airdrop.refer.subtitle')}</h2>
            <h3>{t('airdrop.refer.paragraph')}</h3>
            <div className={styles.invite}>
                <InviteCode url={`${window.location.origin}/${shortlink}`} />
            </div>
        </div>
    );
};

export default Refer;
