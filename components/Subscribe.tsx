import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { processOneTimePayment } from "@/services/paymentService";
import { updateUser } from "@/services/userService";
import { formatCurrency } from "@/utils/helpers";
import { verticalScale } from "@/utils/styling";
import * as Burnt from "burnt";
import { Image } from "expo-image";
import { CreditCardIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import ConfettiEL from "./ConfettiEL";
import Loading from "./Loading";
import ReusableCheckOption from "./ReusableCheckOption";

const isIOS = Platform.OS === "ios"

export default function Subscribe({ handleClose }: { handleClose: () => void; }) {
    const { Colors } = useTheme();
    const { actions } = useAppContext();
    const { popup } = usePaystack();
    const { user, updateUserData } = useAuth();
    const discountPercentage = actions?.feeDiscountInPercentage;
    const oneTimeFee = actions?.oneTimeFee;
    const discountedAmount = oneTimeFee! * (1 - discountPercentage! / 100);
    const checkoutAmount = discountPercentage ? discountedAmount! : actions?.oneTimeFee!
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);


    const handlePayment = function() {
        popup.newTransaction({
            email: user?.email!,
            amount: checkoutAmount,
            reference: `TNX_${Date.now()}`,
            onError: (err) => console.log("Error:", err),
            onLoad: () => console.log("Webview Loaded!"),
            onCancel: () => Burnt.toast({ haptic: "error", title: "Payment Cancelled!" }),
            onSuccess: async (res) => {
                setLoading(true);
                const status = await processOneTimePayment(res.reference, user?.uid!, checkoutAmount);
                if(status.success) {
                    const res = await updateUser(user?.uid!, { isSubscribed: true })
                    if(res.success) {
                        setShowConfetti(true);

                        // context data
                        updateUserData(user?.uid! as string)
                        setTimeout(() => {
                            setLoading(false);
                            handleClose();
                        }, 3000);
                        
                        Burnt.toast({ haptic: "success", title: "Payment Successful!" });
                    }
                } else {
                    Burnt.toast({ haptic: "error", title: "Payment failed!, Please Contact Support" })
                }
            },
        });
    }

	return (
        <React.Fragment>
            {showConfetti && <ConfettiEL />}
            
            <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
                <Image
                    source={require("@/assets/images/test.png")}
                    style={{ width: verticalScale(80), height: verticalScale(80), }}
                    contentFit="cover"
                />

                <View style={styles.headings}>
                    <Typography size={verticalScale(isIOS ? 27 : 30)} fontFamily="urbanist-bold">Welcome To WishLink 🎉</Typography>
                    <Typography style={{ textAlign: "center" }} size={isIOS ? 17 : 19} color={Colors.textLighter}>Unlock unlimited wishlists and start receiving contributions / gifts</Typography>
                </View>

                <View style={styles.listContainer}>
                    <ReusableCheckOption
                        title="Unlimited Wishlists"
                        text="Create as many wishlist as you want."
                    />
                    <ReusableCheckOption
                        title="Unlimited Wihses"
                        text="Add unlimited gifts to each wishlist."
                    />
                    <ReusableCheckOption
                        title="Priority Support"
                        text="Get help when you need it."
                    />
                    <ReusableCheckOption
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
                                <Typography color={BaseColors.primaryLight} fontFamily="urbanist-bold" size={verticalScale(isIOS ? 30 : 33)}>{formatCurrency(checkoutAmount)}</Typography>
                            </React.Fragment>
                        ) : (
                            <Typography color={BaseColors.primaryLight} fontFamily="urbanist-bold" size={verticalScale(isIOS ? 30 : 33)}>{formatCurrency(checkoutAmount)}</Typography>
                        )}
                    </View>
                    <Typography color={Colors.textLighter} size={16}>Pay once • No monthly fees</Typography>
                </View>

                <Button style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: spacingX._7 }} onPress={handlePayment} loading={loading}>
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
        </React.Fragment>
	);
}

const styles = StyleSheet.create({
    card: {
        minHeight: verticalScale(100),
        borderRadius: radius._10,
        padding: spacingY._20,
        paddingVertical: spacingY._25,

        alignItems: "center",
        gap: spacingY._25,
        textAlign: "center",
    },
    headings: {
        gap: spacingY._7,
        alignItems: "center",
        marginBottom: spacingY._5,
    },
    listContainer: {
        gap: spacingY._15,
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
        backgroundColor: "rgba(220, 252, 231, 0.1)",
        borderWidth: 1,
        borderStyle: "dashed",
    }
});