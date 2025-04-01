"use client";

import { useState } from "react";
import { Collection, User, Bid } from "@/types/prisma";
import { Button } from "@/components/ui/Button";
import CollectionItem from "./CollectionItem";
import CollectionForm from "./CollectionForm";
import { useAuthStore } from "@/store/authStore";
import { Plus } from "lucide-react";

interface CollectionListProps {
  collections: (Collection & { owner: User })[];
  bids: Record<string, (Bid & { user: User })[]>;
}

export default function CollectionList({
  collections,
  bids,
}: CollectionListProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Collections</h2>
        {isAuthenticated && (
          <Button onClick={() => setIsCreatingCollection(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        )}
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No collections available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              bids={bids[collection.id] || []}
            />
          ))}
        </div>
      )}

      <CollectionForm
        isOpen={isCreatingCollection}
        onClose={() => setIsCreatingCollection(false)}
      />
    </div>
  );
}
