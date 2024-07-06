import { useTranslation } from 'react-i18next';
import ChipReward from '../_primitives/ChipReward';
import CopySvgComponent from '../_primitives/CopySVG';
import styles from './InviteCode.module.css';

type InviteCodeProps = {
    url?: string;
};
const InviteCode = ({ url }: InviteCodeProps) => {
    const { t } = useTranslation();
    const copyToClipboard = () => {
        if ('clipboard' in navigator && url) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    // console.log('URL copied to clipboard');
                })
                .catch(() => {
                    // console.error('Não foi possível copiar a URL');
                });
        }
    };
    return (
        <div className={styles.container}>
            <h4 className={styles.invite}>{t('airdrop.invitecode.title').toUpperCase()}</h4>
            <div className={styles.linkContainer}>
                <ChipReward text={url?.toUpperCase()} />
                <div className={styles.btnCopy} onClick={copyToClipboard}>
                    <CopySvgComponent fill='white' width={24} />
                </div>
            </div>
        </div>
    );
};

export default InviteCode;
