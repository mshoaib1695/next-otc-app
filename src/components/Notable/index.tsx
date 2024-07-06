import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '../_primitives/Avatar';
import styles from './Notable.module.css';

type Notable = {
    screenName: string;
    avatarUrl: string;
    followers: number;
};

const Notable = () => {
    const { t } = useTranslation();
    const [notables, setNotables] = useState<Notable[]>([]);

    useEffect(() => {
        fetch('/notables/notables.json')
            .then((res) => res.json())
            .then((data) => {
                setNotables(data);
            });
    }, []);

    if (notables.length === 0) return null;

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>{t('airdrop.notable.header')}</h2>
            <div className={styles.scrollable}>
                <div className={styles.items}>
                    {notables.map((item, index) => (
                        <div key={index}>
                            <Avatar
                                imageUrl={item.avatarUrl}
                                name={item.screenName}
                            />
                            <p className={styles.followers}>{item.followers}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notable;
