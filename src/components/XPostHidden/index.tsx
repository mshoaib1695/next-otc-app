import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import airdropLogo from '../../assets/icone-airdrop-points.png';
import { RootState } from '../../state/store';
import styles from './XPostHidden.module.css';

const XPostHidden = forwardRef<HTMLDivElement>((_, ref) => {
    const { t } = useTranslation();
    const [{ points }] = useSelector((state: RootState) =>
        state.leaderBoard.leaderboard.slice(0, 1),
    );
    const shortlink = useSelector((state: RootState) => state.profile.shortlink.value);

    return (
        <div ref={ref} className={styles.container}>
            <div className={styles.title}>{t('airdrop.xpost.userRank')}</div>
            <div className={styles.scoreLogo}>
                <div className={styles.score}>{Math.round(points)}</div>
                <img className={styles.airdropLogo} src={airdropLogo} alt='' />
            </div>
            <div className={styles.inviteCode}>{shortlink || ''}</div>
        </div>
    );
});

export default XPostHidden;
XPostHidden.displayName = 'XPost';
