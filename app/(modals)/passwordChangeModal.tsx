import Asterisk from "@/components/Asterisk";
import BackButton from "@/components/BackButton";
import ModalWrapper from "@/components/ModalWrapper";
import { auth } from "@/config/firebase";
import { BaseColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { scale, verticalScale } from "@/utils/styling";
import * as Burnt from "burnt";
import { useRouter } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import ScreenHeader from "../../components/ScreenHeader";
import Typography from "../../components/Typography";


export default function PasswordChange() {
    const router = useRouter();
    const { StoreAuth } = useAuth();
    const { Colors, currentTheme } = useTheme();
    const [passwordData, setPasswordData] = useState({ password: "", newPassword: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async function() {
        const { password, newPassword } = passwordData;
        if(!password || !newPassword) {
            return Burnt.toast({ haptic: "error", title: "Fill up all fields!" });
        }

        setLoading(true);
        
        try {
            const user = auth?.currentUser;

            // STEP 1: Reauthenticate
            const credential = EmailAuthProvider.credential(user?.email!, password);
            await reauthenticateWithCredential(user!, credential);

            // STEP 2: Update password
            await updatePassword(user!, newPassword);
            StoreAuth(user?.email!, password);

            Burnt.toast({ haptic: "success", title: "Password changed successfully!" });
            router.back();

        } catch(err: any) {
            if (err.code === "auth/wrong-password") {
                Burnt.toast({ haptic: "error", title: "Current password is incorrect!" });
            } else if (err.code === "auth/weak-password") {
                Burnt.toast({ haptic: "error", title: "Weak password! Use a stronger one." });
            } else if (err.code === "auth/requires-recent-login") {
                Burnt.toast({ haptic: "error", title: "Session expired. Please log in again.", });
            } else {
                Burnt.toast({ haptic: "error", title: "Unable to change password." });
            }
        } finally {
            setLoading(false);
        }
    }

	return (
        <ModalWrapper>
            <View style={styles.container}>
                <ScreenHeader title='Change Password' leftElement={<BackButton iconType="cancel" />} style={{ marginBottom: spacingY._35 }} />
                
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.formItems}
                    enableOnAndroid
                >
                    <View style={styles.inputContainer}>
                        <Typography fontFamily="urbanist-bold" color={Colors.textLighter}>
                            Old Password <Asterisk />
                        </Typography>
                        <FormInput
                            placeholder="Enter your old password"
                            isPassword={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={passwordData.password}
                            onChangeText={(value) => setPasswordData({ ...passwordData, password: value })}
                            icon={<Icons.PasswordIcon size={verticalScale(26)} color={BaseColors.neutral400} />}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typography fontFamily="urbanist-bold" color={Colors.textLighter}>
                            New Password <Asterisk />
                        </Typography>
                        <FormInput
                            placeholder="Enter a new password"
                            isPassword={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={passwordData.newPassword}
                            onChangeText={(value) => setPasswordData({ ...passwordData, newPassword: value })}
                            icon={<Icons.PasswordIcon size={verticalScale(26)} color={BaseColors.neutral400} />}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>

            <View style={[styles.footerArea, { borderTopColor: BaseColors[currentTheme == "dark" ? "neutral700" : "neutral400"] }]}>
                <Button onPress={handleSubmit} loading={loading} disabled={loading} style={{ width: "100%" }}>
                    <Typography size={22.5} color={Colors.white} fontFamily="urbanist-semibold">Change Password</Typography>
                </Button>
            </View>
        </ModalWrapper>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
    },
	formItems: {
        flex: 1,
        width: "100%",
		gap: spacingY._15,
	},
	inputContainer: {
		gap: spacingY._10,
	},
    footerArea: {
        marginTop: "auto",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        marginBottom: spacingY._15,
        borderTopWidth: 1,
    },
});
