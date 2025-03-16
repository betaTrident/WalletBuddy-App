"use client"

import { useState } from "react"
import { View, TouchableOpacity, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "@/lib/useColorScheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { router } from "expo-router"
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from "react-native-reanimated"

// Define the Transaction type
interface Transaction {
  id: string
  name: string
  category: string
  amount: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  time: string
  paymentMethod: string
  location: string
  notes: string
}

// Define the TransactionGroup type
interface TransactionGroup {
  date: string
  transactions: Transaction[]
}

export default function Transactions() {
  const { isDarkColorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Animation for header
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, 100], [120, 60], { extrapolateRight: "clamp" })

    return {
      height,
      overflow: "hidden",
    }
  })

  // Sample data grouped by date
  const transactionsByDate: TransactionGroup[] = [
    {
      date: "Today, March 16",
      transactions: [
        {
          id: "t1",
          name: "Grocery Store",
          category: "Food",
          amount: "-₱152.50",
          icon: "basket",
          color: "#FF9500",
          time: "2:30 PM",
          paymentMethod: "Credit Card",
          location: "Whole Foods Market",
          notes: "Weekly grocery shopping",
        },
        {
          id: "t2",
          name: "Coffee Shop",
          category: "Food & Drink",
          amount: "-₱40.00",
          icon: "cafe",
          color: "#FF9500",
          time: "9:15 AM",
          paymentMethod: "Debit Card",
          location: "Starbucks",
          notes: "Morning coffee",
        },
      ],
    },
    {
      date: "Yesterday, March 15",
      transactions: [
        {
          id: "t3",
          name: "Salary Deposit",
          category: "Income",
          amount: "+₱2,400.00",
          icon: "cash",
          color: "#4CD964",
          time: "9:00 AM",
          paymentMethod: "Direct Deposit",
          location: "ABC Company",
          notes: "Monthly salary",
        },
        {
          id: "t4",
          name: "Restaurant",
          category: "Food",
          amount: "-₱320.00",
          icon: "restaurant",
          color: "#FF9500",
          time: "7:45 PM",
          paymentMethod: "Credit Card",
          location: "Italian Bistro",
          notes: "Dinner with friends",
        },
      ],
    },
    {
      date: "March 14",
      transactions: [
        {
          id: "t5",
          name: "Electric Bill",
          category: "Utilities",
          amount: "-₱504.80",
          icon: "flash",
          color: "#5AC8FA",
          time: "3:20 PM",
          paymentMethod: "Bank Transfer",
          location: "City Power Co.",
          notes: "Monthly electricity bill",
        },
        {
          id: "t6",
          name: "Gas Station",
          category: "Transportation",
          amount: "-₱250.00",
          icon: "car",
          color: "#5856D6",
          time: "11:30 AM",
          paymentMethod: "Debit Card",
          location: "Shell Gas Station",
          notes: "Filled up the tank",
        },
      ],
    },
  ]

  // Filter transactions based on search query and active tab
  const getFilteredTransactions = () => {
    return transactionsByDate
      .map((group) => {
        const filteredTransactions = group.transactions.filter((transaction) => {
          // Filter by search query
          const matchesSearch =
            searchQuery === "" ||
            transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase())

          // Filter by tab
          const matchesTab =
            activeTab === "all" ||
            (activeTab === "income" && transaction.amount.startsWith("+")) ||
            (activeTab === "expense" && transaction.amount.startsWith("-")) ||
            (activeTab === "transfer" && transaction.category === "Transfer")

          // Filter by selected categories
          const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(transaction.category)

          return matchesSearch && matchesTab && matchesCategory
        })

        return {
          ...group,
          transactions: filteredTransactions,
        }
      })
      .filter((group) => group.transactions.length > 0)
  }

  const filteredTransactions = getFilteredTransactions()

  // Categories for filter
  const categories = [
    { name: "Food", color: "#FF9500" },
    { name: "Food & Drink", color: "#FF9500" },
    { name: "Income", color: "#4CD964" },
    { name: "Utilities", color: "#5AC8FA" },
    { name: "Transportation", color: "#5856D6" },
    { name: "Shopping", color: "#FF2D55" },
    { name: "Health", color: "#FF9500" },
  ]

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold">Transactions</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-secondary items-center justify-center"
              onPress={() => setIsFilterVisible(!isFilterVisible)}
            >
              <Ionicons name="options-outline" size={20} color={isDarkColorScheme ? "#fff" : "#000"} />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-secondary items-center justify-center"
              onPress={() => {
                // Open date picker or date filter
              }}
            >
              <Ionicons name="calendar-outline" size={20} color={isDarkColorScheme ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="relative mt-4">
          <Ionicons
            name="search"
            size={20}
            color={isDarkColorScheme ? "#666" : "#999"}
            style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
          />
          <Input
            placeholder="Search transactions..."
            className="pl-10 bg-secondary border-0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Section */}
      {isFilterVisible && (
        <View className="px-4 py-3 bg-card border-y border-border">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-medium">Filter by</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategories([])
                setSortBy("date")
              }}
            >
              <Text className="text-sm text-primary">Reset</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-3">
            <Text className="text-sm text-muted-foreground mb-2">Categories</Text>
            <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => toggleCategory(category.name)}
                  className={`px-3 py-1.5 rounded-full border ${
                    selectedCategories.includes(category.name)
                      ? "bg-primary border-primary"
                      : "bg-secondary border-border"
                  }`}
                >
                  <Text className={selectedCategories.includes(category.name) ? "text-primary-foreground" : ""}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.ScrollView>
          </View>

          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground mr-3">Sort by</Text>
            <View className="flex-row gap-2">
              {["Date", "Amount", "Name"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSortBy(option.toLowerCase())}
                  className={`px-3 py-1.5 rounded-full border ${
                    sortBy === option.toLowerCase() ? "bg-primary border-primary" : "bg-secondary border-border"
                  }`}
                >
                  <Text className={sortBy === option.toLowerCase() ? "text-primary-foreground" : ""}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Tab Buttons - Fixed horizontal layout */}
      <View className="px-4 py-2 border-b border-border">
        <View className="flex-row justify-between">
          <TouchableOpacity
            className={`py-2 px-4 ${activeTab === "all" ? "border-b-2 border-primary" : ""}`}
            onPress={() => setActiveTab("all")}
          >
            <Text className={`${activeTab === "all" ? "text-primary font-medium" : "text-muted-foreground"}`}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 ${activeTab === "income" ? "border-b-2 border-primary" : ""}`}
            onPress={() => setActiveTab("income")}
          >
            <Text className={`${activeTab === "income" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 ${activeTab === "expense" ? "border-b-2 border-primary" : ""}`}
            onPress={() => setActiveTab("expense")}
          >
            <Text className={`${activeTab === "expense" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 ${activeTab === "transfer" ? "border-b-2 border-primary" : ""}`}
            onPress={() => setActiveTab("transfer")}
          >
            <Text className={`${activeTab === "transfer" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Transfer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction List - Using Animated.ScrollView from react-native-reanimated */}
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {activeTab === "all" && filteredTransactions.length > 0 ? (
          filteredTransactions.map((group, groupIndex) => (
            <View key={groupIndex} className="mb-6">
              <Text className="text-sm text-muted-foreground mb-3 mt-4">{group.date}</Text>

              {group.transactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  activeOpacity={0.7}
                  className="mb-3"
                  onPress={() => {
                    setSelectedTransaction(transaction)
                    setIsDetailsModalVisible(true)
                  }}
                >
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
                        <View className="flex-row items-center mt-1">
                          <Text className="text-xs text-muted-foreground">{transaction.time}</Text>
                          <View className="w-1 h-1 rounded-full bg-muted-foreground mx-1.5" />
                          <Badge variant="outline" className="py-0 h-5">
                            <Text className="text-xs">{transaction.category}</Text>
                          </Badge>
                        </View>
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
          ))
        ) : activeTab === "income" ? (
          // Income tab content
          transactionsByDate
            .map((group) => ({
              ...group,
              transactions: group.transactions.filter((t) => t.amount.startsWith("+")),
            }))
            .filter((group) => group.transactions.length > 0)
            .map((group, groupIndex) => (
              <View key={groupIndex} className="mb-6">
                <Text className="text-sm text-muted-foreground mb-3 mt-4">{group.date}</Text>

                {group.transactions.map((transaction) => (
                  <TouchableOpacity
                    key={transaction.id}
                    activeOpacity={0.7}
                    className="mb-3"
                    onPress={() => {
                      setSelectedTransaction(transaction)
                      setIsDetailsModalVisible(true)
                    }}
                  >
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
                          <View className="flex-row items-center mt-1">
                            <Text className="text-xs text-muted-foreground">{transaction.time}</Text>
                            <View className="w-1 h-1 rounded-full bg-muted-foreground mx-1.5" />
                            <Badge variant="outline" className="py-0 h-5">
                              <Text className="text-xs">{transaction.category}</Text>
                            </Badge>
                          </View>
                        </View>
                        <Text className="font-semibold text-green-500">{transaction.amount}</Text>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            ))
        ) : activeTab === "expense" ? (
          // Expense tab content
          transactionsByDate
            .map((group) => ({
              ...group,
              transactions: group.transactions.filter((t) => t.amount.startsWith("-")),
            }))
            .filter((group) => group.transactions.length > 0)
            .map((group, groupIndex) => (
              <View key={groupIndex} className="mb-6">
                <Text className="text-sm text-muted-foreground mb-3 mt-4">{group.date}</Text>

                {group.transactions.map((transaction) => (
                  <TouchableOpacity
                    key={transaction.id}
                    activeOpacity={0.7}
                    className="mb-3"
                    onPress={() => {
                      setSelectedTransaction(transaction)
                      setIsDetailsModalVisible(true)
                    }}
                  >
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
                          <View className="flex-row items-center mt-1">
                            <Text className="text-xs text-muted-foreground">{transaction.time}</Text>
                            <View className="w-1 h-1 rounded-full bg-muted-foreground mx-1.5" />
                            <Badge variant="outline" className="py-0 h-5">
                              <Text className="text-xs">{transaction.category}</Text>
                            </Badge>
                          </View>
                        </View>
                        <Text className="font-semibold text-red-500">{transaction.amount}</Text>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            ))
        ) : (
          // Transfer tab content
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="swap-horizontal" size={48} color={isDarkColorScheme ? "#666" : "#999"} />
            <Text className="text-muted-foreground mt-4 text-center">No transfer transactions</Text>
            <Text className="text-muted-foreground text-center">Add a transfer to see it here</Text>
          </View>
        )}

        {filteredTransactions.length === 0 && activeTab !== "transfer" && (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="search-outline" size={48} color={isDarkColorScheme ? "#666" : "#999"} />
            <Text className="text-muted-foreground mt-4 text-center">No transactions found</Text>
            <Text className="text-muted-foreground text-center">Try adjusting your filters</Text>
          </View>
        )}
      </Animated.ScrollView>

      {/* Transaction Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailsModalVisible}
        onRequestClose={() => setIsDetailsModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            className="absolute inset-0 bg-black/30"
            activeOpacity={1}
            onPress={() => setIsDetailsModalVisible(false)}
          />
          <View className="bg-background rounded-t-3xl p-6" style={{ paddingBottom: Math.max(20, insets.bottom) }}>
            <View className="w-12 h-1 bg-border self-center rounded-full mb-6" />

            {selectedTransaction && (
              <>
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${selectedTransaction.color}20` }}
                    >
                      <Ionicons name={selectedTransaction.icon} size={24} color={selectedTransaction.color} />
                    </View>
                    <View>
                      <Text className="text-lg font-semibold">{selectedTransaction.name}</Text>
                      <Text className="text-muted-foreground">
                        {
                          transactionsByDate.find((g) => g.transactions.some((t) => t.id === selectedTransaction.id))
                            ?.date
                        }{" "}
                        • {selectedTransaction.time}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`text-lg font-bold ${selectedTransaction.amount.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                  >
                    {selectedTransaction.amount}
                  </Text>
                </View>

                <Separator className="mb-4" />

                <View className="space-y-4">
                  <View>
                    <Text className="text-sm text-muted-foreground">Category</Text>
                    <Text className="font-medium">{selectedTransaction.category}</Text>
                  </View>

                  <View>
                    <Text className="text-sm text-muted-foreground">Payment Method</Text>
                    <Text className="font-medium">{selectedTransaction.paymentMethod}</Text>
                  </View>

                  <View>
                    <Text className="text-sm text-muted-foreground">Location</Text>
                    <Text className="font-medium">{selectedTransaction.location}</Text>
                  </View>

                  {selectedTransaction.notes && (
                    <View>
                      <Text className="text-sm text-muted-foreground">Notes</Text>
                      <Text className="font-medium">{selectedTransaction.notes}</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row gap-2 mt-8">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onPress={() => {
                      setIsDetailsModalVisible(false)
                      router.push({
                        pathname: "/walletBuddy/add-transactions",
                        params: { id: selectedTransaction.id, mode: "edit" },
                      })
                    }}
                  >
                    <Ionicons name="pencil-outline" size={18} style={{ marginRight: 4 }} />
                    <Text>Edit</Text>
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onPress={() => {
                      setIsDetailsModalVisible(false)
                      // Handle delete
                      // In a real app, you would call a function to delete the transaction
                      alert("Transaction deleted")
                    }}
                  >
                    <Ionicons name="trash-outline" size={18} style={{ marginRight: 4 }} />
                    <Text className="text-destructive-foreground">Delete</Text>
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={() => {
            // Navigate to add transaction screen
            router.push("/walletBuddy/add-transactions")
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

