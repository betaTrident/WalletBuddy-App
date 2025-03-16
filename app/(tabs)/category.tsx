"use client"

import { useState, useRef } from "react"
import { View, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "@/lib/useColorScheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/ui/text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Popover
} from "@/components/ui/popover"

export default function Category() {
  const { isDarkColorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddPopoverOpen, setIsAddPopoverOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("grid")
  const [newCategoryColor, setNewCategoryColor] = useState("#FF9500")
  const [newCategoryBudget, setNewCategoryBudget] = useState("")
  
  // Refs for popover anchors
  const addButtonRef = useRef(null)
  const detailsButtonRef = useRef(null)
  
  // Define the category type
  type CategoryType = {
    id: string
    name: string
    icon: string
    color: string
    budget: number
    spent: number
    transactions: number
    percentage: number
  }
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [isDetailsPopoverOpen, setIsDetailsPopoverOpen] = useState(false)

  // Move categories to state so we can update it
  const [categories, setCategories] = useState<CategoryType[]>([
    {
      id: "c1",
      name: "Food",
      icon: "fast-food",
      color: "#FF9500",
      budget: 400,
      spent: 320.5,
      transactions: 12,
      percentage: 80,
    },
    {
      id: "c2",
      name: "Transportation",
      icon: "car",
      color: "#5856D6",
      budget: 200,
      spent: 120.0,
      transactions: 5,
      percentage: 60,
    },
    {
      id: "c3",
      name: "Shopping",
      icon: "cart",
      color: "#FF2D55",
      budget: 300,
      spent: 214.2,
      transactions: 8,
      percentage: 71,
    },
    {
      id: "c4",
      name: "Bills",
      icon: "flash",
      color: "#5AC8FA",
      budget: 500,
      spent: 154.0,
      transactions: 3,
      percentage: 31,
    },
    {
      id: "c5",
      name: "Entertainment",
      icon: "film",
      color: "#AF52DE",
      budget: 150,
      spent: 87.5,
      transactions: 4,
      percentage: 58,
    },
    {
      id: "c6",
      name: "Health",
      icon: "fitness",
      color: "#FF9500",
      budget: 200,
      spent: 45.0,
      transactions: 2,
      percentage: 23,
    },
    {
      id: "c7",
      name: "Education",
      icon: "school",
      color: "#5AC8FA",
      budget: 100,
      spent: 35.0,
      transactions: 1,
      percentage: 35,
    },
  ])

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Total budget and spending
  const totalBudget = categories.reduce((sum, category) => sum + category.budget, 0)
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0)
  const totalPercentage = Math.round((totalSpent / totalBudget) * 100)

  // Icons for category selection
  const iconOptions = [
    { name: "fast-food", label: "Food" },
    { name: "car", label: "Transport" },
    { name: "cart", label: "Shopping" },
    { name: "flash", label: "Bills" },
    { name: "film", label: "Entertainment" },
    { name: "fitness", label: "Health" },
    { name: "school", label: "Education" },
    { name: "home", label: "Home" },
    { name: "gift", label: "Gifts" },
    { name: "briefcase", label: "Work" },
    { name: "paw", label: "Pets" },
    { name: "grid", label: "Other" },
  ]

  // Color options
  const colorOptions = [
    "#FF9500", // Orange
    "#FF2D55", // Pink
    "#5856D6", // Purple
    "#5AC8FA", // Blue
    "#4CD964", // Green
    "#FFCC00", // Yellow
    "#FF3B30", // Red
    "#AF52DE", // Lavender
    "#8E8E93", // Gray
  ]

  // Function to add a new category
  const handleAddCategory = () => {
    // Validate inputs
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    if (!newCategoryBudget.trim()) {
      Alert.alert("Error", "Please enter a budget amount");
      return;
    }

    // Parse budget as number
    const budgetAmount = parseFloat(newCategoryBudget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      Alert.alert("Error", "Please enter a valid budget amount");
      return;
    }

    // Create new category with a unique ID
    const newId = `c${Date.now()}`;
    const newCategory: CategoryType = {
      id: newId,
      name: newCategoryName,
      icon: newCategoryIcon,
      color: newCategoryColor,
      budget: budgetAmount,
      spent: 0,
      transactions: 0,
      percentage: 0,
    };

    // Update categories state with the new category
    setCategories(prevCategories => [...prevCategories, newCategory]);

    // Reset form
    setNewCategoryName("");
    setNewCategoryIcon("grid");
    setNewCategoryColor("#FF9500");
    setNewCategoryBudget("");

    // Close popover
    setIsAddPopoverOpen(false);

    // Show feedback
    Alert.alert("Success", `Category "${newCategoryName}" added successfully!`);
  };

  // Function to delete a category
  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setCategories(prevCategories => 
              prevCategories.filter(category => category.id !== categoryId)
            );
            setIsDetailsPopoverOpen(false);
          }
        }
      ]
    );
  };

  // Reset add category form
  const resetAddCategoryForm = () => {
    setNewCategoryName("");
    setNewCategoryIcon("grid");
    setNewCategoryColor("#FF9500");
    setNewCategoryBudget("");
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold">Categories</Text>
          <TouchableOpacity
            ref={addButtonRef}
            className="w-10 h-10 rounded-full bg-secondary items-center justify-center"
            onPress={() => {
              resetAddCategoryForm();
              setIsAddPopoverOpen(true);
            }}
          >
            <Ionicons name="add" size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
          </TouchableOpacity>
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
            placeholder="Search categories..."
            className="pl-10 bg-secondary border-0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Budget Overview Card */}
      <Card className="mx-4 mb-4 border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-muted-foreground">Total Spent</Text>
            <Text className="font-semibold">
              ₱{totalSpent.toFixed(2)} / ₱{totalBudget.toFixed(2)}
            </Text>
          </View>
          <Progress value={totalPercentage} className="h-2 mb-1" />
          <Text className="text-xs text-right text-muted-foreground">{totalPercentage}% of budget used</Text>
        </CardContent>
      </Card>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerClassName="pb-20">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.7}
              className="mb-3"
              ref={category.id === selectedCategory?.id ? detailsButtonRef : null}
              onPress={() => {
                setSelectedCategory(category);
                setIsDetailsPopoverOpen(true);
              }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <View className="flex-row items-center mb-3">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Ionicons
                        name={category.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={category.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium">{category.name}</Text>
                      <Text className="text-xs text-muted-foreground">{category.transactions} transactions</Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-semibold">₱{category.spent.toFixed(2)}</Text>
                      <Text className="text-xs text-muted-foreground">of ₱{category.budget.toFixed(2)}</Text>
                    </View>
                  </View>
                  <Progress value={category.percentage} className="h-1.5" />
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="search-outline" size={48} color={isDarkColorScheme ? "#666" : "#999"} />
            <Text className="text-muted-foreground mt-4 text-center">No categories found</Text>
            <Text className="text-muted-foreground text-center">Try a different search term</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Category Popover */}
      {isAddPopoverOpen && (
        <Popover>
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30" />
          <View className="bg-background rounded-t-3xl p-6" style={{ paddingBottom: Math.max(20, insets.bottom) }}>
            <View className="w-12 h-1 bg-border self-center rounded-full mb-6" />
            <Text className="text-xl font-bold mb-4">Add New Category</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1.5">Category Name</Text>
              <Input placeholder="Enter category name" value={newCategoryName} onChangeText={setNewCategoryName} />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1.5">Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
                {iconOptions.map((icon) => (
                  <TouchableOpacity
                    key={icon.name}
                    onPress={() => setNewCategoryIcon(icon.name)}
                    className={`items-center p-2 ${newCategoryIcon === icon.name ? "bg-primary/10 rounded-md" : ""}`}
                  >
                    <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center mb-1">
                      <Ionicons
                        name={icon.name as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={isDarkColorScheme ? "#fff" : "#000"}
                      />
                    </View>
                    <Text className="text-xs">{icon.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1.5">Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setNewCategoryColor(color)}
                    className={`p-1 ${newCategoryColor === color ? "bg-primary/10 rounded-full" : ""}`}
                  >
                    <View className="w-10 h-10 rounded-full" style={{ backgroundColor: color }} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1.5">Monthly Budget</Text>
              <View className="relative">
                <Text className="absolute left-3 top-3 text-lg font-bold">₱</Text>
                <Input
                  className="pl-8"
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={newCategoryBudget}
                  onChangeText={setNewCategoryBudget}
                />
              </View>
            </View>

            <View className="flex-row gap-2 mt-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onPress={() => {
                  resetAddCategoryForm();
                  setIsAddPopoverOpen(false);
                }}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                className="flex-1"
                onPress={handleAddCategory}
              >
                <Text className="text-primary-foreground">Save</Text>
              </Button>
            </View>
          </View>
        </Popover>
      )}

      {/* Category Details Popover */}
      {isDetailsPopoverOpen && selectedCategory && (
        <Popover>
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30" />
          <View className="bg-background rounded-t-3xl p-6" style={{ paddingBottom: Math.max(20, insets.bottom) }}>
            <View className="w-12 h-1 bg-border self-center rounded-full mb-6" />
            <ScrollView className="max-h-96">
              <View className="flex-row items-center mb-4">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${selectedCategory.color}20` }}
                >
                  <Ionicons
                    name={selectedCategory.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={selectedCategory.color}
                  />
                </View>
                <View>
                  <Text className="text-xl font-bold">{selectedCategory.name}</Text>
                  <Badge variant="outline" className="mt-1">
                    <Text className="text-xs">{selectedCategory.transactions} transactions</Text>
                  </Badge>
                </View>
              </View>

              <Card className="mb-4 border-0 bg-secondary/50">
                <CardContent className="p-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm text-muted-foreground">Budget</Text>
                    <Text className="font-semibold">
                      ₱{selectedCategory.spent.toFixed(2)} / ₱{selectedCategory.budget.toFixed(2)}
                    </Text>
                  </View>
                  <Progress value={selectedCategory.percentage} className="h-2 mb-1" />
                  <Text className="text-xs text-right text-muted-foreground">
                    {selectedCategory.percentage}% of budget used
                  </Text>
                </CardContent>
              </Card>

              <Text className="font-medium mb-3">Recent Transactions</Text>

              {/* Sample transactions for the selected category */}
              {[
                { name: "Grocery Store", amount: "-₱56.25", date: "Today, 2:30 PM" },
                { name: "Restaurant", amount: "-₱32.40", date: "Yesterday, 7:45 PM" },
                { name: "Coffee Shop", amount: "-₱4.50", date: "Today, 9:15 AM" },
              ].map((transaction, index) => (
                <View key={index} className="flex-row items-center justify-between py-3">
                  <View>
                    <Text className="font-medium">{transaction.name}</Text>
                    <Text className="text-xs text-muted-foreground">{transaction.date}</Text>
                  </View>
                  <Text className="font-semibold text-red-500">{transaction.amount}</Text>
                  {index < 2 && <Separator className="absolute bottom-0 left-0 right-0" />}
                </View>
              ))}

              <View className="flex-row gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => {
                    setIsDetailsPopoverOpen(false);
                    // Open edit popover could be implemented here
                  }}
                >
                  <Ionicons name="pencil-outline" size={18} className="mr-1" />
                  <Text>Edit</Text>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onPress={() => handleDeleteCategory(selectedCategory.id)}
                >
                  <Ionicons name="trash-outline" size={18} className="mr-1" />
                  <Text className="text-destructive-foreground">Delete</Text>
                </Button>
              </View>
            </ScrollView>
          </View>
        </Popover>
      )}

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={() => {
            resetAddCategoryForm();
            setIsAddPopoverOpen(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}