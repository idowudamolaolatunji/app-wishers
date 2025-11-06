import { radius } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { verticalScale } from '@/utils/styling'
import { CustomButtonProps } from '@/utils/types'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Loading from './Loading'


export default function Button({ style, onPress, loading=false, children }: CustomButtonProps) {
    const { Colors } = useTheme();

    if(loading) {
        return (
            <View style={[ styles.button, style, { backgroundColor: Colors.primaryDark, borderRadius: radius._17 } ]}>
                <Loading />
            </View>
        )
    }

    return (
        <TouchableOpacity 
        activeOpacity={0.75}    
        style={[
            { backgroundColor: Colors.primaryLight },
            styles.button,
            style
        ]} onPress={onPress}>
            {children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        // width: "100%",
        borderRadius: radius._15,
        borderCurve: "continuous",
        height: verticalScale(52),
        justifyContent: "center",
        alignItems: "center",
    }
});