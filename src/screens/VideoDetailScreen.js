

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

const VideoDetailScreen = ({ route }) => {
  const { video, AllVideos } = route.params;
  const [currentVideo, setCurrentVideo] = useState(video);
  const navigation = useNavigation();

  
  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

 
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  const onNavigationStateChange = (navState) => {
    
    const title = navState.title || currentVideo.title;
    const description = navState.loading ? currentVideo.description : '';

  
    if (navState.url !== currentVideo.url) {
      
      const currentIndex = AllVideos.findIndex(item => item.id === currentVideo.id);

     
      if (navState.url === 'about:blank' && currentIndex < AllVideos.length - 1) {
        const nextVideo = AllVideos[currentIndex + 1];
        setCurrentVideo(nextVideo);
      }
    }
  };

  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity onPress={() => setCurrentVideo(item)}>
      <View style={styles.videoItem}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
          <Text style={styles.videoDescription}> | {formatDate(item.create_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
     
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: currentVideo.url }}
          style={styles.video}
          allowsInlineMediaPlayback={true} 
          allowsFullscreenVideo={true}
          onNavigationStateChange={onNavigationStateChange}
        />
      </View>

      
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{currentVideo.title}</Text>
      <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">{currentVideo.description}  | {formatDate(currentVideo.create_at)}</Text>

      {/* List of other videos */}
      <Text style={styles.relatedVideosTitle}>Related Videos</Text>
      <FlatList
        data={AllVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical:10,
    backgroundColor: '#000000',
    color: '#D1D1D9',
  },
  videoContainer: {
    height: 220,
   // width: "100%",
   // aspectRatio: 16 / 9,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    marginBottom: 10,
    
    // justifyContent:'center',
    // alignItems:'center'
  },
  video: {
    backgroundColor: '#000000',
   // paddingHorizontal:10,
  },
  title: {
    fontSize:16 ,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#D1D1D9',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  relatedVideosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#D1D1D9',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  thumbnail: {
    width: 180,
    height: 90,
    borderRadius: 7,
    marginRight: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D1D1D9',
  },
  videoDescription: {
    fontSize: 14,
    color: '#808080',
  },
});

export default VideoDetailScreen;
