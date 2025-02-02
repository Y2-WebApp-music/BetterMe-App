import { StyleSheet, Animated, View, Dimensions } from 'react-native'
import React from 'react'

const {width} = Dimensions.get('screen');

type PaginationProps = {
    data: any[];
    scrollX: Animated.Value;
  }

const pagination = ({data, scrollX} : PaginationProps) => {
  return (
    <View style={styles.container}>
        {data.map((_, idx) =>{
            const inputRange = [(idx-1)*width, idx*width, (idx+1)*width];
            const backgroundColor = scrollX.interpolate({
                inputRange,
                outputRange: ['#ccc', '#000', '#ccc'],
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

export default pagination

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
    },
    dot:{
        width :8,
        height:8,
        borderRadius:6,
        marginHorizontal: 2,
        backgroundColor: '#ccc',
    },
    dotActive:{
        backgroundColor: '#000'
    }
})