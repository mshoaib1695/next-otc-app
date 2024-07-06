import { useEffect, useRef, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { useTranslation } from 'react-i18next';
import parachutes04 from '../../assets/parachutes/parachutes_04.png';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import LightningBoltSvgComponent from '../_primitives/LightningBolt';
import styles from './Airdrop.module.css';

const Airdrop = () => {
    const [index, setIndex] = useState(0);
    const [parachuteAnimationFinished, setParachuteAnimationFinished] = useState(false);

    const parachuteRef = useRef<HTMLDivElement | null>(null);

    const is2Columns = useMediaQuery('(max-width: 968px)');

    const parachuteWidth = is2Columns ? 45.3 : 64;
    const parachutePositionLeft = `-${parachuteWidth * 0.6}px`;

    const { t } = useTranslation();

    const textsAnimation = [
        t('airdrop.home.reputation'),
        t('airdrop.home.swapping'),
        t('airdrop.home.staking'),
        t('airdrop.home.farming'),
        t('airdrop.home.rebasing'),
    ];

    const transitions = useTransition(textsAnimation[index], {
        from: {
            transform: `translate3d(0,${index === 1 || index === 3 ? '40px' : '-40px'},0)`,
            opacity: 0,
        },
        enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
        leave: {
            transform: `translate3d(0,${index === 1 || index === 3 ? '-40px' : '40px'},0)`,
            opacity: 0,
        },
        keys: index,
    });

    useEffect(() => {
        const parachute = parachuteRef.current;

        if (!parachute) return;

        const handleAnimationEnd = () => {
            setParachuteAnimationFinished(true);
        };

        parachute.addEventListener('animationend', handleAnimationEnd);

        return () => {
            parachute.removeEventListener('animationend', handleAnimationEnd);
        };
    }, [parachuteRef.current]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % textsAnimation.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [textsAnimation.length]);

    return (
        <h1 className={styles.airdrop}>
            <span>{`${t('airdrop.home.airdrop.earn')}`}</span>
            <span style={{ whiteSpace: 'nowrap', position: 'relative' }}>
                {' '}
                {t('airdrop.home.airdrop.part1')}
                <div className={styles.airdropContainer}>
                    <span
                        className={styles.parachute}
                        ref={parachuteRef}
                        style={{
                            left: parachutePositionLeft,
                        }}
                    >
                        <img src={parachutes04} width={`${parachuteWidth + 2.3}px`} alt='O' />
                    </span>
                    <span
                        style={{
                            display: parachuteAnimationFinished ? 'none' : '',
                        }}
                    >
                        {t('airdrop.home.airdrop.part2')}
                    </span>
                    <span
                        style={{
                            marginLeft: parachuteAnimationFinished
                                ? parachutePositionLeft.replace('-', '')
                                : '0px',
                        }}
                    >
                        {t('airdrop.home.airdrop.part3')}
                    </span>
                </div>
            </span>
            <br />
            <span>{t('airdrop.home.pointsby')}</span>
            <span style={{ marginLeft: '10px' }}>
                <LightningBoltSvgComponent fill='cyan' width={34} />
            </span>
            <span
                id='animated-text'
                style={{
                    color: 'cyan',
                }}
            >
                {transitions((props, item) => (
                    <animated.div style={{ ...props, position: 'absolute' }}>{item}</animated.div>
                ))}
            </span>
        </h1>
    );
};

export default Airdrop;
