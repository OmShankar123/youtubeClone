import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const animationValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 2000, 
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      
      navigation.replace('YouTube Clone'); 
    });
  }, []);

  const rotation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], 
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/youtube.png')} 
        style={[styles.logo, { transform: [{ rotate: rotation }] }]}
      />
      <Animated.View style={[styles.animationContainer, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>OmTube</Text>
        {/* <Text style={styles.text}>O</Text>
        <Text style={styles.text}>m</Text>
        <Text style={styles.text}>T</Text>
        <Text style={styles.text}>u</Text>
        <Text style={styles.text}>b</Text>
        <Text style={styles.text}>e</Text> */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  logo: {
    height: 150,
    width: 150,
  },
  animationContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    //marginHorizontal: 5,
  },
});

export default SplashScreen;
