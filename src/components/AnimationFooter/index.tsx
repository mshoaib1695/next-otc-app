import { useEffect, useState, memo } from 'react';

import { useGlitch } from 'react-powerglitch';
import outline from '../../assets/footer_logo_state1.png';
import logoRotate6 from '../../assets/footer_logo_rotate6.png';
import './AnimationFooter.css';

interface GlitchImageProps {
    src: string;
    duration: number;
    className: string;
    glitchTimeSpan?:
        | Partial<
              | false
              | {
                    start: number;
                    end: number;
                }
          >
        | undefined;
}

const GlitchImage = memo(({ src, className, glitchTimeSpan, duration }: GlitchImageProps) => {
    const [currentDuration, setCurrentDuration] = useState(duration);

    const defaultOptions = {
        glitchTimeSpan,
        slice: {
            velocity: 20,
            count: 2,
            minHeight: 0.05,
            maxHeight: 0.05,
        },
        shake: { amplitudeX: 0.02, amplitudeY: 0.02, velocity: 10 },
        timing: { duration },
    };

    const { ref, setOptions } = useGlitch(defaultOptions);

    useEffect(() => {
        if (duration !== currentDuration) {
            setCurrentDuration(duration);
            setOptions({ ...defaultOptions, timing: { duration } });
        }
    }, [duration]);

    return <img className={className} ref={ref} src={src} alt='' />;
});

const AnimationFooter = memo(() => {
    const [durations, setDurations] = useState<number[]>([5000, 15000, 25000, 20000, 10000]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDurations((oldDurations) => {
                const newDurations = [...oldDurations];
                for (let i = newDurations.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newDurations[i], newDurations[j]] = [newDurations[j], newDurations[i]];
                }
                return newDurations;
            });
        }, 25000);

        return () => clearInterval(interval);
    }, []);

    const images = [
        {
            className: 'main-outline',
            src: logoRotate6,
            start: 0.1,
            end: 0.16,
            duration: durations[0],
        },
        { className: 'main-outline2', src: outline, start: 0.1, end: 0.16, duration: durations[1] },
        {
            className: 'main-outline3',
            src: logoRotate6,
            start: 0.1,
            end: 0.16,
            duration: durations[2],
        },
        { className: 'main-outline4', src: outline, start: 0.1, end: 0.16, duration: durations[3] },
        {
            className: 'main-outline5',
            src: logoRotate6,
            start: 0.1,
            end: 0.16,
            duration: durations[4],
        },
    ];

    return (
        <div style={{ position: 'fixed', bottom: 0 }}>
            {images.map((image, index) => (
                <GlitchImage
                    key={index}
                    className={image.className}
                    src={image.src}
                    duration={image.duration}
                    glitchTimeSpan={{
                        start: image.start,
                        end: image.end,
                    }}
                />
            ))}
        </div>
    );
});

export default AnimationFooter;
