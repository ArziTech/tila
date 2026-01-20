"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { addCategory, getCategories } from "@/actions/categories";
import type { Category } from "@/generated/prisma/client";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  color: z.string(),
});

interface CategoryWithCount extends Category {
  _count: {
    items: number;
  };
}

export default function CategoryManager() {
  const queryClient = useQueryClient();

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories: CategoryWithCount[] = categoriesResponse?.data || [];

  const mutation = useMutation({
    mutationFn: addCategory,
    onSuccess: (response) => {
      if (response.status === "SUCCESS" && response.data) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success(`Category "${response.data.name}" added successfully!`);
      } else {
        toast.error(response.error || "Failed to add category.");
      }
    },
    onError: (error) => {
      toast.error("Failed to add category.");
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#FFB3E6",
    },
  });

  const colors = [
    "#FFB3E6",
    "#FFD4A3",
    "#A3F0FF",
    "#D4A3FF",
    "#A3FFC4",
    "#FFE5A3",
    "#E5A3FF",
    "#A3E5FF",
    "#FFA3A3",
    "#A3FFA3",
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
    form.reset();
  }

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Manage Categories
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Machine Learning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => (
                        <Button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={`w-10 h-10 rounded-lg border-2 transition ${
                            field.value === color
                              ? "border-foreground"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Category
            </Button>
          </form>
        </Form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p className="text-lg font-semibold mb-2">No categories yet!</p>
            <p>Start by adding your first learning category.</p>
          </div>
        ) : (
          categories.map((category) => {
            const itemCount = category._count.items;
            return (
              <div
                key={category.id}
                className="bg-card rounded-xl border border-border p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-semibold text-foreground">
                    {category.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "learning" : "learnings"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
