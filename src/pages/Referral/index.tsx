import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import ConnectWallet from '../../components/ButtonConnectWallet';
import { actions } from '../../state/profile';
import { RootState } from '../../state/store';
import styles from './Referral.module.css';

const Referral = () => {
    const { t } = useTranslation();
    const referralCode = useParams<{ referralCode: string }>().referralCode;
    const dispatch = useDispatch();
    const wallet = useSelector((state: RootState) => state.profile.wallet);

    useEffect(() => {
        if (!referralCode) return;
        dispatch(actions.setReferral(referralCode));
    }, [referralCode, dispatch]);

    return (
        <div className={styles.container}>
            <section className={styles.left}>
                <h1>{t('airdrop.referral.title')}</h1>
                {!wallet ? (
                    <div className={styles.btnConnect}>{!wallet && <ConnectWallet />}</div>
                ) : (
                    <Navigate to={'/airdrop'} />
                )}
            </section>
        </div>
    );
};

export default Referral;
