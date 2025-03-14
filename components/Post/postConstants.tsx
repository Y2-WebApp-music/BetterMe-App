import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from "../../context/themeContext";
import { TagCommunity } from "../../types/community";
import { router } from 'expo-router';


export const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

export const TagList = ({ tagId }: { tagId: number[] }) => {
  const { colors } = useTheme();

  const { visibleTags, remainingCount } = useMemo(() => {
    const tags = TagCommunity.filter(tag => tagId.includes(tag.id));
    return {
      visibleTags: tags.slice(0, 2),
      remainingCount: tags.length - 2
    };
  }, [tagId]);

  return (
    <View className="my-1">
      <FlatList
        data={visibleTags}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: colors.gray, marginHorizontal: 2 }}
            className="rounded-full p-1 px-2"
          >
            <Text
              style={{ color: colors.subText }}
              className="text-detail font-noto"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.text.length > 10 ? `${item.text.slice(0, 10)}…` : item.text}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={
          remainingCount > 0 ? (
            <View
              style={{ backgroundColor: colors.gray }}
              className="rounded-full p-1 px-2"
            >
              <Text style={{ color: colors.subText }} className="text-detail font-noto">
                +{remainingCount}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export const AllTag = () => {
  const { colors } = useTheme();

  return (
    <View className="my-1">
      <FlatList
        data={TagCommunity}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: colors.primary, marginHorizontal: 2 }}
            className="rounded-full p-1 px-2"
            onPress={()=>{router.push(`(post)/tagSearch/${item.id}`)}}
          >
            <Text
              style={{color:'#fff'}}
              className="text-detail font-noto"
              numberOfLines={1}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

interface SelectTagListProps {
  tagFilter: number[];
}

export const SelectTagList: React.FC<SelectTagListProps> = ({ tagFilter }) => {
  const { colors } = useTheme();

  const tagList = useMemo(() => TagCommunity, []);
  const selectedTag = tagList.filter(tag => tagFilter.includes(tag.id));


  return (
    <View className="">
      <FlatList
        data={selectedTag}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ backgroundColor: colors.primary, marginHorizontal: 2 , paddingHorizontal:10}}
            className="rounded-full p-1"
            onPress={()=>{router.push(`(post)/tagSearch/${item.id}`)}}
          >
            <Text
              style={{color:'#fff'}}
              className="text-detail font-notoMedium"
              numberOfLines={1}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}