import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import vamLoader from '../../assets/vam-loader.gif';

import { useEffect } from 'react';
import { actions } from '../../state/otcInfo';
import { RootState } from '../../state/store';
import VTRUSVG from '../_primitives/VTRUSVG';
import styles from './SeedTokens.module.css';

const SeedTokens = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const vamMultiplier = useSelector((state: RootState) => state.otcInfo.vamMultiplier);
    const isRunning = useSelector((state: RootState) => state.otcInfo.isRunning);

    useEffect(() => {
        dispatch(actions.startRegisterVAM());
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <h2>{t('airdrop.vammodal.seedTokens')}</h2>
            </div>
            <div className={styles.logo}>
                {!isRunning && (
                    <div className={styles.bonus}>
                        <VTRUSVG fill='white' width={180} />
                        <h1 className={styles.bonusTitle}>
                            {t('airdrop.vammodal.vamBonusValue', { value: vamMultiplier })}
                            <br />
                            {t('airdrop.vammodal.vamBonusTitle')}
                        </h1>
                    </div>
                )}
                {isRunning && <img src={vamLoader} width={210} alt='loader' />}
            </div>
            <div className={styles.footer}>
                <h2>{t('airdrop.vammodal.multiplier')}</h2>
                <h4>{t('airdrop.vammodal.forall')}</h4>
            </div>
        </div>
    );
};

export default SeedTokens;
