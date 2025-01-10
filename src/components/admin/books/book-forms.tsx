'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/shared/file-upload";
import { Editor } from "@/components/shared/editor";
// import { cn } from "@/lib/utils";
// import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
}
    from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  coverImage: z.string().optional(),
  bookFile: z.string().optional(),
  amazonLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isPremium: z.boolean().optional().default(false),
  isFree: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface BookFormProps {
  book?: Book;
  categories: Category[];
}


export function BookForm({ book, categories, onSuccess, }: BookFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: book?.title || "",
            description: book?.description || "",
            categoryId: book?.categoryId || "",
            coverImage: book?.coverImage || "",
            bookFile: book?.bookFile || "",
            amazonLink: book?.amazonLink || "",
            price: book?.price || 0,
            isPublished: book?.isPublished || false,
            isFeatured: book?.isFeatured || false,
            isPremium: book?.isPremium || false,
            isFree: book?.isFree || false,
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/books${book ? `/${book.id}` : ""}`, {
                method: book ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            const data = await response.json();
        
            toast.success(book ? "Book updated successfully" : "Book created successfully");
            router.push("/admin/books");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen y-overflow-auto">
            <Card className="mb-10">
                <CardHeader>
                    <CardTitle>
                        {book ? "Edit Book Post" : "Create Book Post"}
                    </CardTitle>
                    <CardDescription>
                        {book
                        ? "Update your book post details"
                        : "Write a new book post"}
                    </CardDescription>
                </CardHeader>
            </Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter book title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Editor {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
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
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="amazonLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amazon Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Amazon product URL" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Optional: Link to the book on Amazon
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-1">
                        <FormField
                            control={form.control}
                            name="coverImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cover Image</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            category="image"
                                            maxSize={15}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload a cover image for your book
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bookFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book File</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            category="pdf"
                                            value={field.value}
                                            onChange={field.onChange}
                                            accept={{ 'application/pdf': ['.pdf'] }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload the book file (PDF format)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Published</FormLabel>
                                        <FormDescription>
                                            Make this book visible on your store
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Featured</FormLabel>
                                        <FormDescription>
                                            Show this book in featured sections
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPremium"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Premium</FormLabel>
                                        <FormDescription>
                                            Mark this as a premium book
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Free</FormLabel>
                                        <FormDescription>
                                            Make this book available for free
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/books")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : book ? "Save Changes" : "Create"}
                        </Button>
                    
                    </div>
                </form>
            </Form>
        </div>  
    )
}
