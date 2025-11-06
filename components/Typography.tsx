import { useTheme } from '@/hooks/useTheme'
import { verticalScale } from '@/utils/styling'
import { TypographyProps } from '@/utils/types'
import React from 'react'
import { Text, TextStyle } from 'react-native'

export default function Typography({
    size,
    color,
    fontWeight = "500",
    children,
    style,
    textProps={},
    fontFamily="urbanist-regular"
}: TypographyProps) {
    const { Colors } = useTheme();

    const textStyle: TextStyle = {
        fontSize: size ? verticalScale(size) : verticalScale(18),
        color: color || Colors.text,
        fontWeight,
        fontFamily,
        alignItems: "center",
    }

    return <Text style={[textStyle, style]} {...textProps}>{children}</Text>;
}