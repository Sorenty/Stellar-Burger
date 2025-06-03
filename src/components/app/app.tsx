import '../../index.css';
import styles from './app.module.css';

import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { AppHeader, OrderInfo, IngredientDetails, Modal } from '@components';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { fetchUser, selectIsAuthenticated } from '../../slices/user-slice';
import { fetchIngredients } from '../../slices/ingredients-slice';
import { closeOrderModalData } from '../../slices/order-slice';

const ProtectedRoute = ({
  children,
  anonymous = false
}: {
  children: JSX.Element;
  anonymous?: boolean;
}) => {
  const isAuth = useSelector(selectIsAuthenticated);

  if (anonymous && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (!anonymous && !isAuth) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

const App = () => {
  const loc = useLocation();
  const goBack = useNavigate();
  const dispatchAction = useDispatch();
  const modalBackground = loc.state?.background;

  useEffect(() => {
    dispatchAction(fetchUser());
    dispatchAction(fetchIngredients());
  }, []);

  const handleModalClose = () => {
    goBack(-1);
    dispatchAction(closeOrderModalData());
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={modalBackground || loc}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {modalBackground && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
