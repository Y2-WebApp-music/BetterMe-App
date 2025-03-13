import { StyleSheet, View, Text, Button, KeyboardAvoidingView, Platform } from "react-native";
import React, { forwardRef, memo, useCallback, useMemo, useRef, useState } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetFooter, BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput, BottomSheetView, TouchableOpacity, useBottomSheet, useBottomSheetModal } from '@gorhom/bottom-sheet/src';
import { Dimensions } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Image } from "expo-image";
import { CloseIcon } from "../../constants/icon";
import { useAuth } from "../../context/authContext";
import { TagCommunity } from "../../types/community";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MemoizedRenderItem = memo(({ item, onPress }: { item: { id: number, text: string }, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} key={item.id} activeOpacity={0.7} style={styles.itemContainer}>
      <Text>{item.text}</Text>
    </TouchableOpacity>
));

interface AddTagBottomModalProps {
  selectedTags: { id: number; text: string }[];
  setSelectedTags: React.Dispatch<React.SetStateAction<{ id: number; text: string }[]>>;
}

const AddTagBottomModal = forwardRef<BottomSheetModal, AddTagBottomModalProps>(
  ({ selectedTags, setSelectedTags }, ref) => {
  const { colors } = useTheme();
  const { user } = useAuth()
  const data = useMemo(() => TagCommunity, []);
  const [searchQuery, setSearchQuery] = useState(""); 


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "100%"], []);

  const filteredTags = useMemo(() => {
    return data.filter((tag) => tag.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, data]);
  const onSelectTag = (tag: { id: number; text: string }) => {
    setSelectedTags((prevSelected) => {
      const isAlreadySelected = prevSelected.some((t) => t.id === tag.id);
      if (!isAlreadySelected) {
        return [...prevSelected, tag];
      }
      return prevSelected;
    });
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prevSelected) => prevSelected.filter((tag) => tag.id !== tagId));
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback (
    (props: any) => <BottomSheetBackdrop appearsOnIndex={2} disappearsOnIndex={-1} {...props}/>,[]
  )


  const renderItem = useCallback(({ item }: { item: any }) => {
    return <MemoizedRenderItem item={item} onPress={() => console.log(`Pressed item ${item.id}`)} />;
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
        maxDynamicContentSize={screenHeight}
        containerStyle={{marginTop:70, paddingBottom:80}}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
      >
        <BottomSheetView className="items-center bg-white">
          <View className='mb-2'>
            <Text style={{color:colors.text}} className='text-heading2'>Search tag</Text>
          </View>

        <View className=" bg-white border border-gray rounded-normal p-1 px-[10px] flex-row ">
          <BottomSheetTextInput style={[styles.input, {width:'90%', color:colors.text}]} className='grow' placeholder='Search some tag...' value={searchQuery} 
        onChangeText={setSearchQuery} />
        </View>
          
            <View className="flex-row flex-wrap gap-2 p-2">
            {selectedTags.map((tag) => (
                <View className="flex-row bg-primary gap-2 p-1 px-2 justify-start items-center rounded-normal " key={tag.id}>
                <Text className="text-white font-notoMedium">{tag.text}</Text>
                <TouchableOpacity onPress={() => removeTag(tag.id)}>
                    <CloseIcon width={20} height={20} color="white" />
                </TouchableOpacity>
                </View>
            ))}
            </View>
        </BottomSheetView>
        
        <BottomSheetFlashList
        data={filteredTags}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedTags.some((t) => t.id === item.id);
          return (
            <TouchableOpacity 
              onPress={() => onSelectTag(item)}
              style={[
                styles.itemContainer, 
              ]}
            >
              <Text className={`text-body ${isSelected ? "text-white" : "text-subText"}`}>{item.text}</Text>
            </TouchableOpacity>
          );
        }}
        estimatedItemSize={50}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      </BottomSheetModal>

  );
})

const styles = StyleSheet.create({

  input: {
    fontSize: 16,
    lineHeight: 20,
  },

  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical:10,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius:15,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    display:'flex',
    justifyContent:'center',
  },
});

export default AddTagBottomModal