"use client";

import { useState } from "react";
import { Bid, User } from "@/types/prisma";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { createBid, updateBid } from "@/actions/bids";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";

interface BidFormProps {
  collectionId: string;
  existingBid?: Bid & { user: User };
  isOpen: boolean;
  onClose: () => void;
}

export default function BidForm({
  collectionId,
  existingBid,
  isOpen,
  onClose,
}: BidFormProps) {
  const { user } = useAuthStore();

  const [price, setPrice] = useState(existingBid?.price.toString() || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      setError("You must be logged in to place a bid");
      setIsSubmitting(false);
      return;
    }

    try {
      if (existingBid) {
        await updateBid(existingBid.id, {
          price: parseFloat(price),
        });
      } else {
        await createBid({
          price: parseFloat(price),
          collectionId,
          userId: user.id,
        });
      }
      onClose();
    } catch (err) {
      setError("Failed to save bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existingBid ? "Edit Bid" : "Place Bid"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium mb-1 text-white"
              htmlFor="price"
            >
              Bid Amount ($)
            </label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="text-white"
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
              {isSubmitting
                ? "Saving..."
                : existingBid
                ? "Update Bid"
                : "Place Bid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
