import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import React, {useCallback, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import orderSlice, {Order} from '../slices/order';
import {RootState} from '../store/reducer';

function EachOrder({item}: {item: Order}) {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(false);

  const onAccept = useCallback(async () => {
    try {
      setLoading(false);
      await axios.post(
        `${Config.API_URL}/accept`,
        {orderId: item.orderId},
        {
          headers: {authorization: `Bearer ${accessToken}`},
        },
      );
    } catch (error) {
      let errorResponse = (error as AxiosError).response;
      if (errorResponse?.status === 400) {
        // 타인이 이미 수락한 경우
        Alert.alert('알림', errorResponse.data.message);
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
      }
    } finally {
      setLoading(true);
    }
    dispatch(orderSlice.actions.acceptOrder(item.orderId));
  }, [dispatch, item.orderId]);
  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item.orderId]);

  const toggleDetail = useCallback(() => {
    setDetail(!detail);
  }, [detail]);

  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text>삼성동</Text>
        <Text>왕십리동</Text>
      </Pressable>
      {detail && (
        <View>
          <View>
            <Text>네이버맵이 들어갈 장소</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={onAccept}
              disabled={loading}
              style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable
              onPress={onReject}
              disabled={loading}
              style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  //   eachInfo: {
  //     flex: 1,
  //   },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EachOrder;
