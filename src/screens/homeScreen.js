

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, Dimensions,
   StyleSheet, RefreshControl, Button, BackHandler, ToastAndroid, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import NetInfo from '@react-native-community/netinfo'; 
import Voice from '@react-native-voice/voice';

import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const HomeScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isOnline, setIsOnline] = useState(false); 
  const [foundData,setFoundData]=useState(true);
  const [isBackOnlineMessageVisible, setIsBackOnlineMessageVisible] = useState(false); 

    const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [results, setResults] = useState();
  const screenWidth = Dimensions.get('window').width;
  const inputMaxWidth = screenWidth - 20;
  const [inputWidth] = useState(new Animated.Value(0));

  useEffect(() => {
   if(!!results){
    // const resultsString = results.join(', ');
    const resultsString=results[0];
    setQuery(resultsString);
   }
       
  }, [results]);


  useEffect(() => {
    if(!!query){
     
    handleSearch(query)
    }
        
   }, [query]);



  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);


  useEffect(() => {
    if (visible) {
      
      Animated.timing(inputWidth, {
        toValue: inputMaxWidth, 
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
    
      Animated.timing(inputWidth, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, inputMaxWidth]);

  const onSpeechStart = (e) => {
    console.log("Start",e);
    setStarted(true);
    setEnded(false);
  };

  const onSpeechEnd = (e) => {
    console.log("End",e);
    setEnded(true);
    setStarted(false);
  };

  const onSpeechResults = (e) => {
    setResults(e.value);
    console.log("Data",e.value);

  };

  const startRecognizing = async () => {
    console.log('Function call start');
    try {
      await Voice.start('en-US');
      setStarted(false);
      setEnded(false);
      setResults([]);
    } catch (error) {
      console.log('Error starting recognition:', error);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
      setStarted(false);
      setEnded(false);
      setResults([]);
    } catch (error) {
      console.log('Error stopping recognition:', error);
    }
  };

  const videoListRef = useRef(null);
  const categoryListRef = useRef(null);
  const doubleBackToExitPressedOnce = useRef(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

 

  // useEffect(() => {
  //   if(isOnline===true){
  //   fetchVideos();
  // }
  // }, [isOnline]);

  const handleBackPress = () => {
    if (doubleBackToExitPressedOnce.current) {
      BackHandler.exitApp();
    } else {
      ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
      doubleBackToExitPressedOnce.current = true;
      setTimeout(() => {
        doubleBackToExitPressedOnce.current = false;
      }, 2000);
      return true;
    }
  };

  const handleConnectivityChange = (state) => {
    setIsOnline(state.isConnected);
    if (state.isConnected) {
      setIsBackOnlineMessageVisible(true); 
      setTimeout(() => {
        setIsBackOnlineMessageVisible(false);
      }, 3000);
    }
  };

  const fetchVideos = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('https://impactmindz.in/client/boub/back_end/api/product');
      console.log('API response:', response.data);

      const allVideos = Object.values(response.data.data).flatMap(category => category.map(video => ({
        id: video.p_id,
        title: video.p_name,
        description: video.p_desc,
        thumbnail: video.p_image,
        url: video.url,
        category: video.cat_name,
        create_at: video.create_at

      })));
      setAllVideos(allVideos);

      console.log('Extracted Videos:', allVideos);

      const uniqueCategories = Array.from(new Set(allVideos.map(video => video.category)));
      const allCategories = ['All', ...uniqueCategories];
      setCategories(allCategories);

      setVideos(allVideos);
      setDisplayedVideos(allVideos.slice(0, displayedCount));
      setLoading(false);
      setRefreshing(false);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };
  
  const clearInput = () => {
    setQuery('');
  };


  const handleLoadMore = async () => {
    if (!loadingMore) {
      setLoadingMore(true);

      await new Promise(resolve => setTimeout(resolve, 1500));

      setDisplayedCount(prevCount => prevCount + 10);
      setDisplayedVideos(videos.slice(0, displayedCount + 10));
      setLoadingMore(false);
    }
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('VideoDetail', { video: item, AllVideos: allVideos })}>
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={item.category === "Events" || item.category === "Events" || item.category === "Sales Ads" ||  item.category === "EDITORIAL/BRANDED" || item.category === "EDUCATIONAL" || item.category === "Problem | Solution Ads" ? styles.thumbnail916 : styles.thumbnail}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.description}>{item.description} | {formatDate(item.create_at)}</Text>
          
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategorySelect(item)}>
      <View style={[styles.categoryItem, activeCategory === item && styles.activeCategoryItem]}>
        <Text style={[styles.categoryText, activeCategory === item && styles.activeCategoryText]}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryShimmer = () => (
    <View style={[styles.categoryList,{bottom:0,top:0}]}>
      {[1, 2, 3, 4].map((_, index) => (
        <View key={index} style={[styles.categoryItem, styles.categoryShimmer]} />
      ))}
    </View>
  );

  // const handleSearch = (text) => {
  //   setQuery(text);
  //   setActiveCategory('All');

  //   const filteredVideos = videos.filter(video =>
  //     video.title.toLowerCase().includes(text.toLowerCase()) ||
  //     video.description.toLowerCase().includes(text.toLowerCase()) ||
  //     video.category.toLowerCase().includes(text.toLowerCase())
  //   );

  //   const updatedVideos = [...filteredVideos, ...videos.filter(video => !filteredVideos.includes(video))];
  //   setDisplayedVideos(updatedVideos);

  //   videoListRef.current.scrollToOffset({ animated: true, offset: 0 });
  //   categoryListRef.current.scrollToOffset({ animated: true, offset: 0 });
  // };

  const hasConsecutiveSequence = (text, searchString) => {
    const searchText = text.toLowerCase();
    const searchStr = searchString.toLowerCase();
    const searchTextLength = searchText.length;
    const searchStrLength = searchStr.length;
    
    let j = 0;
    let consecutiveCount = 0; 
    for (let i = 0; i < searchTextLength && j < searchStrLength; i++) {
      if (searchText[i] === searchStr[j]) {
        j++;
        consecutiveCount++;
      } else {
        consecutiveCount = 0;
       // setFoundData(true);
      }
      
      if (consecutiveCount >= 3) {
       // setFoundData(false);
        return true;
      }
    }
    
    return false;
  };
  
  const toggleState = () => {
    setVisible(prevState => !prevState);
    videoListRef.current.scrollToOffset({ animated: true, offset: 0 });
    categoryListRef.current.scrollToOffset({ animated: true, offset: 0 });
    setActiveCategory('All');
    if(visible===true ){
      setQuery('');
      setFoundData(!foundData);
    fetchVideos();
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    setActiveCategory('All');
    

   // setFoundData(false);
  
    const filteredVideos = videos.filter(video =>
      video.title.toLowerCase().includes(text.toLowerCase()) ||
      video.description.toLowerCase().includes(text.toLowerCase()) ||
      video.category.toLowerCase().includes(text.toLowerCase()) ||
      hasConsecutiveSequence(video.title, text) ||
      hasConsecutiveSequence(video.description, text) ||
      hasConsecutiveSequence(video.category, text)
    );

    setFoundData(filteredVideos.length > 0);

  
       const updatedVideos = [...filteredVideos, ...videos.filter(video => !filteredVideos.includes(video))];
    setDisplayedVideos(updatedVideos);
    

  
    videoListRef.current.scrollToOffset({ animated: true, offset: 0 });
    categoryListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };
  




  const onRefresh = () => {
    setFoundData(true);
    setRefreshing(true);
    setQuery('')
    fetchVideos();
    videoListRef.current.scrollToOffset({ animated: true, offset: 0 });
    categoryListRef.current.scrollToOffset({ animated: true, offset: 0 });
    setActiveCategory('All');
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    const filteredVideos = category === 'All' ? videos : videos.filter(video => video.category === category);
    const updatedVideos = [...filteredVideos, ...videos.filter(video => !filteredVideos.includes(video))];
    setDisplayedVideos(updatedVideos);
    videoListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>An error occurred</Text>
      <Button title="Retry" onPress={fetchVideos} />
    </View>
  );

  return (
    <View style={styles.container}>
    
    
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.headerIcon} onPress={() => navigation.navigate('Notifications')}>
            <Image style={{ height: 30, width: 30 }} source={require('../assets/youtube.png')} />
          </View>
          <Text style={styles.headerTitle}>OmTube </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Notifications')}>
            <Icon1 name="bell" size={20} color="#D1D1D9" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} 
         // onPress={() => handleVisible(query)}
         onPress={toggleState}
          >
            <Icon1 name="search" size={20} color="#D1D1D9" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? renderCategoryShimmer() : (
        <FlatList
          ref={categoryListRef}
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      )}

{!error && visible && (
  <View style={styles.searchContainer}>
    <Animated.View style={[styles.animatedInputContainer, { width: inputWidth }]}>
      <TextInput
        placeholder={started ? "Listening..." : "Search Videos..."}
        placeholderTextColor="#808080"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => handleSearch(query)}
        style={styles.searchInput}
      />
      {query && query !== '' &&  (
        <TouchableOpacity onPress={clearInput} style={styles.clearIconContainer}>
          <Icon1 name="x" size={20} color="#D1D1D9" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.searchIconContainer, { backgroundColor: started ? 'rgba(255, 60, 60, 0.8)' : 'rgba(128, 128, 128, 0.3)' }]}
        onPress={started ? stopRecognizing : startRecognizing}
      >
        <Icon name={started ? "stop" : "microphone"} size={started ? 14 : 18} color="#D1D1D9" />
      </TouchableOpacity>
    </Animated.View>
  </View>
)}

