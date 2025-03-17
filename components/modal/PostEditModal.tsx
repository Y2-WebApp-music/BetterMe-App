import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet/src';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/authContext";
import { useTheme } from "../../context/themeContext";
import { router, usePathname } from 'expo-router';
import { DeleteIcon, PenIcon } from '../../constants/icon';
import axios from 'axios';
import { SERVER_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Ref = BottomSheet;
type PostOptionBottomModalProps = {
  post_id:string;
};

const PostOptionBottomModal = forwardRef<Ref, PostOptionBottomModalProps>(({ post_id }, ref:any) => {

  const { colors } = useTheme();
  const pathname = usePathname();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // const snapPoints = useMemo(() => ["60%", "100%"], []);
  const [snapPoints, setSnapPoints] = useState(["40%", "80%"]);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback (
    (props: any) => <BottomSheetBackdrop appearsOnIndex={2} disappearsOnIndex={-1} {...props}/>,[]
  )

  const [isLoad, setIsLoad] = useState(true);

  const triggerMediumHaptics = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    console.log('Haptics triggered');
  };

  const [isVisible, setIsVisible] = useState<number>(-1)
  const handleSheetChanges = useCallback((index: number) => {
    setIsVisible(index)
  }, []);

  const handleConfirmDelete = () => {
    setDeleteModal(!deleteModal)
    setSnapPoints(["80%"])
  }

  const handleCancel = () => {
    setDeleteModal(!deleteModal)
    setSnapPoints(["40%", "80%"])
  }

  const handleEdit = () => {
    ref.current?.dismiss();
    router.push(`(post)/edit/${post_id}`);
  }

  const [deleteModal, setDeleteModal] = useState(false)
  const deletePost = async () => {
    if (isLoad) return
    
    console.log('Delete Post', post_id);
    try {
      const response = await axios.delete(`${SERVER_URL}/community/post/delete/${post_id}`);

      let data = response.data

      if (data.message == "Post not found") {
        console.error('Can not find Post ID')
        return
      }

      ref.current?.dismiss();

      if (pathname === `/${post_id}`) {
        router.back()
      }

    } catch (err) {
      console.error('Delete Post Fail:', err);
    }
  }

  useLayoutEffect(() => {
    if (isVisible === 0 && isLoad) {
      setIsLoad(false)
    }
    if (isVisible === -1) {
      setSnapPoints(["40%", "80%"])
      setIsLoad(true)
      setDeleteModal(false)
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
        <BottomSheetView style={{ paddingHorizontal: 12, alignItems: 'center', backgroundColor: colors.white, paddingBottom: 8 }}>
          {!deleteModal ? (
          <View className= 'w-full p-2 flex gap-2'>
            <View className=' justify-center items-center mb-2'>
              <Text style={{color:colors.text}} className=' font-noto text-heading2'>Post Setting</Text>
            </View>
            <View className='gap-3'>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleEdit}
                style={{borderColor:colors.gray, paddingVertical:12}}
                className='px-4 border rounded-normal flex-row gap-2 justify-start items-center'
              >
                <PenIcon width={28} height={28} color={colors.subText} />
                <Text style={{color:colors.subText}} className='font-noto text-heading3'>Edit post</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={handleConfirmDelete} style={{borderColor:colors.gray, paddingVertical:12}} className='p-2 px-4 border rounded-normal flex-row gap-2 justify-start items-center'>
                <DeleteIcon width={28} height={28} color={colors.subText} />
                <Text style={{color:colors.subText}} className='font-noto text-heading3'>delete post</Text>
              </TouchableOpacity>
            </View>
          </View>
          ):(
            <View style={{backgroundColor:colors.white, height:'90%'}} className= 'w-full p-4 rounded-normal justify-center'>
              <View className='w-full items-center justify-center flex gap-2'>
                  <Text style={{color:colors.text}} className='text-subTitle mt-2'>Delete this Post?</Text>
                  <Text style={{color:colors.subText}} className=' font-notoLight'>This will delete delete permanently. You cannot undo this action.</Text>
              </View>
              <View style={{marginTop:20}} className='w-full items-center justify-center flex-row gap-4'>
                <TouchableOpacity style={{backgroundColor:'#f43168'}} onPress={deletePost} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-red'>
                  <Text className='w-fit text-white text-heading2 font-notoMedium'>Delete it</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'#0dc47c'}} onPress={handleCancel} className='will-change-contents flex flex-row items-center justify-center rounded-full p-1 px-6 bg-green'>
                  <Text className='w-fit text-white text-heading2 font-notoMedium'>No keep it!</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BottomSheetView>

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

export default PostOptionBottomModal
