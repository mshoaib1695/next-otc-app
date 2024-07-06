import { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import styles from './EarlyInput.module.css';

type EarlyInputProps = {
    referralCode?: string;
    maxChars: number;
    onInputChange?: (done: boolean, value: string) => void;
};
const EarlyInput = ({ referralCode, maxChars, onInputChange }: EarlyInputProps) => {
    const [inputs, setInputs] = useState(Array(maxChars).fill(''));
    const refs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        if (referralCode) {
            const newInputs = [...inputs];
            referralCode.split('').forEach((char, index) => {
                newInputs[index] = char;
            });
            setInputs(newInputs);
        }
    }, [referralCode]);

    useEffect(() => {
        if (inputs.every((input) => input !== '')) {
            onInputChange?.(true, inputs.join(''));
            return;
        }
        onInputChange?.(false, '');
    }, [inputs, onInputChange]);

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
        if (value !== '' && index < maxChars - 1) {
            refs.current[index + 1].focus();
        }
    };

    const handleKeyboard = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        const { key } = event;
        if (key === 'Backspace' && index > 0) {
            event.preventDefault();
            const newInputs = [...inputs];
            newInputs[index] = '';
            setInputs(newInputs);
            refs.current[index - 1].focus();
        }
    };

    // Function to handle paste
    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData('Text').slice(0, maxChars).split('');
        const newInputs = [...inputs];

        pastedText.forEach((char, index) => {
            if (index < 7) {
                newInputs[index] = char;
            }
        });
        setInputs(newInputs);

        if (pastedText.length > 0) {
            refs.current[pastedText.length - 1].focus();
        }
    };

    return (
        <div className={styles.earlygroup}>
            {inputs.map((value, index) => (
                <div key={index} className={styles.earlychar}>
                    <input
                        className={styles.input}
                        ref={(el) => (el !== null ? (refs.current[index] = el) : null)}
                        value={value}
                        maxLength={1}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyDown={(e) => handleKeyboard(index, e)}
                        onPaste={(e) => handlePaste(e)}
                    />
                </div>
            ))}
        </div>
    );
};

export default EarlyInput;
