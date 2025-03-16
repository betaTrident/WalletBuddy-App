"use client"

import { useState } from "react"
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "@/lib/useColorScheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Animated, { FadeInUp } from "react-native-reanimated"
import { LineChart, BarChart } from "react-native-chart-kit"
import PieChart from "react-native-chart-kit/dist/PieChart.js"

export default function Analytics() {
  const { isDarkColorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedChart, setSelectedChart] = useState("spending")
  const screenWidth = Dimensions.get("window").width - 48 // Accounting for padding

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: isDarkColorScheme ? "#1F2937" : "#FFFFFF",
    backgroundGradientTo: isDarkColorScheme ? "#1F2937" : "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) =>
      selectedChart === "spending"
        ? `rgba(255, 59, 48, ${opacity})`
        : selectedChart === "income"
          ? `rgba(76, 217, 100, ${opacity})`
          : `rgba(90, 200, 250, ${opacity})`,
    labelColor: (opacity = 1) => (isDarkColorScheme ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: selectedChart === "spending" ? "#FF3B30" : selectedChart === "income" ? "#4CD964" : "#5AC8FA",
    },
  }

  // Sample data for charts
  const spendingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: [1200, 900, 1500, 1100, 1300, 800, 1700],
      },
    ],
  }

  const incomeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: [2500, 2500, 2700, 2500, 2500, 3000, 3200],
      },
    ],
  }

  const savingsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: [1300, 1600, 1200, 1400, 1200, 2200, 1500],
      },
    ],
  }

  const dailySpendingData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [45, 35, 55, 40, 70, 85, 60],
      },
    ],
  }

  const categoryData = [
    { name: "Food", value: 320, color: "#FF9500" },
    { name: "Transport", value: 120, color: "#5856D6" },
    { name: "Shopping", value: 214, color: "#FF2D55" },
    { name: "Bills", value: 154, color: "#5AC8FA" },
    { name: "Health", value: 85, color: "#FF9500" },
    { name: "Entertainment", value: 110, color: "#AF52DE" },
  ]

  // Format for pie chart
  const pieChartData = categoryData.map((item) => ({
    name: item.name,
    population: item.value,
    color: item.color,
    legendFontColor: isDarkColorScheme ? "#FFF" : "#000",
    legendFontSize: 12,
  }))

  // Calculate total spending
  const totalSpending = categoryData.reduce((sum, category) => sum + category.value, 0)

  // Get chart data based on selected chart
  const getChartData = () => {
    switch (selectedChart) {
      case "spending":
        return spendingData
      case "income":
        return incomeData
      case "savings":
        return savingsData
      default:
        return spendingData
    }
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold">Analytics</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-secondary items-center justify-center">
            <Ionicons name="calendar-outline" size={20} color={isDarkColorScheme ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View className="flex-row mt-4 bg-secondary rounded-lg p-1">
          {["week", "month", "year", "all"].map((period) => (
            <TouchableOpacity
              key={period}
              className={`flex-1 py-2 px-3 rounded-md ${selectedPeriod === period ? "bg-primary" : "bg-transparent"}`}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                className={`text-center text-xs font-medium ${
                  selectedPeriod === period ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Overview Card */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <Card className="mx-4 mb-4 border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Spending Overview</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-3xl font-bold">₱{totalSpending}</Text>
                <Badge variant="outline" className="bg-green-100 border-0">
                  <Ionicons name="trending-down" size={14} color="#4CD964" className="mr-1" />
                  <Text className="text-xs text-green-600">12% less</Text>
                </Badge>
              </View>
              <Text className="text-sm text-muted-foreground mb-4">
                Total spending for {selectedPeriod === "month" ? "July" : selectedPeriod}
              </Text>

              {/* Chart Type Selector */}
              <View className="flex-row mb-4 bg-secondary/50 rounded-lg p-1">
                {[
                  { id: "spending", label: "Spending" },
                  { id: "income", label: "Income" },
                  { id: "savings", label: "Savings" },
                ].map((chart) => (
                  <TouchableOpacity
                    key={chart.id}
                    className={`flex-1 py-1.5 px-2 rounded-md ${
                      selectedChart === chart.id ? "bg-primary" : "bg-transparent"
                    }`}
                    onPress={() => setSelectedChart(chart.id)}
                  >
                    <Text
                      className={`text-center text-xs font-medium ${
                        selectedChart === chart.id ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {chart.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Line Chart */}
              <View className="items-center mt-2">
                <LineChart
                  data={getChartData()}
                  width={screenWidth}
                  height={180}
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  withDots={true}
                  withShadow={false}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                />
              </View>
            </CardContent>
          </Card>
        </Animated.View>

        {/* Spending by Category */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Card className="mx-4 mb-4 border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <View className="items-center mb-4">
                <PieChart
                  data={pieChartData}
                  width={screenWidth}
                  height={180}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  hasLegend={false}
                />
              </View>

              <View className="mt-2">
                {categoryData.map((category, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                    <Text className="text-xs flex-1">{category.name}</Text>
                    <Text className="text-xs font-medium">₱{category.value}</Text>
                    <Text className="text-xs text-muted-foreground ml-2">
                      {Math.round((category.value / totalSpending) * 100)}%
                    </Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </Animated.View>

        {/* Daily Spending */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Card className="mx-4 mb-4 border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Daily Spending</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <View className="items-center mt-2">
                <BarChart
                  data={dailySpendingData}
                  width={screenWidth}
                  height={180}
                  yAxisLabel="₱"
                  yAxisSuffix=""
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(88, 86, 214, ${opacity})`,
                    strokeWidth: 2,
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  withInnerLines={false}
                  showBarTops={false}
                  fromZero={true}
                />
              </View>
            </CardContent>
          </Card>
        </Animated.View>

        {/* Top Spending Categories */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)}>
          <Card className="mx-4 mb-4 border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {categoryData
                .sort((a, b) => b.value - a.value)
                .slice(0, 3)
                .map((category, index) => (
                  <View key={index} className="mb-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <View className="flex-row items-center">
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center mr-2"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Ionicons
                            name={
                              category.name === "Food"
                                ? "fast-food"
                                : category.name === "Transport"
                                  ? "car"
                                  : category.name === "Shopping"
                                    ? "cart"
                                    : category.name === "Bills"
                                      ? "flash"
                                      : category.name === "Health"
                                        ? "fitness"
                                        : "film"
                            }
                            size={16}
                            color={category.color}
                          />
                        </View>
                        <Text className="font-medium">{category.name}</Text>
                      </View>
                      <Text className="font-semibold">₱{category.value}</Text>
                    </View>
                    <Progress
                      value={(category.value / categoryData[0].value) * 100}
                      className="h-1.5"
                      indicatorClassName={`bg-[${category.color}]`}
                    />
                    {index < 2 && <Separator className="mt-3" />}
                  </View>
                ))}
            </CardContent>
          </Card>
        </Animated.View>

        {/* Budget Status */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)}>
          <Card className="mx-4 mb-4 border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Budget Status</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-muted-foreground">Monthly Budget</Text>
                <Text className="font-semibold">₱{totalSpending} / ₱1,500</Text>
              </View>
              <Progress value={(totalSpending / 1500) * 100} className="h-2 mb-1" />
              <Text className="text-xs text-right text-muted-foreground">
                {Math.round((totalSpending / 1500) * 100)}% of budget used
              </Text>

              <View className="mt-4 flex-row justify-between">
                <View className="items-center">
                  <Text className="text-sm text-muted-foreground mb-1">Remaining</Text>
                  <Text className="text-lg font-semibold text-green-500">₱{1500 - totalSpending}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-muted-foreground mb-1">Daily Budget</Text>
                  <Text className="text-lg font-semibold">₱{Math.round((1500 - totalSpending) / 15)}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-sm text-muted-foreground mb-1">Days Left</Text>
                  <Text className="text-lg font-semibold">15</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Animated.View>

        {/* Insights */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} className="mb-20">
          <Card className="mx-4 mb-4 border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">Insights</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <View className="space-y-3">
                <View className="flex-row items-start mt-2">
                  <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3 mt-0.5">
                    <Ionicons name="trending-down" size={16} color="#5AC8FA" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium mb-1">Spending decreased</Text>
                    <Text className="text-sm text-muted-foreground">
                      Your spending decreased by 12% compared to last month.
                    </Text>
                  </View>
                </View>

                <Separator className="mt-2 mb-2" />

                <View className="flex-row items-start">
                  <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3 mt-0.5">
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium mb-1">Food spending increased</Text>
                    <Text className="text-sm text-muted-foreground">
                      Your food spending increased by 20% compared to last month.
                    </Text>
                  </View>
                </View>

                <Separator className="mt-2 mb-2" />

                <View className="flex-row items-start">
                  <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3 mt-0.5">
                    <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium mb-1">Savings goal on track</Text>
                    <Text className="text-sm text-muted-foreground">
                      You're on track to reach your savings goal by September.
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

