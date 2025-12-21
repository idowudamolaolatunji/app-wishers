import { BaseColors, radius, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { View } from "react-native";

export default function ModalNoudgeHandle() {
	return <View style={{ width: verticalScale(70), height: verticalScale(7), backgroundColor: BaseColors.neutral400, borderRadius: radius._30, alignSelf: "center", marginBottom: spacingY._20 }} />;
}
