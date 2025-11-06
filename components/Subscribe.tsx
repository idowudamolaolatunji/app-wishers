import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { BaseColors, radius, spacingY } from "@/constants/theme";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { processOneTimePayment } from "@/services/paymentService";
import { updateUser } from "@/services/userService";
import { verticalScale } from "@/utils/styling";
import * as Burnt from "burnt";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import { formatCurrency } from '../utils/helpers';
import ConfettiEL from "./ConfettiEL";
import Loading from "./Loading";

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
                <Typography style={{ textAlign: "center", }}>We require a one-time payment to get started</Typography>

                <Image
                    source={require("@/assets/images/icon-sad-face.png")}
                    style={{ width: verticalScale(110), height: verticalScale(110), }}
                    contentFit="cover"
                />

                <View style={{ alignItems: "center", flexDirection: "row", gap: 2.5 }}>
                    {discountPercentage ? (
                        <React.Fragment>
                            <Typography>{discountPercentage}% off</Typography>
                            <Typography style={{ textDecorationLine: "line-through" }} color={Colors.textLighter}>{formatCurrency(actions?.oneTimeFee ?? 0)}</Typography>
                            <Typography color={BaseColors.primaryLight} fontFamily="urbanist-bold" size={verticalScale(isIOS ? 24 : 27)}>{formatCurrency(discountedAmount)}</Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography>Just for</Typography>
                            <Typography color={BaseColors.primaryLight} fontFamily="urbanist-bold" size={verticalScale(isIOS ? 24 : 27)}>{formatCurrency(discountedAmount)}</Typography>
                        </React.Fragment>
                    )}
                </View>

                <Typography style={{ textAlign: "center", }}>To Gain Unlimited Access to the platform and make money why using our platform</Typography>

                <Button style={{ width: "100%" }} onPress={handlePayment} loading={loading}>
                    {loading ? (
                        <Loading />
                    ) : (
                        <Typography fontFamily="urbanist-semibold" size={24}>Make Payment</Typography>
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
        padding: spacingY._15,
        paddingVertical: spacingY._30,

        alignItems: "center",
        gap: spacingY._10,
    },
});