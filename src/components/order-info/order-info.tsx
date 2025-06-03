import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/ingredients-slice';
import { fetchOrderNumber, orderDataSelector } from '../../slices/order-slice';
import { Preloader, OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number = '' } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const allIngredients = useSelector(selectIngredients);
  const order = useSelector(orderDataSelector(number));

  useEffect(() => {
    if (!order) {
      dispatch(fetchOrderNumber(Number(number)));
    }
  }, [dispatch, number, order]);

  const orderDetails = useMemo(() => {
    if (!order || allIngredients.length === 0) return null;

    const createdAt = new Date(order.createdAt);

    const countedIngredients = order.ingredients.reduce(
      (acc, id) => {
        if (!acc[id]) {
          const found = allIngredients.find((ing) => ing._id === id);
          if (found) {
            acc[id] = { ...found, count: 1 };
          }
        } else {
          acc[id].count += 1;
        }
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

    const priceSum = Object.values(countedIngredients).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo: countedIngredients,
      date: createdAt,
      total: priceSum
    };
  }, [order, allIngredients]);

  if (!orderDetails) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderDetails} />;
};
