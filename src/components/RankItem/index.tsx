import clsx from 'clsx';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Avatar from '../_primitives/Avatar';
import styles from './RankItem.module.css';

type RankItemProps = {
    position?: number;
    avatarUrl: string;
    screenName?: string;
    invitedBy?: string;
    invitedByURL?: string;
    invitedByScreenName?: string;
    score?: number;
    self?: boolean;
    backColor?: string;
    wallet: string;
};
const RankItem = ({
    avatarUrl,
    screenName,
    position,
    invitedByScreenName,
    score,
    self,
    backColor = 'cyan',
    wallet,
}: RankItemProps) => {
    const isMobile = useMediaQuery('(max-width: 968px)');
    const formatterBigNumber = Intl.NumberFormat('en', { notation: 'compact' });
    const formatterDecimals = Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
    });

    return (
        <div
            className={styles.container}
            style={{ backgroundColor: backColor }}
        >
            {isMobile ? (
                <h4 className={clsx(styles.position, self && styles.black)}>
                    {position}
                </h4>
            ) : (
                <h2 className={clsx(styles.position, self && styles.black)}>
                    {position}
                </h2>
            )}

            <div className={styles.avatar}>
                <Avatar
                    imageUrl={avatarUrl}
                    name={screenName}
                    color={self ? 'black' : 'white'}
                    as={isMobile ? 'h4' : 'h3'}
                    wallet={wallet}
                />
            </div>
            <div className={styles.invited}>
                {isMobile ? (
                    <h4 className={clsx(styles.invited, self && styles.black)}>
                        {invitedByScreenName}
                    </h4>
                ) : (
                    <h3 className={clsx(styles.invited, self && styles.black)}>
                        {invitedByScreenName}
                    </h3>
                )}
            </div>

            {isMobile ? (
                <h4 className={clsx(styles.score, self && styles.black)}>
                    {score && score > 100_000
                        ? formatterBigNumber.format(score)
                        : formatterDecimals.format(score || 0)}
                </h4>
            ) : (
                <h3 className={clsx(styles.score, self && styles.black)}>
                    {score && score > 100_000
                        ? formatterBigNumber.format(score)
                        : formatterDecimals.format(score || 0)}
                </h3>
            )}
        </div>
    );
};

export default RankItem;
