import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import airdropLogo from '../../assets/icone-airdrop-points.png';
import { RootState } from '../../state/store';
import styles from './XPost.module.css';

const XPost = () => {
    const { t } = useTranslation();

    const [{ points }] = useSelector((state: RootState) =>
        state.leaderBoard.leaderboard.slice(0, 1),
    );
    const shortlink = useSelector((state: RootState) => state.profile.shortlink.value);

    return (
        <div className={styles.container}>
            <div className={styles.title}>{t('airdrop.xpost.userRank')}</div>
            <div className={styles.scoreLogo}>
                <div className={styles.score}>{Math.round(points)}</div>
                <img className={styles.airdropLogo} src={airdropLogo} alt='' />
            </div>
            <div className={styles.inviteCode}>{shortlink || ''}</div>
        </div>
    );
};

export default XPost;
XPost.displayName = 'XPost';
