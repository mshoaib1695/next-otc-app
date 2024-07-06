import { ChangeEvent } from 'react';
import LogoSvg from '../LogoSVG';
import styles from './AirdropRange.module.css';

interface AirdropRangeInputProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}
const AirdropRangeInput = ({ value, min, max, onChange }: AirdropRangeInputProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(event.target.value, 10));
    };

    return (
        <div className={styles.container}>
            <input
                type='range'
                className={styles.input}
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
            />
            <div className={styles.icon}>
                <LogoSvg fill='white' width={30} />
            </div>
        </div>
    );
};

export default AirdropRangeInput;
