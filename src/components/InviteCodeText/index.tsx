import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChipReward from '../_primitives/ChipReward';
import CopySvgComponent from '../_primitives/CopySVG';
import styles from './InviteCode.module.css';

type InviteCodeProps = {
    url?: string;
    style?: React.CSSProperties;
};
const InviteCodeText = ({ url, style }: InviteCodeProps) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    const copyToClipboard = () => {
        if ('clipboard' in navigator && url) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    // console.log('URL copied to clipboard');
                    setCopied(true);
                })
                .catch(() => {
                    // console.error('Não foi possível copiar a URL')
                });
        }
    };
    return (
        <div className={styles.linkContainer}>
            <ChipReward
                text={url?.toUpperCase()}
                fill="transparent"
                style={style}
            />
            <div className={styles.btnCopy} onClick={copyToClipboard}>
                <CopySvgComponent fill="white" width={24} />{' '}
                {copied && (
                    <span className={styles.copied}>
                        {t('airdrop.discordModal.copied')}
                    </span>
                )}
            </div>
        </div>
    );
};

export default InviteCodeText;
