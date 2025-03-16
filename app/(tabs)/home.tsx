"use client"

import React from "react"
import { View, ScrollView, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "@/lib/useColorScheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { router } from "expo-router"

export default function Home() {
  const { isDarkColorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()
  const [savingsProgress, setSavingsProgress] = React.useState(65)

  // Sample data
  const categories: { name: string; icon: TransactionIcon; amount: string; color: string }[] = [
    { name: "Food", icon: "fast-food", amount: "₱320.50", color: "#FF9500" },
    { name: "Transport", icon: "car", amount: "₱120.00", color: "#5856D6" },
    { name: "Shopping", icon: "cart", amount: "₱214.20", color: "#FF2D55" },
    { name: "Bills", icon: "flash", amount: "₱154.00", color: "#5AC8FA" },
  ]

  type TransactionIcon =
    | "fast-food"
    | "car"
    | "cart"
    | "flash"
    | "basket"
    | "cash"
    | "key"
    | "push"
    | "map"
    | "filter"
    | "at"
    | "body"
    | "code"
    | "link"
    | "menu"
    | "search"
    | "time"
    | "ellipse"
    | "image"
    | undefined

  const transactions: {
    name: string
    category: string
    amount: string
    date: string
    icon: TransactionIcon
    color: string
  }[] = [
    {
      name: "Grocery Store",
      category: "Food",
      amount: "-₱56.25",
      date: "Today",
      icon: "basket",
      color: "#FF9500",
    },
    {
      name: "Salary Deposit",
      category: "Income",
      amount: "+₱2,400.00",
      date: "Mar 15",
      icon: "cash",
      color: "#4CD964",
    },
    {
      name: "Electric Bill",
      category: "Utilities",
      amount: "-₱94.80",
      date: "Mar 14",
      icon: "flash",
      color: "#5AC8FA",
    },
  ]

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-20">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-4">
          <View className="flex-row items-center gap-3">
            <Image
              source={require("@/assets/images/WalletBuddy.png")}
              style={{ width: 120, height: 40 }}
              resizeMode="contain"
            />
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-secondary items-center justify-center">
              <Ionicons name="notifications-outline" size={20} color={isDarkColorScheme ? "#fff" : "#000"} />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-secondary items-center justify-center">
              <Ionicons name="settings-outline" size={20} color={isDarkColorScheme ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <Card className="mx-4 my-2 overflow-hidden border-0 shadow-lg">
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-base text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <Text className="text-3xl font-bold">₱2,450.25</Text>
            <View className="flex-row justify-between mt-6">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="arrow-up" size={16} color="#4CD964" />
                </View>
                <View>
                  <Text className="text-xs text-muted-foreground">Income</Text>
                  <Text className="text-base font-semibold">₱3,240.00</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                  <Ionicons name="arrow-down" size={16} color="#FF3B30" />
                </View>
                <View>
                  <Text className="text-xs text-muted-foreground">Expenses</Text>
                  <Text className="text-base font-semibold">₱789.75</Text>
                </View>
              </View>
            </View>
          </CardContent>
          <CardFooter className="pt-0 pb-6">
            <View className="flex-row gap-2 w-full">
              <Button className="flex-1 bg-primary" onPress={() => router.push("/transactions")}>
                <Ionicons name="add-circle-outline" size={18} color="#fff" className="mr-1" />
                <Text className="text-primary-foreground font-medium">Add</Text>
              </Button>
              <Button className="flex-1" variant="outline" onPress={() => router.push("/transactions")}>
                <Ionicons name="swap-horizontal-outline" size={18} className="mr-1" />
                <Text className="font-medium">Transfer</Text>
              </Button>
            </View>
          </CardFooter>
        </Card>

        {/* Rest of the code remains the same */}
        {/* Savings Goal */}
        <Card className="mx-4 my-2 overflow-hidden border-0 shadow-lg">
          <CardHeader className="pb-2 pt-6 flex-row justify-between items-center">
            <CardTitle className="text-base">Savings Goal</CardTitle>
            <Text className="text-sm text-muted-foreground">₱22, 750 / ₱35,000</Text>
          </CardHeader>
          <CardContent className="pb-6">
            <Progress value={savingsProgress} className="h-2 mt-2" />
            <View className="flex-row justify-between mt-3">
              <Text className="text-xs text-muted-foreground">New Laptop</Text>
              <Text className="text-xs text-muted-foreground">{savingsProgress}%</Text>
            </View>
          </CardContent>
        </Card>

        {/* Categories */}
        <View className="px-4 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Categories</Text>
            <TouchableOpacity onPress={() => router.push("/category")}>
              <Text className="text-sm text-primary">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pb-2">
            {categories.map((category, index) => (
              <TouchableOpacity key={index} activeOpacity={0.7}>
                <Card className="w-[110px] border-0 shadow-sm">
                  <CardContent className="p-3 items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Ionicons name={category.icon} size={18} color={category.color} />
                    </View>
                    <Text className="text-sm font-medium">{category.name}</Text>
                    <Text className="text-xs text-muted-foreground mt-1">{category.amount}</Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View className="px-4 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/transactions")}>
              <Text className="text-sm text-primary">See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction, index) => (
            <TouchableOpacity key={index} activeOpacity={0.7} className="mb-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${transaction.color}20` }}
                  >
                    <Ionicons name={transaction.icon} size={18} color={transaction.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{transaction.name}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {transaction.category} • {transaction.date}
                    </Text>
                  </View>
                  <Text
                    className={`font-semibold ${transaction.amount.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                  >
                    {transaction.amount}
                  </Text>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

