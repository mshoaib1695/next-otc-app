import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { JOIN_DISCORD_URL } from '../../constants';
import { RootState } from '../../state/store';
import GenericButton from '../GenericButton';
import ChipReward from '../_primitives/ChipReward';
import CopySvgComponent from '../_primitives/CopySVG';
import styles from './ModalDiscordCode.module.css';

type ModalVAMProps = {
    isOpen: boolean;
    onClose: () => void;
};
const ModalDiscordCode = ({ isOpen, onClose }: ModalVAMProps) => {
    if (!isOpen) return null;
    const { t } = useTranslation();
    const code = useSelector((state: RootState) => state.profile.discordCode.value);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [copied]);

    const copyToClipboard = () => {
        if ('clipboard' in navigator && code) {
            navigator.clipboard
                .writeText(code)
                .then(() => {
                    setCopied(true);
                })
                .catch(() => {});
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <h2>{t('airdrop.discordModal.title')}</h2>
                <p>{t('airdrop.discordModal.subtitle')}</p>
                <div className={styles.codeContainer} onClick={copyToClipboard}>
                    <div className={styles.chip}>
                        <ChipReward text={code?.toUpperCase()} />
                    </div>
                    <div className={styles.btnCopy}>
                        <CopySvgComponent fill='white' width={24} />
                    </div>
                    {copied && (
                        <span className={styles.copied}>{t('airdrop.discordModal.copied')}</span>
                    )}
                </div>
                <div className={styles.buttonJoin}>
                    <GenericButton
                        fill='cyan'
                        textcolor='#000'
                        onClick={() => {
                            window.open(JOIN_DISCORD_URL, '_blank', 'noopener,noreferrer');
                            onClose();
                        }}
                    >
                        {t('airdrop.discordModal.join').toUpperCase()}
                    </GenericButton>
                </div>
            </div>
        </div>
    );
};

export default ModalDiscordCode;
