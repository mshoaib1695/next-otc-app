import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './InputOrText.module.css';
import { BUSINESS_MINIMUM_AMOUNT_SWAP } from '../../constants/business';
import { valuesByRange } from '../OTCSwap/valuesByRange';
import PencilSvg from '../_primitives/PencilSVG';

interface Props {
    setSlider: React.Dispatch<React.SetStateAction<number>>;
    swapAmount: number;
    changeSwapAmount: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputOrText = ({
    changeSwapAmount,
    setSlider,
    swapAmount,
}: Props) => {
    const { t } = useTranslation();
    const [toggle, setToggle] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (toggle) inputRef.current?.focus();
    }, [toggle]);

    const handleExit = (value: string) => {
        if (Number(value) < parseFloat(BUSINESS_MINIMUM_AMOUNT_SWAP)) {
            changeSwapAmount({
                target: { value: BUSINESS_MINIMUM_AMOUNT_SWAP },
            } as React.ChangeEvent<HTMLInputElement>);
            setSlider(0);
        } else {
            changeSwapAmount({
                target: { value },
            } as React.ChangeEvent<HTMLInputElement>);
        }
        setToggle(false);
    };

    if (toggle)
        return (
            <input
                ref={inputRef}
                min={BUSINESS_MINIMUM_AMOUNT_SWAP}
                type="number"
                onKeyUp={(e) => {
                    if (e.key === 'Enter') handleExit(e.currentTarget.value);
                }}
                value={inputRef.current?.value}
                onChange={(event) => {
                    changeSwapAmount({
                        target: { value: event.target.value },
                    } as React.ChangeEvent<HTMLInputElement>);
                }}
                onBlur={(e) => handleExit(e.currentTarget.value)}
                className={styles.input}
            />
        );

    return (
        <h2
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                cursor: 'pointer',
            }}
            onClick={() => setToggle(true)}
        >
            {t('airdrop.otc.swapBox.dolarValue', {
                value:
                    valuesByRange[
                        valuesByRange.findIndex((item) => item === swapAmount)
                    ] || swapAmount,
            })}
            <PencilSvg
                fill="#fff"
                height={15}
                style={{ marginLeft: '0.3rem' }}
            />
        </h2>
    );
};
