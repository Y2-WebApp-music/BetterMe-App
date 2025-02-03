import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';

type PageNumProps = {
    currentIndex: number;
    total: number;
};

const PageNum: React.FC<PageNumProps> = ({ currentIndex, total }) => {
    return (
        <View style={styles.counterContainer}>
          <Text className='text-white font-noto text-detail font-noto'>
            {currentIndex + 1} / {total}
            </Text>
        </View>
      )
    }

export default PageNum;

const styles = StyleSheet.create({
    counterContainer: {
        position: 'absolute',
        top: 10,
        right: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 8,
        borderRadius: 20,
      },
    
});
