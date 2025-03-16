import { Tabs } from "expo-router"
import { useColorScheme } from "@/lib/useColorScheme"
import { CustomTabBar } from "@/components/ui/custom-tab-bar"

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          href: null, // This hides the tab from the URL
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  )
}

