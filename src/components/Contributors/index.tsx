import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Contributors.module.css';

type Contributor = {
    name: string;
    url?: string;
    imgUrl: string;
};

const Contributors = () => {
    const { t } = useTranslation();
    const [contributors, setContributors] = useState<Contributor[]>([]);

    useEffect(() => {
        fetch('/contributors/contributors.json')
            .then((res) => res.json())
            .then((data) => {
                setContributors(data);
            });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>{t('airdrop.partner.header')}</div>
            <div className={styles.items}>
                {contributors.map((item, index) => {
                    if (item.url && item.url.length > 0) {
                        return (
                            <a
                                key={index}
                                href={item.url}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <img src={item.imgUrl} alt={item.name} />
                            </a>
                        );
                    } else {
                        return <img key={index} src={item.imgUrl} alt={item.name} />;
                    }
                })}
            </div>
        </div>
    );
};

export default Contributors;
