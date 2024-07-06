import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlobeSvgComponent from '../_primitives/GlobeSVG';
import styles from './LanguageSelector.module.css';

const LanguageSelector = () => {
    const {
        t,
        i18n: { changeLanguage, languages },
    } = useTranslation();

    const changeLanguageHandler = (lng: string) => {
        if (lng === selectedLanguage) return;
        setSelectedLanguage(lng);
        changeLanguage(lng);
        setIsMenuOpen(false);
    };

    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    if (languages.length === 1) return null;
    return (
        <div className={styles.menu}>
            <button className={styles.button} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <GlobeSvgComponent fill='white' width={30} />
            </button>
            {isMenuOpen && (
                <div className={styles.options}>
                    <button onClick={() => changeLanguageHandler('en')}>
                        {t('airdrop.languages.en')}
                    </button>
                    <button onClick={() => changeLanguageHandler('es')}>
                        {t('airdrop.languages.es')}
                    </button>
                    <button onClick={() => changeLanguageHandler('pt')}>
                        {t('airdrop.languages.pt')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
