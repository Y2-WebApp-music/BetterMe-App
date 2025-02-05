import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { RightArrowIcon } from '../../constants/icon'
import { format } from 'date-fns'
import { FlashList } from "@shopify/flash-list";
import MealCard from './mealCard'
import { weekMealSummary } from '../../types/food';

const FoodDaySummary = ({date, total_calorie, protein, carbs, fat, meal}:weekMealSummary) => {

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
    <View className='px-4 py-2 bg-white border border-gray rounded-normal'>
      <TouchableOpacity activeOpacity={0.7} onPress={toggleVisibility} className='flex-row'>
        <View className='grow'>
          <View style={{ transform: [{ translateY: 4 }]}}>
            <Text className='text-subText font-noto'>{format(new Date(date), "eee '|' dd MMM yyyy")}</Text>
          </View>
          <View className='flex-row gap-2 items-end'>
            <Text className='text-body font-noto text-subText'>Total Calories</Text>
            <View style={{ transform: [{ translateY: 4 }]}}>
              <Text className='text-heading font-noto'>{total_calorie}</Text>
            </View>
            <View style={{ transform: [{ translateY: 0 }]}}>
              <Text className='text-body font-noto text-subText'>cal</Text>
            </View>
          </View>
          <View style={{ transform: [{ translateY: -2 }], flexDirection:'row', gap:12, marginTop:2 }}>
            <Text style={{color:'gray'}} className='text-detail font-notoLight'>Protein : {protein}g</Text>
            <Text style={{color:'gray'}} className='text-detail font-notoLight'>Carbs : {carbs}g</Text>
            <Text style={{color:'gray'}} className='text-detail font-notoLight'>Fat : {fat}g</Text>
          </View>


        </View>
        <View style={{paddingRight:0}} className='flex flex-row gap-1 items-center'>
          <RightArrowIcon style={{transform: [{ rotate: isVisible ? "90deg" : "-90deg" }],}} width={20} height={20} color={'#CFCFCF'}/>
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
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  totalCalories: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calories: {
    fontSize: 14,
    color: "#444",
  },
  animatedContainer: {
    overflow: "hidden",
    marginTop: 8,
  },
});

export default FoodDaySummary