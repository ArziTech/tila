"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, Folder, Hash, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateItem } from "@/actions/items";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Item } from "@/generated/prisma/client";
import Tiptap from "./editor";

interface NoteDetailProps {
  note: Item;
  categories: Category[];
}

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  categoryId: z.string().min(1, "Category is required"),
  duration_minutes: z.number().min(0),
  date_added: z.date(),
  tags: z.array(z.string()),
  topic: z.string(),
  difficulty: z.string(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

const NoteDetails = ({ note, categories }: NoteDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      ...note,
      tags: note.tags || [],
    },
  });

  useEffect(() => {
    form.reset({
      ...note,
      tags: note.tags || [],
    });
  }, [note, form]);

  const updateMutation = useMutation({
    mutationFn: (data: NoteFormValues) => updateItem(note.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", note.id] });
      toast.success("Note updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update note.");
    },
  });

  const onSubmit = (data: NoteFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-h-screen bg-white text-slate-800 flex flex-col animate-in slide-in-from-right duration-300"
      >
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/items")}
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-800"
              title="Back to Notes"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <div className="text-sm text-gray-500 hidden sm:flex items-center gap-2">
              <span className="opacity-60">Notes</span>
              <span>/</span>
              <span className="font-medium text-gray-800 truncate max-w-50">
                {form.watch("title") || "Untitled"}
              </span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || updateMutation.isPending}
          >
            Save
          </Button>
        </header>

        <main className="flex-1 mx-auto w-full p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Note Title"
                      className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent leading-tight"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="prose prose-lg prose-slate max-w-none w-full">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Tiptap description={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-6">
              <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layout size={14} /> Properties
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 items-center gap-4">
                        <FormLabel className="text-sm text-gray-500 flex items-center gap-2">
                          <Folder size={16} /> Category
                        </FormLabel>
                        <div className="col-span-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 items-center gap-4">
                        <FormLabel className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock size={16} /> Duration
                        </FormLabel>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                className="w-20 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value, 10))
                                }
                              />
                            </FormControl>
                            <span className="text-sm text-gray-400">min</span>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_added"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 items-center gap-4">
                        <FormLabel className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar size={16} /> Created
                        </FormLabel>
                        <div className="col-span-2">
                          <Input
                            type="date"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none"
                            value={
                              new Date(field.value).toISOString().split("T")[0]
                            }
                            onChange={(e) =>
                              field.onChange(new Date(e.target.value))
                            }
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Hash size={14} /> Tags
                    </h3>
                    <div>
                      <FormControl>
                        <Input
                          placeholder="react, design, study"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-100 outline-none mb-2"
                          value={field.value.join(", ")}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.split(",").map((t) => t.trim()),
                            )
                          }
                        />
                      </FormControl>
                      <p className="text-xs text-gray-400">Comma separated</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </main>
      </form>
    </Form>
  );
};

export default NoteDetails;
