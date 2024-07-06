import clsx from 'clsx';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import ButtonLoading from '../_primitives/ButtonLoading';
import ButtonLogoBTC from '../_primitives/ButtonLogoBTC';
import ButtonLogoETH from '../_primitives/ButtonLogoETH';
import ButtonLogoSVG from '../_primitives/ButtonLogoSVG';
import styles from './GenericButton.module.css';

interface GenericButtonProps extends ComponentPropsWithoutRef<'button'> {
    fill?: string;
    width?: number;
    height?: number;
    textcolor?: string;
    textsize?: number;
    textWeight?: string;
    btnSize?: number;
    disabled?: boolean;
    loading?: boolean;
    logo?: 'vtr' | 'eth' | 'btc';
}

const GenericButton = forwardRef<HTMLButtonElement, GenericButtonProps>(
    (
        {
            children,
            btnSize,
            fill = 'black',
            width = 48,
            height = 48,
            textcolor = 'white',
            textsize = 14,
            textWeight = 600,
            disabled = false,
            loading = false,
            logo = 'vtr',
            ...buttonProps
        },
        ref,
    ) => {
        if (loading) {
            fill = '#595959';
        }

        let Logo = ButtonLogoSVG;
        if (logo === 'eth') {
            Logo = ButtonLogoETH;
            fill = '#8C8C8C';
            textcolor = 'black';
        } else if (logo === 'btc') {
            Logo = ButtonLogoBTC;
            fill = '#F3BA2F';
            textcolor = 'black';
        }

        return (
            <button
                type='button'
                ref={ref}
                className={clsx(
                    styles.container,
                    disabled && styles.disabled,
                    loading && styles.loading,
                )}
                disabled={disabled || loading}
                style={{ cursor: disabled || loading ? 'not-allowed' : 'pointer' }}
                {...buttonProps}
            >
                <div className={styles.logo}>
                    <Logo className={styles.svg} fill={fill} width={width} height={height} />
                </div>
                <div
                    className={styles.backButton}
                    style={{
                        backgroundColor: fill,
                        width: btnSize,
                    }}
                >
                    {!loading && (
                        <div
                            className={clsx(styles.content, disabled && styles.disabled)}
                            style={{
                                color: textcolor,
                                fontSize: textsize,
                                fontWeight: textWeight,
                            }}
                        >
                            {children}
                        </div>
                    )}
                    {loading && <ButtonLoading />}
                </div>
            </button>
        );
    },
);

export default GenericButton;
GenericButton.displayName = 'GenericButton';
