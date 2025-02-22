import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { RightArrowIcon } from '../../constants/icon'
import { format } from 'date-fns'
import { FlashList } from "@shopify/flash-list";
import MealCard from './mealCard'
import { weekMealSummary } from '../../types/food';
import { useTheme } from '../../context/themeContext';

const FoodDaySummary = ({date, total_calorie, protein, carbs, fat, meal}:weekMealSummary) => {

  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;


  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    Animated.timing(animation, {
      toValue: isVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const cardHeight = 84;
  const totalHeight = cardHeight * meal.length;

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, totalHeight],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={{backgroundColor:colors.white, borderColor:colors.gray}} className='px-4 py-2 border rounded-normal'>
      <TouchableOpacity activeOpacity={0.7} onPress={toggleVisibility} className='flex-row'>
        <View className='grow'>
          <View style={{ transform: [{ translateY: 4 }]}}>
            <Text style={{color:colors.subText}} className=' font-noto'>{format(new Date(date), "eee '|' dd MMM yyyy")}</Text>
          </View>
          <View className='flex-row gap-2 items-end'>
            <Text style={{color:colors.subText}} className='text-body font-noto '>Total Calories</Text>
            <View style={{ transform: [{ translateY: 4 }]}}>
              <Text style={{color:colors.text}} className='text-heading font-noto'>{total_calorie}</Text>
            </View>
            <View style={{ transform: [{ translateY: 0 }]}}>
              <Text style={{color:colors.subText}} className='text-body font-noto'>cal</Text>
            </View>
          </View>
          <View style={{ transform: [{ translateY: -2 }], flexDirection:'row', gap:12, marginTop:2 }}>
            <Text style={{color:colors.subText}} className='text-detail font-notoLight'>Protein : {protein}g</Text>
            <Text style={{color:colors.subText}} className='text-detail font-notoLight'>Carbs : {carbs}g</Text>
            <Text style={{color:colors.subText}} className='text-detail font-notoLight'>Fat : {fat}g</Text>
          </View>


        </View>
        <View style={{paddingRight:0}} className='flex flex-row gap-1 items-center'>
          <RightArrowIcon style={{transform: [{ rotate: isVisible ? "90deg" : "-90deg" }],}} width={20} height={20} color={colors.darkGray}/>
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.animatedContainer, { height, opacity }]}>
      {isVisible &&
          <FlashList
          data={meal}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <MealCard
              meal_id={item.meal_id}
              meal_date={item.meal_date}
              food_name={item.food_name}
              calorie={item.calorie}
              createByAI={item.createByAI}
            />
          )}
          estimatedItemSize={cardHeight}
        />
            }
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  animatedContainer: {
    overflow: "hidden",
    marginTop: 8,
  },
});

export default FoodDaySummary