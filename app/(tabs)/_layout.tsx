import CustomTabs from "@/components/CustomTabs";
import { Tabs } from "expo-router";
import React from "react";


export default function TabsLayout() {
	return (
		<Tabs
            screenOptions={{
                // tabBarActiveTintColor: "coral",
                // tabBarInactiveTintColor: "#bbb",
                headerShown: false
            }}
            tabBar={(props) => <CustomTabs {...props} />}
        >
			{/* <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Icons.HouseIcon weight={focused ? "fill" : "regular"} size={24} color={color} />
                    )
                }}
            /> */}

            <Tabs.Screen name="index" />
            <Tabs.Screen name="wishlist" />
            <Tabs.Screen name="wallet" />
            <Tabs.Screen name="profile" />
		</Tabs>
	);
}