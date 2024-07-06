import { useTranslation } from 'react-i18next';

import x_post from '../../assets/x_post.png';
import GenericButton from '../GenericButton';
import styles from './ModalXPost.module.css';

type ModalXPostProps = {
    isOpen: boolean;
    onClose: () => void;
    executePost: () => void;
    screenshot: string | null;
};
const ModalXPost = ({ isOpen, onClose, executePost, screenshot }: ModalXPostProps) => {
    if (!isOpen) return null;
    const { t } = useTranslation();

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.header}>{t('airdrop.xpost.modal.title')}</h2>

                <div className={styles.xpost}>
                    <img
                        src={screenshot || ''}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = x_post;
                        }}
                    />
                </div>

                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <GenericButton
                            fill='white'
                            textcolor='#000'
                            onClick={() => {
                                executePost();
                                onClose();
                            }}
                        >
                            POST ON X
                        </GenericButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalXPost;
