import React, {useState} from 'react';
import {Text, View, Pressable} from 'react-native';

function Setting() {
  const [count, setCount] = useState(1);
  return (
    <View>
      <Pressable onPress={() => setCount(count + 1)}>
        <Text>{count}</Text>
      </Pressable>
    </View>
  );
}

export default Setting;