{!foundData && !loading && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}> No matches found!</Text>
        </View>
      )}

{isOnline ? null : (
        <View style={styles.offlineMessage}>
          <Text style={styles.offlineText}>You are offline</Text>
        </View>
      )}

{isBackOnlineMessageVisible && isOnline && !loading? (
        <View style={styles.onlineMessage}>
          <Text style={styles.offlineText}>Back online</Text>
        </View>
      ) : null}


      {error ? (
        renderError()
      ) : loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => (
            <View style={styles.videoContainer}>
              <View style={styles.thumbnail} />
              <View style={[styles.textContainer1, { paddingHorizontal: 10, justifyContent: 'space-around' }]}>
                <View style={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', height: 10, width: 250, borderRadius: 10, top: 5, }} />
                <View style={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', height: 10, width: 180, top: 10, borderRadius: 10 }} />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <FlatList
          ref={videoListRef}
          data={displayedVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#CC0000', '#FFFFFF']}
              progressBackgroundColor={'#282828'}
            />
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#CC0000" /> : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  noDataText: {
    color: '#D1D1D9',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: '#000000',
  },
  headerIcon: {
    padding: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryList: {
    height: 55,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  categoryItem: {
   paddingHorizontal: 12,
   paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    marginRight: 10,
    
  },
  categoryText: {
    color: '#D1D1D9',
    fontWeight: '500',
  },
  activeCategoryItem: {
    backgroundColor: '#D1D1D9',
  },
  activeCategoryText: {
    color: '#000000',
    fontWeight: '500',
  },
  categoryShimmer: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
   // marginRight: 10,
    paddingHorizontal:10,
    width: 80,
    height: 30,
  },
  animatedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  clearIconContainer: {
    position: 'absolute',
    right: 50,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 15,
    paddingRight:35,
    color: '#D1D1D9',
    borderRadius: 25,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  searchIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  videoContainer: {
    paddingVertical: 10,
  },
  thumbnail: {
    //aspectRatio: 25 / 9,
    width: '100%',
    height:180,

    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  thumbnail916: {
    width: '100%',
    height: 500,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: '#D1D1D9',
    top: 4,
    marginBottom: 4,
  },
  description: {
    top: 5,
    fontSize: 14,
    color: '#808080',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 20,
    color: '#D1D1D9',
  },
  offlineMessage: {
    backgroundColor: '#FF0000',
    //padding: 5,
    alignItems: 'center',
  },
  onlineMessage: {
    backgroundColor: '#008000',
   // padding: 5,
    alignItems: 'center',
  },
  offlineText: {
    color: '#D1D1D9',
  },
});

export default HomeScreen;
