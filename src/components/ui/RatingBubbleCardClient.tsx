"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Plus, X } from "lucide-react";

interface Category {
  name: string;
  badges: { rating: number; badges: string[] }[];
}

interface RatingBubbleCardClientProps {
  businessName: string;
  categories: any;
  setCategories: any;
  handleSettingChange: any;
}

export default function RatingBubbleCardClient({
  businessName,
  categories,
  setCategories,
  handleSettingChange,
}: RatingBubbleCardClientProps) {
  console.log("categoriesss", categories);
  const [categoryRatings, setCategoryRatings] = useState<{
    [key: string]: number;
  }>(
    Object.fromEntries(
      (categories || []).map((category: Category) => [category.name, 0])
    )
  );
  const [selectedBadges, setSelectedBadges] = useState<{
    [key: string]: string[];
  }>({});
  const [newCategory, setNewCategory] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [newBadgeRating, setNewBadgeRating] = useState(1);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleCategoryRating = (categoryName: string, newRating: number) => {
    setCategoryRatings((prev) => ({ ...prev, [categoryName]: newRating }));
    setSelectedBadges((prevBadges) => ({
      ...prevBadges,
      [categoryName]: [],
    }));
  };

  const toggleBadge = (categoryName: string, badge: string) => {
    setSelectedBadges((prev) => {
      const categoryBadges = prev[categoryName] || [];
      return {
        ...prev,
        [categoryName]: categoryBadges.includes(badge)
          ? categoryBadges.filter((b) => b !== badge)
          : [...categoryBadges, badge],
      };
    });
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories((prev: Category[]) => {
        const updatedCategories = [...prev, { name: newCategory, badges: [] }];

        // Call handleSettingChange with the updated categories
        handleSettingChange("categories", updatedCategories);

        // Return the updated categories to update the state
        return updatedCategories;
      });

      setCategoryRatings((prev) => ({ ...prev, [newCategory]: 0 }));
      setNewCategory("");
    }
  };

  const addBadgeToCategory = (categoryName: string) => {
    console.log(categoryName);
    if (newBadge.trim()) {
      console.log("in hereeee", newBadge);

      // Update the categories state
      setCategories((prev: Category[]) => {
        const updatedCategories = prev.map((category) =>
          category["name"] === categoryName
            ? {
                ...category,
                badges: category["badges"].map((badge) =>
                  badge["rating"] === newBadgeRating
                    ? {
                        ...badge,
                        badges: [...badge["badges"], newBadge],
                      }
                    : badge
                ),
              }
            : category
        );

        // Call handleSettingChange with the updated categories
        handleSettingChange("categories", updatedCategories);

        // Return the updated categories to update the state
        return updatedCategories;
      });

      // Clear the new badge input
      setNewBadge("");
    }
  };

  const removeCategory = (categoryName: string) => {
    setCategories((prev: Category[]) => {
      const updatedCategories = prev.filter(
        (category) => category.name !== categoryName
      );

      // Call handleSettingChange with the updated categories
      handleSettingChange("categories", updatedCategories);

      // Return the updated categories to update the state
      return updatedCategories;
    });

    setCategoryRatings((prev) => {
      const { [categoryName]: _, ...rest } = prev;
      return rest;
    });

    setSelectedBadges((prev) => {
      const { [categoryName]: _, ...rest } = prev;
      return rest;
    });
  };

  const removeBadge = (categoryName: string, rating: number, badge: string) => {
    setCategories((prev: Category[]) => {
      const updatedCategories = prev.map((category) =>
        category.name === categoryName
          ? {
              ...category,
              badges: category.badges.map((b) =>
                b.rating === rating
                  ? {
                      ...b,
                      badges: b.badges.filter(
                        (badgeName) => badgeName !== badge
                      ),
                    }
                  : b
              ),
            }
          : category
      );

      // Call handleSettingChange with the updated categories
      handleSettingChange("categories", updatedCategories);

      // Return the updated categories to update the state
      return updatedCategories;
    });
  };

  return (
    <Card className="w-full max-w-3xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-1 text-sm">
          {businessName}
        </CardTitle>
        <CardDescription className="flex items-center justify-center space-x-1 mb-2">
          {"How did we do? 🤔"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.map((category: Category) => (
          <div key={category.name} className="mb-6">
            <div className="flex items-center mb-2 justify-between">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 cursor-pointer ${
                        i < categoryRatings[category.name]
                          ? "text-primary fill-primary"
                          : "text-muted stroke-muted-foreground"
                      }`}
                      onClick={() => handleCategoryRating(category.name, i + 1)}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCategory(category.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {category.badges
                .find((b) => b.rating === categoryRatings[category.name])
                ?.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant={
                      selectedBadges[category.name]?.includes(badge)
                        ? "default"
                        : "outline"
                    }
                    className={`cursor-pointer transition-colors ${
                      selectedBadges[category.name]?.includes(badge)
                        ? categoryRatings[category.name] < 4
                          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }`}
                    onClick={() => toggleBadge(category.name, badge)}
                  >
                    {badge}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBadge(
                          category.name,
                          categoryRatings[category.name],
                          badge
                        );
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
            </div>
            {editingCategory === category.name && (
              <div className="flex items-center justify-between mt-2">
                <Input
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="New badge"
                  className="w-128"
                />

                <div className="flex items-center space-x-2 ml-auto">
                  <Label>Rating:</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={newBadgeRating}
                    onChange={(e) => setNewBadgeRating(Number(e.target.value))}
                    className="w-16"
                  />
                  <Button
                    onClick={() => addBadgeToCategory(category.name)}
                    variant="outline"
                  >
                    Add Badge
                  </Button>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setEditingCategory(
                  editingCategory === category.name ? null : category.name
                )
              }
              className="mt-2"
            >
              {editingCategory === category.name ? "Done" : "Edit Badges"}
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="flex-grow"
          />
          <Button onClick={addCategory} variant="outline">
            Add Category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
