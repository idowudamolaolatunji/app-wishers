import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAppContext } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";
import { formatCurrency } from "@/utils/helpers";
import { verticalScale } from "@/utils/styling";
import LottieView from "lottie-react-native";
import * as Icons from "phosphor-react-native";
import { CreditCardIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Loading from "./Loading";
import ReusableCheckOption from "./ReusableCheckOption";


export default function Subscribe({ loading, handlePay }: { loading: boolean; handlePay: () => void; }) {
    const { actions } = useAppContext();
    const { Colors, currentTheme } = useTheme();
    const discountPercentage = actions?.feeDiscountInPercentage;
    const oneTimeFee = actions?.oneTimeFee;
    const discountedAmount = oneTimeFee! * (1 - discountPercentage! / 100);
    const checkoutAmount = discountPercentage ? discountedAmount! : actions?.oneTimeFee!

	return (            
        <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
            <View style={{
                width: verticalScale(80),
                height: verticalScale(80),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                backgroundColor: currentTheme == "dark" ? "#dcfce71a" : BaseColors.accentLight,
            }}>
                <LottieView
                    autoPlay
                    loop
                    source={require("@/assets/lottie/gift.json")}
                    style={{ width: verticalScale(60), height: verticalScale(60), }}
                />
            </View>

            <View style={styles.headings}>
                <Typography size={verticalScale(27.5)} fontFamily="urbanist-bold">Welcome To Wishers</Typography>
                <Typography style={{ textAlign: "center" }} size={18} color={Colors.textLighter}>Unlock unlimited wishlists and start receiving contributions / gifts</Typography>
            </View>

            <View style={styles.listContainer}>
                <ReusableCheckOption
                    icon={<Icons.ListChecksIcon color={BaseColors.primaryLight} size={20.5} weight='bold' />}
                    title="Unlimited Wishlists"
                    text="Create as many wishlist as you want."
                />
                <ReusableCheckOption
                    icon={<Icons.SealCheckIcon color={BaseColors.primaryLight} size={20.5} weight='bold' />}
                    title="Verification Badge"
                    text="Look presentable to your givers."
                />
                <ReusableCheckOption
                    icon={<Icons.HeadsetIcon color={BaseColors.primaryLight} size={20.5} weight='bold' />}
                    title="Priority Support"
                    text="Get help when you need it."
                />
                <ReusableCheckOption
                    icon={<Icons.HandCoinsIcon color={BaseColors.primaryLight} size={20.5} weight='bold' />}
                    title="Seemless Withdrawal"
                    text="Withdraw your earnings any day, any time."
                />
            </View>

            <View style={styles.paymentDetails}>
                <Typography color={Colors.textLighter} size={16}>One-Time Payment</Typography>
                <View style={{ alignItems: "center", flexDirection: "row", gap: spacingX._7 }}>
                    {discountPercentage ? (
                        <React.Fragment>
                            <Typography>{discountPercentage}% off</Typography>
                            <Typography style={{ textDecorationLine: "line-through" }} color={Colors.neutral400} size={20} fontFamily="urbanist-semibold">{formatCurrency(actions?.oneTimeFee ?? 0)}</Typography>
                            <Typography color={BaseColors.primaryLight} fontFamily="urbanist-bold" size={verticalScale(31)}>{formatCurrency(checkoutAmount)}</Typography>
                        </React.Fragment>
                    ) : (
                        <Typography color={BaseColors.primaryLight} fontFamily="urbanist-bold" size={verticalScale(31)}>{formatCurrency(checkoutAmount)}</Typography>
                    )}
                </View>
                <Typography color={Colors.textLighter} size={16}>Pay once • No monthly fees</Typography>
            </View>

            <Button style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: spacingX._7 }} onPress={handlePay} loading={loading}>
                {loading ? (
                    <Loading />
                ) : (
                    <React.Fragment>
                        <CreditCardIcon color={BaseColors.white} size={24} weight="regular" />
                        <Typography fontFamily="urbanist-semibold" size={22} color={BaseColors.white}>Pay {formatCurrency(checkoutAmount)} & Get Started</Typography>
                    </React.Fragment>
                )}
            </Button>
        </View>
	);
}

const styles = StyleSheet.create({
    card: {
        minHeight: verticalScale(100),
        borderRadius: radius._10,
        padding: spacingY._17,
        paddingVertical: spacingY._25,

        alignItems: "center",
        gap: spacingY._22,
        textAlign: "center",
    },
    headings: {
        gap: spacingY._7,
        alignItems: "center",
        marginBottom: spacingY._5,
    },
    listContainer: {
        gap: spacingY._17,
        alignSelf: "flex-start",
    },
    paymentDetails: {
        justifyContent: "center",
        alignItems: "center",
        gap: spacingY._5,
        width: "100%",
        padding: spacingY._10,
        borderRadius: radius._10,
        borderColor: BaseColors.primaryLight,
        backgroundColor: "#defce91a",
        borderWidth: 1,
        borderStyle: "dashed",
    }
});