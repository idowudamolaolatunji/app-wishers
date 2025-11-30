import { BaseColors, radius, spacingX, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { scale, verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Loading from './Loading'
import Typography from './Typography'


export default function DeleteItem({ text, loading=false, handleDelete, handleClose }: {
    text: string;
    handleDelete: () => Promise<void> | void;
    handleClose: () => void;
    loading?: boolean;
}) {
    const { Colors, currentTheme } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "space-between", }}>
        <View style={{ gap: spacingY._20, marginTop: spacingY._20 }}>
            <Typography size={verticalScale(20)} fontFamily="urbanist-medium" color={Colors.text} style={{ lineHeight: 25 }}>
                {text}
            </Typography>
        </View>

        <View style={[styles.flexRow, styles.footerArea, { borderTopColor: BaseColors[currentTheme == "dark" ? "neutral700" : "neutral400"] } ]}>
            <TouchableOpacity style={[styles.button, { backgroundColor: Colors.neutral300 }]} onPress={handleClose}>
                <Typography size={20} fontFamily="urbanist-bold" color={Colors.black}>Cancel</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: Colors.rose }]} onPress={handleDelete}>
                {loading ? (
                    <Loading />
                ) : (
                    <Typography size={20} fontFamily="urbanist-bold" color={BaseColors.white}>Delete</Typography>
                )}
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12
    },
    footerArea: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        marginBottom: spacingY._15,
        borderTopWidth: 1,
    },
    button: {
        minWidth: "47%",
        padding: spacingY._10,
        borderRadius: radius._12,
        borderCurve: "continuous",
        height: verticalScale(52),
        justifyContent: "center",
        alignItems: "center",
    },
})