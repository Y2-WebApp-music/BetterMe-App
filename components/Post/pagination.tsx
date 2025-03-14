import { StyleSheet, Animated, View, Dimensions } from 'react-native'
import React from 'react'

const {width} = Dimensions.get('window');

type PaginationProps = {
    data: any[];
    scrollX: Animated.Value;
  }

const Pagination = ({data, scrollX} : PaginationProps) => {
  return (
    <View style={styles.container}>
        {data.map((_, idx) =>{
            const inputRange = [(idx-1)*width, idx*width, (idx+1)*width];
            const backgroundColor = scrollX.interpolate({
                inputRange,
                outputRange: ['#CFCFCF', '#1c60de', '#CFCFCF'],
                extrapolate: 'clamp',
            });
            return (
                <Animated.View key={idx.toString()} 
            style={[styles.dot,{backgroundColor },
                ]}
            />
            );
        })}
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
    container:{
        bottom: 10,
        flexDirection: 'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        marginTop : 15
    },
    dot:{
        width :8,
        height:8,
        borderRadius:6,
        marginHorizontal: 2,
        
    },

})