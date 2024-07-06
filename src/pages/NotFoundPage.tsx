import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div>
            <div>Page Not Found</div>
            <Link to='/'>Go to Home</Link>
        </div>
    );
};

export default NotFoundPage;
