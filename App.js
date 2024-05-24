// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import VideoDetailScreen from './src/screens/VideoDetailScreen';

import SplashScreen from './src/screens/splashScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
 <Stack.Screen 
          name="SplashScreen" 
          component={SplashScreen} 
          options={{
            contentContainerStyle: { marginTop: 50 } 
          }}
        />

        <Stack.Screen 
          name="YouTube Clone" 
          component={HomeScreen} 
          options={{
            contentContainerStyle: { marginTop: 50 } 
          }}
        />
        <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import React, { useEffect, useState } from 'react';
// import Voice from '@react-native-voice/voice';
// import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';

// const App = () => {
//   const [started, setStarted] = useState('');
//   const [ended, setEnded] = useState('');
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechResults = onSpeechResults;
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechStart = (e) => {
//     console.log("Start",e);
//     setStarted('✅');
//   };

//   const onSpeechEnd = (e) => {
//     console.log("End",e);
//     setEnded('✅');
//   };

//   const onSpeechResults = (e) => {
//     setResults(e.value);
//     console.log("Data",e.value);
//   };

//   const startRecognizing = async () => {
//     console.log('Function call start');
//     try {
//       await Voice.start('en-US');
//       setStarted('');
//       setEnded('');
//       setResults([]);
//     } catch (error) {
//       console.log('Error starting recognition:', error);
//     }
//   };

//   const stopRecognizing = async () => {
//     try {
//       await Voice.stop();
//       await Voice.destroy();
//       setStarted('');
//       setEnded('');
//       setResults([]);
//     } catch (error) {
//       console.log('Error stopping recognition:', error);
//     }
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Voice to text</Text>
//         <TouchableOpacity onPress={startRecognizing}>
//           <Image style={styles.icon} source={require('./src/assets/youtube.png')} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={stopRecognizing}>
//           <Text>Stop Listening</Text>
//         </TouchableOpacity>
//         <View style={{ marginTop: 50, justifyContent: 'space-evenly' }}>
//           <Text>Started {started}</Text>
//           <Text>Ended {ended}</Text>
//         </View>
//         <View>
//           {results.map((text, index) => (
//             <Text key={index}>{text}</Text>
//           ))}
//         </View>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     color: 'black',
//     alignSelf: 'center',
//     marginTop: 20,
//     fontSize: 20,
//   },
//   icon: {
//     height: 30,
//     width: 30,
//   },
// });

// export default App;


