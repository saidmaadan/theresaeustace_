'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
import { cn } from "@/lib/utils";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

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

const steps = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Enter the basic details of your book'
  },
  {
    id: 'media',
    title: 'Media Files',
    description: 'Upload book cover and files'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure book settings and visibility'
  }
];

export function BookForm({ book, categories }: BookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
        throw new Error("Something went wrong");
      }

      toast.success(book ? "Book updated successfully" : "Book created successfully");
      router.push("/admin/books");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Get the fields for the current step
    const fieldsToValidate = {
      0: ["title", "description", "categoryId", "price", "amazonLink"],
      1: ["coverImage", "bookFile"],
      2: ["isPublished", "isFeatured", "isPremium", "isFree"],
    }[currentStep];

    // Validate only the fields in the current step
    const result = await form.trigger(fieldsToValidate);
    
    if (!result) {
      toast.error("Please fill in all required fields for this step");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
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
        );
      case 1:
        return (
          <div className="space-y-4">
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
        );
      case 2:
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {book ? "Edit Book" : steps[currentStep].title}
        </h1>
        <p className="text-muted-foreground">
          {steps[currentStep].description}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step Progress */}
          <div className="relative mb-6">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
                    currentStep === index
                      ? "border-primary text-primary"
                      : index < currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent(currentStep)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/books")}
              >
                Cancel
              </Button>
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            <div>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {book ? "Save Changes" : "Create Book"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
}
