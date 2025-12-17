import { BaseColors, radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { verticalScale } from '@/utils/styling';
import { TransactionItemProps } from '@/utils/types';
import * as Icons from "phosphor-react-native";
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Typography from './Typography';


export default function TransactionItem({ item, index, handleClick }: TransactionItemProps) {
    const { Colors, currentTheme } = useTheme();

    return (
        <Animated.View entering={FadeInDown.delay(index * 70)}>
            <TouchableOpacity
                style={[styles.row, { backgroundColor: Colors.cardBackground, marginTop: index == 0 ? spacingY._20 : 0 }]}
                activeOpacity={1}
                onPress={() => handleClick(item)}
            >
                <View style={[styles.imageContainer, { backgroundColor: BaseColors[item?.type == "Withdrawal" ? "brownAccent" : "accentLight"] }]}>
                    {item?.type == "Withdrawal" ? (
                        <Icons.HandWithdrawIcon color={BaseColors.brown} weight="bold" size={25} />
                    ) : (
                        <Icons.HandDepositIcon color={BaseColors.primaryLight} weight="bold" size={25} />
                    )}
                </View>

                <View style={styles.details}>
                    <Typography
                        size={20}
                        fontFamily="urbanist-semibold"
                        style={{ textTransform: "capitalize" }}
                    >
                        {item.type}
                    </Typography>
                    <Typography
                        size={14}
                        color={BaseColors[currentTheme == "dark" ? "neutral500" : "neutral400"]}
                        textProps={{ numberOfLines: 2 }}
                        fontFamily="urbanist-semibold"
                    >
                        #{item.refId}
                    </Typography>
                </View>

                <View style={styles.amountDetails}>
                    <Typography size={18} fontFamily="urbanist-bold" color={BaseColors[item?.type == "Withdrawal" ? "brown" : "primaryLight"]}>{formatCurrency(item.amount ?? 0, 0)}</Typography>
                    <Typography size={12.5} fontFamily="urbanist-medium" color={Colors.neutral500}>{formatDate(item?.paidAt)}</Typography>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._7,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._12,
        minHeight: verticalScale(72)
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: verticalScale(45),
        height: verticalScale(45),
        borderRadius: radius._10,
    },
    details: {
        flex: 1,
        gap: spacingY._5,
    },
    amountDetails: {
        alignItems: "flex-end",
        gap: 3,
    },
})