import { StyleSheet, View, Text, Button, KeyboardAvoidingView, Platform } from "react-native";
import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetFooter, BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput, BottomSheetView, useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet/src';
import BottomModal from "./BottomModal";
import { Dimensions } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Image } from "expo-image";
import { useAuth } from "../../context/authContext";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Ref = BottomSheet;

const keyExtractor = (item:any) => item;

const MemoizedRenderItem = memo(({ item }: { item: any }) => (
  <View key={item} style={styles.itemContainer}>
    <Text>{item}</Text>
  </View>
));

const CommentBottomModal = forwardRef<Ref>((props, ref:any) => {
  const { colors } = useTheme();
  const { user } = useAuth()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["60%", "100%"], []);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback (
    (props: any) => <BottomSheetBackdrop appearsOnIndex={2} disappearsOnIndex={-1} {...props}/>,[]
  )

  const renderFooter = useCallback(
    (props:any) => (
      <BottomSheetFooter {...props} bottomInset={80}>
        <View className='w-full flex-row gap-1 items-center justify-center px-2'>
          <View className='rounded-full overflow-hidden'>
            <Image
              style={styles.image}
              source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
              contentFit="cover"
              transition={10}
            />
          </View>
          <View className='grow'>
            <BottomSheetTextInput style={styles.input} placeholder='write some comment..'/>
          </View>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  const data = useMemo(() => Array(50).fill(0).map((_, index) => `index-${index}`), []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    );
  }, []);

  return (
      <BottomSheetModal
        ref={ref}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        index={0}
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
            <Text style={{color:colors.text}} className='text-heading2'>Comment</Text>
          </View>
          <View className='w-full flex-row gap-1 items-center justify-center px-2'>
            <View className='rounded-full overflow-hidden'>
              <Image
                style={styles.image}
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
                contentFit="cover"
                transition={10}
              />
            </View>
            <View className='grow'>
              <BottomSheetTextInput style={[styles.input, {backgroundColor:colors.white, borderColor:colors.gray}]} placeholder='write some comment..'/>
            </View>
          </View>
        </BottomSheetView>
        <BottomSheetFlashList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => <MemoizedRenderItem item={item} />}
          estimatedItemSize={43.3}
          contentContainerStyle={{paddingBottom:100, paddingTop:4}}
        />
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
    padding:10,
    borderWidth:1,
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
    marginTop:10,
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default CommentBottomModal