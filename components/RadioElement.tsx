import { BaseColors } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function RadioElement({ active=true }: { active: boolean }) {
    return (
        <View style={[styles.radio, { borderColor: active ? BaseColors.primaryLight : BaseColors.neutral400 }]}>
            <View style={[styles.radioInside, { backgroundColor: active ? BaseColors.primaryLight : BaseColors.neutral400 }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    radio: {
        width: verticalScale(16),
        height: verticalScale(16),
        borderRadius: 100,
        borderWidth: 1.28,
        alignItems: "center",
        justifyContent: "center"
    },
    radioInside: {
        width: verticalScale(8),
        height: verticalScale(8),
        borderRadius: 100,
    }
})