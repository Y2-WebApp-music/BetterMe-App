import { StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import { Image } from 'expo-image';

type SlideItemProps = {
    item: any
}

const SlideItem = ({item} : SlideItemProps) =>{
    
    return (
        <View style = {styles.container} >
            <Image source={item}
                contentFit="cover"
                style={styles.image}
                transition={1000}
            />
        </View>
    )
}

export default SlideItem

const styles = StyleSheet.create({
    container: {
        width : '100%',
        height : '100%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image:{
        flex: 1,
        width:'100%',
        borderRadius: 15
    }
});