import { BaseColors, radius, spacingX, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { verticalScale } from '@/utils/styling'
import { TransactionItemProps, TransactionListType, TransactionType } from '@/utils/types'
import { FlashList } from "@shopify/flash-list"
import { useRouter } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Loading from './Loading'
import Typography from './Typography'


export default function TransactionList({ data, title, loading }: TransactionListType) {
    const router = useRouter();
    const { Colors, currentTheme } = useTheme();

    const handleClick = function(item: TransactionType) {
        router.push({ pathname: "/(modals)/transactionDetailsModal", params: { id: item?.id, } })
    }

    return (
        <View style={styles.container}>
            {title && (
                <Typography size={21} fontFamily="urbanist-semibold" color={Colors.text}>
                    {title}
                </Typography>
            )}

            {(loading) && (
                <View style={{ top: verticalScale(30) }}>
                    <Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accent"]} />
                </View>
            )}

            {(!loading && data.length > 0) && (
                <View style={styles.list}>
                    <FlashList
                        data={data}
                        renderItem={({ item, index }) => (
                            <TransactionItem key={index} item={item as TransactionType} index={index} handleClick={handleClick} />
                        )}
                        {...({ estimatedItemSize: 60 } as any)}
                    />
                </View>
            )}

            {/* {(!loading && data.length < 1) && (
                <Typography
                    size={15.5}
                    color={Colors.textLighter}
                    style={{ textAlign: "center", marginTop: spacingY._15 }}
                >
                    {emptyListMessage}
                </Typography>
            )} */}
        </View>
    )
}

export function TransactionItem({ item, index, handleClick }: TransactionItemProps) {
    const { Colors, currentTheme } = useTheme();

    // const date = item?.paidAt && (item?.paidAt as Timestamp)?.toDate()?.toLocaleDateString("en-Gb", {
    //     day: "numeric",
    //     month: "short",
    // })

    return (
        // <Animated.View entering={FadeInDown.delay(index * 70)}>
            <View
                style={[styles.row, { backgroundColor: Colors[currentTheme == "dark" ? "cardBackground" : "background300"], marginTop: index == 0 ? spacingY._20 : 0 }]}
                // activeOpacity={1}
                // onPress={() => handleClick(item)}
            >
                <View style={[styles.imageContainer, { backgroundColor: BaseColors[item?.type == "Withdrawal" ? "brownAccent" : "violetAccent"] }]}>
                    {item?.type == "Withdrawal" ? (
                        <Icons.HandWithdrawIcon color={BaseColors.brown} weight="bold" size={25} />
                    ) : (
                        <Icons.HandDepositIcon color={BaseColors.blue} weight="bold" size={25} />
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
                        color={Colors.textLighter}
                        textProps={{ numberOfLines: 2 }}
                        fontFamily="urbanist-medium"
                    >
                        #{item.refId}
                    </Typography>
                </View>

                <View style={styles.amountDetails}>
                    <Typography size={18} fontFamily="urbanist-bold" color={BaseColors[item?.type == "Withdrawal" ? "brown" : currentTheme == "dark" ? "primary" : "blue"]}>{formatCurrency(item.amount ?? 0, 0)}</Typography>
                    <Typography size={12.5} fontFamily="urbanist-medium" color={Colors.textLighter}>{formatDate(item?.paidAt)}</Typography>
                </View>
            </View>
        // </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: spacingY._15,
    },
    list: {
        minHeight: 3,
    },
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
});