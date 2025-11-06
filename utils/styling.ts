import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const [shortDimension, longDimension] = 
    SCREEN_WIDTH < SCREEN_HEIGHT ? 
    [SCREEN_WIDTH, SCREEN_HEIGHT] : 
    [SCREEN_HEIGHT, SCREEN_WIDTH]
;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = function(size: number) {
    return Math.round(
        PixelRatio.roundToNearestPixel(
            (shortDimension / guidelineBaseWidth) * (size as number)
        )
    );
}

export const verticalScale = function(size: number) {
    return Math.round(
        PixelRatio.roundToNearestPixel(
            (longDimension / guidelineBaseHeight) * (size as number)
        )
    );
}