import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Airdrop from '../../pages/Airdrop';
import Dashboard from '../../pages/Dashboard';
import Early from '../../pages/Early';
import Home from '../../pages/Home';
import LeaderBoard from '../../pages/LeaderBoard';
import NotFoundPage from '../../pages/NotFoundPage';
import OTC from '../../pages/OTC';
import Refer from '../../pages/Refer';

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'airdrop',
                element: <Airdrop />,
            },
            {
                path: 'refer',
                element: <Refer />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'early',
                element: <Early />,
            },
            {
                path: 'leaderBoard',
                element: <LeaderBoard />,
            },
            {
                path: 'otc/:option',
                element: <OTC />,
            },

            {
                path: ':referralCode',
                element: <Home />,
            },
        ],
    },
]);
