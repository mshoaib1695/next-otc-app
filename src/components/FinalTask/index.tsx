import ModalXPost from '../ModalXPost';
import styles from './FinalTask.module.css';

type FinalTaskProps = {
    isOpen: boolean;
    setModalState: (state: boolean) => void;
    executePost: () => void;
    screenshot: string | null;
};
const FinalTask = ({ isOpen, setModalState, executePost, screenshot }: FinalTaskProps) => {
    return (
        <div className={styles.container}>
            <ModalXPost
                isOpen={isOpen}
                onClose={() => setModalState(false)}
                executePost={executePost}
                screenshot={screenshot}
            />
        </div>
    );
};

export default FinalTask;
