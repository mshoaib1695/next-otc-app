import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ActivitiesList from '../../components/ActivitiesList';
import ConnectWallet from '../../components/ButtonConnectWallet';
import EarlyAccess from '../../components/EarlyAccess';
import Notable from '../../components/Notable';

import Airdrop from '../../components/Airdrop';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { actions } from '../../state/profile';
import { RootState } from '../../state/store';
import { isMobileDevice } from '../../utils/isMobileDevice';
import styles from './Home.module.css';
import { hasDeviceiOS } from '../../utils/hasDeviceIOS';
import { isMetaMaskBrowser } from '../../utils/isMetaMaskBrowser';

const Home = () => {
    const is2Columns = useMediaQuery('(max-width: 1457px)');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const dispatch = useDispatch();
    const { referralCode } = useParams<{ referralCode: string }>();

    useEffect(() => {
        if (!referralCode) return;
        dispatch(actions.setReferral(referralCode.slice(0, 7)));
    }, [referralCode, dispatch]);

    const { t } = useTranslation();
    const wallet = useSelector((state: RootState) => state.profile.wallet);

    const gridTemplateColumns = is2Columns
        ? `'hashtag activities' 'main activities' 'paragraph activities' 'airdrop activities' 'notable activities'`
        : `'hashtag . activities' 'main airdrop activities' 'paragraph . activities' 'btnConnect . activities' '. notable activities' '. . activities'`;

    const templateArea = wallet
        ? { gridTemplateAreas: gridTemplateColumns }
        : {};
    // const airdropStyle = wallet ? { marginTop: '3rem' } : {};
    const activitiesStyle = wallet ? { maxHeight: '75vh' } : {};

    return (
        <div className={styles.container} style={templateArea}>
            <div className={styles.hashtag}>
                {t('airdrop.home.letsvitruveo')}
            </div>
            <h1 className={styles.title}>
                {t('airdrop.home.create')}
                <br />
                {t('airdrop.home.earn')}
            </h1>
            <h3 className={styles.paragraph}>
                {t('airdrop.home.worldfirst_01')}
                <br style={isMobile ? { display: 'none' } : {}} />
                {t('airdrop.home.worldfirst_02')}
                <br style={isMobile ? { display: 'none' } : {}} />
                {t('airdrop.home.worldfirst_03')}
            </h3>

            {hasDeviceiOS() && !isMetaMaskBrowser() && (
                <img src="iphone-safari-notic.png" width="100%" />
            )}

            {!wallet && (
                <div className={styles.early}>
                    <EarlyAccess
                        referralCode={referralCode?.slice(0, 7) ?? ''}
                        comingSoon={isMobileDevice()}
                    />
                </div>
            )}

            {!wallet && (
                <div className={styles.btnConnect}>
                    <ConnectWallet />
                </div>
            )}

            <div className={styles.airdrop}>
                <Airdrop />
            </div>

            <div className={styles.notable}>
                <Notable />
            </div>

            <div className={styles.activities} style={activitiesStyle}>
                <ActivitiesList />
            </div>
        </div>
    );
};

export default Home;
