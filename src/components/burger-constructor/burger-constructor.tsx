import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TIngredient, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';

import {
  createOrder,
  closeOrderModalData,
  selectOrderRequest,
  selectOrderModalData
} from '../../slices/order-slice';

import {
  selectConstructorItems,
  clearBuilder
} from '../../slices/builder-slice';

import { selectUserData } from '../../slices/user-slice';

const BurgerConstructor: FC = () => {
  const dispatchAction = useDispatch();
  const navigateTo = useNavigate();

  const builderItems = useSelector(selectConstructorItems);
  const isSendingOrder = useSelector(selectOrderRequest);
  const modalData = useSelector(selectOrderModalData);
  const currentUser = useSelector(selectUserData);

  const totalPrice = useMemo(() => {
    const bunPrice = builderItems.bun ? builderItems.bun.price * 2 : 0;
    const fillingsPrice = builderItems.ingredients.reduce(
      (acc: number, item: TConstructorIngredient) => acc + item.price,
      0
    );
    return bunPrice + fillingsPrice;
  }, [builderItems]);

  const handleCloseModal = () => {
    dispatchAction(closeOrderModalData());
  };

  const handleOrderSubmit = async () => {
    if (!builderItems.bun || isSendingOrder) return;

    const orderPayload = [
      builderItems.bun._id,
      ...builderItems.ingredients.map((ing) => ing._id),
      builderItems.bun._id
    ];

    if (!currentUser) {
      navigateTo('/login');
      return;
    }

    try {
      await dispatchAction(createOrder(orderPayload));
      dispatchAction(clearBuilder());
    } catch (err) {
      console.error('Order error:', err);
    }
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isSendingOrder}
      constructorItems={builderItems}
      orderModalData={modalData}
      onOrderClick={handleOrderSubmit}
      closeOrderModal={handleCloseModal}
    />
  );
};

export { BurgerConstructor };
