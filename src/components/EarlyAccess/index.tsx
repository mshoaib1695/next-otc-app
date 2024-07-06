import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import triangles from '../../assets/triangles.png';
import { actions as notificationActions } from '../../state/notifications';
import { actions } from '../../state/profile';
import EarlyInput from '../EarlyInput';
import GenericButton from '../GenericButton';
import styles from './EarlyAccess.module.css';

interface Props {
    referralCode?: string;
    comingSoon?: boolean;
}

const EarlyAccess = ({ referralCode }: Props) => {
    const { t } = useTranslation();
    const [earlyButtonLabel, setEarlyButtonLabel] = useState<string>(
        'airdrop.early.submit'
    );
    const [inputValue, setInputValue] = useState<string>(referralCode ?? '');
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dispatch = useDispatch();

    const onInputChange = (done: boolean, value: string) => {
        if (done) {
            setEarlyButtonLabel('airdrop.early.redeem');
            setInputValue(value);
            buttonRef.current?.focus();
        } else {
            setEarlyButtonLabel('airdrop.early.submit');
        }
    };

    const validateInput = () => {
        if (inputValue.length === 7) {
            dispatch(actions.setInviteCode(inputValue));
        } else {
            dispatch(
                notificationActions.show({
                    type: 'error',
                    title: 'Invalid Invite Code',
                    message:
                        'The invite code you entered is invalid. Please try again.',
                    buttons: ['OK'],
                })
            );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.header}>{t('airdrop.early.header')}</h2>
                <p className={styles.text}>{t('airdrop.early.text')}</p>
                <div className={styles.input}>
                    <EarlyInput
                        referralCode={referralCode}
                        maxChars={7}
                        onInputChange={onInputChange}
                    />
                </div>
                <div className={styles.button}>
                    <GenericButton
                        ref={buttonRef}
                        fill="white"
                        textcolor="black"
                        onClick={validateInput}
                    >
                        {t(earlyButtonLabel).toUpperCase()}
                    </GenericButton>
                </div>
            </div>

            <div className={styles.trianglesContainer}>
                <img
                    src={triangles}
                    alt="triangles"
                    className={styles.triangles}
                />
            </div>
        </div>
    );
};

export default EarlyAccess;
