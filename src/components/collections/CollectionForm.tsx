"use client";

import { useState } from "react";
import { Collection } from "@/types/prisma";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { createCollection, updateCollection } from "@/actions/collections";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";

interface CollectionFormProps {
  collection?: Collection;
  isOpen: boolean;
  onClose: () => void;
}

export default function CollectionForm({
  collection,
  isOpen,
  onClose,
}: CollectionFormProps) {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
    stocks: collection?.stocks.toString() || "1",
    price: collection?.price.toString() || "0",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      setError("You must be logged in to create or edit a collection");
      setIsSubmitting(false);
      return;
    }

    try {
      if (collection) {
        await updateCollection(collection.id, {
          name: formData.name,
          description: formData.description,
          stocks: parseInt(formData.stocks),
          price: parseFloat(formData.price),
        });
      } else {
        await createCollection({
          name: formData.name,
          description: formData.description,
          stocks: parseInt(formData.stocks),
          price: parseFloat(formData.price),
          ownerId: user.id,
        });
      }
      onClose();
    } catch (err) {
      setError("Failed to save collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {collection ? "Edit Collection" : "Create Collection"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1 text-white"
                htmlFor="name"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1 text-white"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2 text-white"
                rows={3}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1 text-white"
                htmlFor="stocks"
              >
                Stock Quantity
              </label>
              <Input
                id="stocks"
                type="number"
                name="stocks"
                value={formData.stocks}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1 text-white"
                htmlFor="price"
              >
                Price ($)
              </label>
              <Input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              className="text-white"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
