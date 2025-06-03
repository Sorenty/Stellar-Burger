import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import {
  feedThunk,
  selectOrders,
  selectLoading,
  selectError
} from '../../slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);
  const feedError = useSelector(selectError);
  const orderList = useSelector(selectOrders);

  useEffect(() => {
    dispatch(feedThunk());
  }, [dispatch]);

  const refreshFeed = () => {
    dispatch(feedThunk());
  };

  if (isLoading) return <Preloader />;
  if (feedError) return <div>Ошибка: {feedError.message}</div>;
  if (!orderList.length) return <div>Нет доступных заказов</div>;

  return <FeedUI orders={orderList} handleGetFeeds={refreshFeed} />;
};
