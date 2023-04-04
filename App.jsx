/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect, useCallback} from 'react';

import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
   BackHandler, 
   TouchableOpacity,
   Share,
   Alert,
   ActivityIndicator
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import YoutubePlayer from "react-native-youtube-iframe";
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
import backIcon from './src/assets/leftarrow.png';
import whatsappLogo from './src/assets/whatsapplogo.png'

function Section({children, title}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setLoading] = useState(true);
  const [videoList, setVideoList] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [selectedItem, setSelectedItem] = useState({})

const onStateChanged = useCallback(
  (state) => {
    if (state === "ended"){
      setPlaying(false)
    }
    if (state === "playing"){
      setPlaying(true);
    }
    if(state === "paused"){
      setPlaying(false)
    }
  },
  [],
)


  const getVideos = async () => {
    try {
      const response = await fetch('https://www.wisdomapp.in/api/v1/content/');
      setLoading(true)
      console.log(response)
      const json = await response.json();
      setVideoList(json.results.reverse());
      console.log(json.results)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);
  
  const exitApp=()=>{
    BackHandler.exitApp();
  }
  
  const share = () =>{
    try {
      Share.share({
        message: selectedItem.resource_link
        ,
      });
    } catch (error) {
      Alert.alert('Please Select video first')
    }
   
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const listView = ({item})=>{
    let imageUri ={uri: item.channel.logo}
    let thumbnailUri={uri: item.channel.creator.logo}
   return (<View style={styles.listContainer}>
    <Pressable onPress={() => {setSelectedItem(item); setPlaying(true)}}> 
      <Image style={styles.thumbnail} source={thumbnailUri}></Image>
    </Pressable>
     <View style={styles.videoDetails}>
     <Image  style={styles.profileImg} source={imageUri}></Image>
     <View style={{flexDirection:'column',  justifyContent:'center'}}>
     <Text style={styles.videoTitle}>{item.title}</Text>
     <Text style={{color:'grey', fontSize:10, marginVertical:'1%', fontWeight:'500'}}>{item.channel.channel_name}</Text>
     </View>
     </View>
    </View>)
  }
  return (
    <SafeAreaView style={[styles.container]}>
     <View style={styles.header}>
     <TouchableOpacity onPress={exitApp}>
      <Image source={backIcon}></Image>
      </TouchableOpacity>
     <Pressable onPress={share} style={styles.whatsappBtn}>
      <Image source={whatsappLogo}></Image>
      <Text style={styles.shareTxt}>Share</Text>
     </Pressable>
     </View>
     <YoutubePlayer
        height={220}
        width={ScreenWidth}
        play={playing}
        onChangeState={onStateChanged}
        videoId={selectedItem.video_id}
     />
     <View style={[styles.videoDetails,{paddingHorizontal:'5%'}]}>
     <Image  style={styles.profileImg} source={{uri: selectedItem.channel?.logo}}></Image>
     <Text style={styles.videoTitle}>{selectedItem.title}</Text>
     </View>
    <View style={{ flexDirection:'column', paddingHorizontal:'3%'}}>
      <Text style={{fontSize:14, color:'white', marginVertical:10, justifyContent:'center', fontWeight:'600'}}>Up Next</Text>
      { isLoading? <View style={{justifyContent:'center', alignItems:'center'}}> 
      <Text style={{color:'#ffffff', fontSize:20, fontWeight:'bold', marginVertical:'2%'}}> Please Wait! Loading...</Text>
        <ActivityIndicator animating={true} size="large" color="#ffffff"/>
        </View>
       :<FlatList 
      data={videoList}
       renderItem={listView}
         keyExtractor={item => item.id}
      ></FlatList>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
   flex:1,
   height:'100%',
   backgroundColor:'black',
  
  },
  header:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:'5%',
    paddingHorizontal:'5%',
    paddingVertical:'5%'
  },
  whatsappBtn:{
    height:30,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:'4%',
    paddingVertical:'2%',
    borderColor:'grey',
    borderRadius:5,
    borderWidth:1
  },
  shareTxt:{
   color:'#ffffff',
   fontSize:12,
   fontWeight:'400', 
   marginLeft:10
  },
  listContainer:{
   display:'flex',
   flexDirection:'column',
   paddingVertical:'5%',
   paddingHorizontal:'2%'
  },
  thumbnail:{
  height:200,
  borderRadius:5
  },
  profileImg:{
    borderRadius:50,
    height:30,
    width:30,
    marginRight:'5%',
   
  },
  videoTitle:{
    color:'white',
    fontWeight:'600',
    fontSize:14
  },
  videoDetails:{
    display:'flex',
    flexDirection:'row',
    paddingVertical:'2%'
    
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
