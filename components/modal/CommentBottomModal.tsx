import { StyleSheet, View, Text, Button, KeyboardAvoidingView, Platform } from "react-native";
import React, { forwardRef, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetFooter, BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput, BottomSheetView, TouchableOpacity, useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet/src';
import BottomModal from "./BottomModal";
import { Dimensions } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Image } from "expo-image";
import { useAuth } from "../../context/authContext";
import { FlashList } from "@shopify/flash-list";
import { AntDesign as Icon } from '@expo/vector-icons';
import { format } from "date-fns";
import { Comment } from "../../types/community";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { SERVER_URL } from "@env";
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Ref = BottomSheet;
type CommentBottomModalProps = {
  post_id: string;
};

const CommentBottomModal = forwardRef<Ref, CommentBottomModalProps>(({ post_id }, ref:any) => {
  const { colors } = useTheme();
  const { user } = useAuth()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["60%", "100%"], []);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback (
    (props: any) => <BottomSheetBackdrop appearsOnIndex={2} disappearsOnIndex={-1} {...props}/>,[]
  )

  const [commentList, setCommentList] = useState<Comment[]>([])
  const [isLoad, setIsLoad] = useState(false);

  const MemoizedRenderItem = memo(({ item }: { item: Comment }) => (
    <View key={item._id} style={styles.itemContainer} className="">
      <View className='w-full flex-row items-start gap-2'>
        <TouchableOpacity activeOpacity={0.6} style={{borderColor:colors.gray}} className='overflow-hidden rounded-full border'>
          <Image
            style={{justifyContent: 'center',
            width:screenWidth * 0.1,
            height:screenWidth * 0.1,
            alignContent:'center',}}
            source={item.profile_img}
            contentFit="cover"
            transition={1000}
          />
        </TouchableOpacity>
  
        <View style={{width:screenWidth * 0.82}} className=''>
          <View className="flex-row gap-1">
            <Text style={{color:colors.text}} className='text-body font-noto'>{item.username}</Text>
            <View style={{transform:[{translateY:3}]}}>
              <Text style={{color:colors.subText}} className='text-detail font-notoLight'>{format(item.comment_date,'dd MMM yyy')}</Text>
            </View>
          </View>
          <Text style={{color:colors.text}} className='text-body font-notoLight'>{item.content}</Text>
        </View>
      </View>
    </View>
  ));

  const getComments = async () => {
    console.log('getComments ',post_id);
    
    try {
      const response = await axios.get(`${SERVER_URL}/community/comment?post_id=${post_id}`);
      const data = response.data

      // console.log('response post detail \n',data);
      if ( data.message === "Post not found") {
        setCommentList([])
        return console.error('Post not found')
      }

      if (data?.length > 0) {
        const formattedComments = data.map((com: any) => ({
          content: com.content ?? '',
          comment_date: com.comment_date ?? '',
          _id: com.create_by._id ?? '',
          username: com.create_by.username ?? '',
          profile_img: com.create_by.profile_img ?? '',
        }));
        setCommentList(formattedComments);
      } else {
        return setCommentList([])
      }

    } catch (error: any){
      console.error('Get Post Error: ',error)
    }
  }

  const [comment, setComment] = useState<string>('')

  const defaultWidth = screenWidth * 0.82;
  const expandedWidth = screenWidth * 0.68;

  const inputWidth = useSharedValue(defaultWidth);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);

  const animateCheck = (text: string) => {
    if (text.length > 0) {
      // Expand input field & show button
      inputWidth.value = withTiming(expandedWidth, { duration: 200 });
      buttonOpacity.value = withTiming(1, { duration: 200 });
      buttonScale.value = withSpring(1);
    } else {
      // Shrink input field & hide button
      inputWidth.value = withTiming(defaultWidth, { duration: 200 });
      buttonOpacity.value = withTiming(0, { duration: 200 });
      buttonScale.value = withSpring(0.8);
    }
  }

  const triggerMediumHaptics = async () => {
    comment === '' && await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    console.log('Haptics triggered');
  };

  const triggerSuccessHaptics = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    console.log('Haptics triggered');
  };

  const handleTextChange = (text: string) => {
    setComment(text);
    animateCheck(text);
  };

  const handleComment = async () => {
    console.log('send comment',comment );
    console.log('send comment post_id:',post_id );
    triggerSuccessHaptics()

    try {
      const response = await axios.post(`${SERVER_URL}/community/comment/create?post_id=${post_id}`, {
        content: comment,
        create_by: user?._id || '',
        comment_date: new Date(),
      });
      const data = response.data

      console.log('response comment \n',data);
      if ( data.message === "Post not found") {
        return console.log('Post not found to add comment');
      }

      if (data.message === "Create comment success") {
        setCommentList((prev) => [
          {
            _id: user?._id ?? '',
            username: user?.displayName ?? 'Unknown',
            profile_img: user?.photoURL ?? '',
            content: data.comment.content ?? '',
            comment_date: data.comment.comment_date ?? '',
          },
          ...(prev ?? [])
        ]);

        setComment('')
      } else {
        return
      }

    } catch (error: any){
      console.error('Get Post Error: ',error)
    }
  }

  const animatedInputStyle = useAnimatedStyle(() => ({
    width: inputWidth.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const [isVisible, setIsVisible] = useState<number>(-1)
  const handleSheetChanges = useCallback((index: number) => {
    setIsVisible(index)
  }, []);

  useLayoutEffect(() => {
    if (isVisible === 0) {
      setIsLoad(true);
      setComment('');
      getComments().finally(() => setIsLoad(false));
    }
    if (isVisible === -1) {
      setIsLoad(true);
      setComment('');
      setCommentList([])
    }
  }, [post_id, isVisible]);

  return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        onChange={handleSheetChanges}
        backgroundStyle={{flex:1,backgroundColor:colors.white, borderRadius:30,}}
        handleIndicatorStyle={{backgroundColor:colors.nonFocus, width:100}}
        backdropComponent={renderBackdrop}
        // footerComponent={renderFooter}
        maxDynamicContentSize={screenHeight}
        containerStyle={{marginTop:70, paddingBottom:80}}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
      >
        <BottomSheetView style={{paddingHorizontal:12, alignItems: 'center',backgroundColor:colors.white, paddingBottom:8, borderBottomWidth:1, borderColor:colors.gray}}>
          <View className='mb-2'>
            <Text style={{color:colors.text}} className='text-heading2'>Comments</Text>
          </View>
          <View className=' overflow-hidden flex-row gap-1 items-center justify-center px-1'>
            <View className=' rounded-full overflow-hidden'>
              <Image
                style={styles.image}
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
                contentFit="cover"
                transition={10}
              />
            </View>
            <View style={{flex:1}} className='grow flex-row gap-1'>
              <Animated.View style={animatedInputStyle}>
                <BottomSheetTextInput
                  style={[styles.input, { backgroundColor: colors.white, borderColor: colors.gray, color: colors.text }]}
                  className='grow'
                  placeholder='write some comment..'
                  onPress={triggerMediumHaptics}
                  onChangeText={handleTextChange}
                  keyboardType="default"
                />
              </Animated.View>
              <Animated.View style={[animatedButtonStyle,{justifyContent:'center'}]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.icon, { backgroundColor: colors.primary, paddingHorizontal:12 }]}
                  onPress={handleComment}
                >
                  <Icon name="arrowup" color="#fff" size={28} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </BottomSheetView>

        {!isLoad? (
          commentList && commentList?.length > 0 ?(
            <BottomSheetFlashList
              data={commentList}
              renderItem={({ item }) => <MemoizedRenderItem item={item} />}
              estimatedItemSize={200}
              contentContainerStyle={{paddingBottom:100, paddingTop:4}}
            />
          ):(
            <View style={{marginTop:screenHeight/5}} className={`justify-start items-center`}>
              <Text style={{color:colors.subText}} className="text-heading2">No Comment</Text>
            </View>
          )
        ):(
          <View style={{marginTop:screenHeight/5}} className={`justify-start items-center`}>
            <Text style={{color:colors.subText}} className="text-heading2">Loading...</Text>
          </View>
        )}
      </BottomSheetModal>
  );
})

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    width:screenWidth * 0.11,
    height:screenWidth * 0.11,
    alignContent:'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    borderRadius: 99,
    fontSize: 16,
    lineHeight: 20,
    padding: 10,
    borderWidth: 1,
  },
  icon: {
    width:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:99,
    paddingVertical:4
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
  itemContainer: {
    padding: 6,
    marginHorizontal: 6,
    marginVertical: 4,
    borderRadius:20,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  },
});

export default CommentBottomModal





// const renderFooter = useCallback(
//   (props:any) => (
//     <BottomSheetFooter {...props} bottomInset={80}>
//       <View className='w-full flex-row gap-1 items-center justify-center px-2'>
//         <View className='rounded-full overflow-hidden'>
//           <Image
//             style={styles.image}
//             source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
//             contentFit="cover"
//             transition={10}
//           />
//         </View>
//         <View className='grow'>
//           <BottomSheetTextInput style={styles.input} placeholder='write some comment..'/>
//         </View>
//       </View>
//     </BottomSheetFooter>
//   ),
//   []
// );
