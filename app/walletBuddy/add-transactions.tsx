"use client"

import { useState } from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "@/lib/useColorScheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { router } from "expo-router"

export default function AddTransaction() {
  const { isDarkColorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()
  const [transactionType, setTransactionType] = useState("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [note, setNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  // Categories based on transaction type
  const expenseCategories = [
    { name: "Food", icon: "fast-food", color: "#FF9500" },
    { name: "Transportation", icon: "car", color: "#5856D6" },
    { name: "Shopping", icon: "cart", color: "#FF2D55" },
    { name: "Bills", icon: "flash", color: "#5AC8FA" },
    { name: "Health", icon: "fitness", color: "#FF9500" },
    { name: "Entertainment", icon: "film", color: "#AF52DE" },
    { name: "Education", icon: "school", color: "#5AC8FA" },
    { name: "Other", icon: "ellipsis-horizontal", color: "#8E8E93" },
  ]

  const incomeCategories = [
    { name: "Salary", icon: "cash", color: "#4CD964" },
    { name: "Freelance", icon: "briefcase", color: "#4CD964" },
    { name: "Investments", icon: "trending-up", color: "#4CD964" },
    { name: "Gifts", icon: "gift", color: "#4CD964" },
    { name: "Other", icon: "ellipsis-horizontal", color: "#4CD964" },
  ]

  const paymentMethods = [
    { name: "Cash", icon: "cash" },
    { name: "Credit Card", icon: "card" },
    { name: "Debit Card", icon: "card-outline" },
    { name: "Bank Transfer", icon: "swap-horizontal" },
    { name: "Mobile Payment", icon: "phone-portrait" },
  ]

  const categories = transactionType === "expense" ? expenseCategories : incomeCategories

  const handleSave = () => {
    // Save transaction logic here
    console.log({
      type: transactionType,
      amount,
      category,
      date,
      note,
      paymentMethod,
    })

    // Navigate back to transactions
    router.back()
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Add Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Transaction Type Tabs - Custom Implementation */}
        <View className="mb-6">
          <View className="flex-row h-12 bg-secondary rounded-lg overflow-hidden">
            <TouchableOpacity
              className={`flex-1 items-center justify-center ${
                transactionType === "expense" ? "bg-primary" : "bg-secondary"
              }`}
              onPress={() => setTransactionType("expense")}
            >
              <Text
                className={`font-medium ${
                  transactionType === "expense" ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center justify-center ${
                transactionType === "income" ? "bg-primary" : "bg-secondary"
              }`}
              onPress={() => setTransactionType("income")}
            >
              <Text
                className={`font-medium ${
                  transactionType === "income" ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount Input */}
        <View className="mb-6">
          <Label htmlFor="amount">Amount</Label>
          <View className="relative mt-1.5">
            <Text className="absolute left-3 top-3 text-lg font-bold">
              {transactionType === "expense" ? "-" : "+"}₱
            </Text>
            <Input
              id="amount"
              className="pl-10 text-lg font-bold"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
            />
          </View>
        </View>

        {/* Category Selection */}
        <View className="mb-6">
          <Label>Category</Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 mt-1.5 py-2">
            {categories.map((cat) => (
              <TouchableOpacity key={cat.name} onPress={() => setCategory(cat.name)} activeOpacity={0.7}>
                <Card className={`w-20 border-0 ${category === cat.name ? "bg-primary/10" : ""}`}>
                  <CardContent className="p-3 items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                    </View>
                    <Text className="text-xs text-center">{cat.name}</Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Selection */}
        <View className="mb-6">
          <Label htmlFor="date">Date</Label>
          <TouchableOpacity
            className="flex-row items-center mt-1.5 border border-input rounded-md h-10 px-3"
            onPress={() => {
              // Open date picker
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={isDarkColorScheme ? "#fff" : "#000"} className="mr-2" />
            <Text>{date}</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View className="mb-6">
          <Label>Payment Method</Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 mt-1.5 py-2">
            {paymentMethods.map((method) => (
              <TouchableOpacity key={method.name} onPress={() => setPaymentMethod(method.name)} activeOpacity={0.7}>
                <Card className={`w-20 border-0 ${paymentMethod === method.name ? "bg-primary/10" : ""}`}>
                  <CardContent className="p-3 items-center">
                    <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center mb-2">
                      <Ionicons name={method.icon as any} size={18} color={isDarkColorScheme ? "#fff" : "#000"} />
                    </View>
                    <Text className="text-xs text-center">{method.name}</Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Note Input */}
        <View className="mb-10">
          <Label htmlFor="note">Note</Label>
          <Input
            id="note"
            className="mt-1.5"
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ height: 80, paddingTop: 10 }}
          />
        </View>

        {/* Save Button */}
        <Button className="mb-6" onPress={handleSave}>
          <Text className="text-primary-foreground font-medium">Save Transaction</Text>
        </Button>
      </ScrollView>
    </View>
  )
}

