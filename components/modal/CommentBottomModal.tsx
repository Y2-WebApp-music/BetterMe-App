import { StyleSheet, View, Text, Button, KeyboardAvoidingView, Platform } from "react-native";
import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetFooter, BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput, BottomSheetView, TouchableOpacity, useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet/src';
import BottomModal from "./BottomModal";
import { Dimensions } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Image } from "expo-image";
import { useAuth } from "../../context/authContext";
import { FlashList } from "@shopify/flash-list";
import { AntDesign as Icon } from '@expo/vector-icons';


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
          <View className=' overflow-hidden flex-row gap-1 items-center justify-center px-1'>
            <View className=' rounded-full overflow-hidden'>
              <Image
                style={styles.image}
                source={user?.photoURL ? user?.photoURL : user?.gender === 1 ? require('../../assets/maleAvatar.png') : require('../../assets/femaleAvatar.png')}
                contentFit="cover"
                transition={10}
              />
            </View>
            <View style={{flex:1, backgroundColor:colors.white, borderWidth:1, borderRadius:99 ,borderColor:colors.gray, padding:4, paddingHorizontal:10}} className='grow flex-row gap-1'>
              <BottomSheetTextInput style={[styles.input, {width:'84%', color:colors.text}]} className='grow' placeholder='write some comment..'/>
              <TouchableOpacity activeOpacity={0.7} style={{width:'16%', display:'flex', alignItems:'center', backgroundColor:colors.primary, borderRadius:99, paddingVertical:4}}>
                <Icon name={'arrowup'} color={'#fff'} size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
        {/* <BottomSheetView style={{flex:1,paddingBottom:100, paddingTop:4}}>
          <FlashList
            data={data}
            renderItem={({ item }) =>
              <MemoizedRenderItem item={item} />
            }
            estimatedItemSize={200}
          />
        </BottomSheetView> */}
        <BottomSheetFlashList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => <MemoizedRenderItem item={item} />}
          estimatedItemSize={200}
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
    fontSize: 16,
    lineHeight: 20,
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
    height:60,
    borderRadius:20,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: "#eee",
  },
});

export default CommentBottomModal