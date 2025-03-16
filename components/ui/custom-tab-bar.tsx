import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "@/lib/useColorScheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"

interface TabBarProps {
  state: any
  navigation: any
}

const TabBarIcon = ({ name, color, size = 24 }: { name: string; color: string; size?: number }) => (
  <Ionicons name={name as any} size={size} color={color} />
)

export function CustomTabBar({ state, navigation }: TabBarProps) {
  const { isDarkColorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()
  const { width } = Dimensions.get("window")

  const backgroundColor = isDarkColorScheme ? "#1c1c1e" : "#ffffff"
  const activeColor = isDarkColorScheme ? "#ffffff" : "#000000"
  const inactiveColor = isDarkColorScheme ? "#666666" : "#999999"
  const borderTopColor = isDarkColorScheme ? "#2c2c2e" : "#f0f0f0"

  const getIconName = (routeName: string) => {
    switch (routeName) {
      case "home":
        return "home"
      case "transactions":
        return "list"
      case "analytics":
        return "stats-chart"
      case "category":
        return "grid"
      case "profile":
        return "person"
      default:
        return "home"
    }
  }

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case "home":
        return "Home"
      case "transactions":
        return "Transactions"
      case "analytics":
        return "Analytics"
      case "category":
        return "Category"
      case "profile":
        return "Profile"
      default:
        return routeName
    }
  }

  // Filter out the index tab
  const visibleRoutes = state.routes.filter((route: any) => route.name !== "index")
  const tabWidth = width / visibleRoutes.length

  // Create a map of animated styles for each route
  const animatedDotStyles = visibleRoutes.map((route: any, index: number) => {
    const actualIndex = state.routes.findIndex((r: any) => r.key === route.key)
    const isFocused = state.index === actualIndex

    return useAnimatedStyle(() => {
      return {
        width: withSpring(isFocused ? 4 : 0, { damping: 15 }),
        height: 4,
        borderRadius: 2,
        backgroundColor: activeColor,
        marginTop: 4,
      }
    })
  })

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor,
          borderTopColor,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
        },
      ]}
    >
      {visibleRoutes.map((route: any, index: number) => {
        // Find the actual index in the original routes array
        const actualIndex = state.routes.findIndex((r: any) => r.key === route.key)
        const isFocused = state.index === actualIndex
        const iconName = getIconName(route.name)
        const label = getLabel(route.name)

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[styles.tabButton, { width: tabWidth }]}
          >
            <View style={styles.tabItem}>
              <Animated.View style={[styles.iconContainer, isFocused && { transform: [{ scale: 1.1 }] }]}>
                <TabBarIcon name={iconName} color={isFocused ? activeColor : inactiveColor} size={22} />
              </Animated.View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? activeColor : inactiveColor },
                  isFocused && styles.activeLabel,
                ]}
              >
                {label}
              </Text>
              <Animated.View style={animatedDotStyles[index]} />
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
  activeLabel: {
    fontWeight: "600",
  },
})

