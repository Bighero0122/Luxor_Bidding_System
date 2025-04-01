"use client";

import { useState } from "react";
import { Collection, User, Bid } from "@/types/prisma";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import BidList from "@/components/bids/BidList";
import CollectionForm from "@/components/collections/CollectionForm";
import BidForm from "@/components/bids/BidForm";
import { deleteCollection } from "@/actions/collections";
import { Trash2, Edit, ChevronDown, ChevronUp, Plus } from "lucide-react";

interface CollectionItemProps {
  collection: Collection & { owner: User };
  bids: (Bid & { user: User })[];
}

export default function CollectionItem({
  collection,
  bids,
}: CollectionItemProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === collection.ownerId;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [isAddingBid, setIsAddingBid] = useState(false);

  const handleDeleteCollection = async () => {
    if (confirm("Are you sure you want to delete this collection?")) {
      await deleteCollection(collection.id);
    }
  };

  const userBid = user ? bids.find((bid) => bid.userId === user.id) : null;

  return (
    <div className="border rounded-lg p-4 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex-1 flex items-center gap-2"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
          <div>
            <h3 className="text-lg font-bold">{collection.name}</h3>
            <p className="text-sm text-gray-500">
              Owner: {collection.owner.name}
            </p>
            <div className="flex gap-4 mt-2">
              <p>Price: ${collection.price.toFixed(2)}</p>
              <p>Stock: {collection.stocks}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {isOwner ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingCollection(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteCollection}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          ) : (
            <>
              {userBid ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingBid(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Bid
                </Button>
              ) : (
                <Button size="sm" onClick={() => setIsAddingBid(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Bid
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <p className="mb-4">{collection.description}</p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Bids</h4>
            <BidList
              bids={bids}
              collectionId={collection.id}
              isOwner={isOwner}
              currentUserId={user?.id}
            />
          </div>
        </div>
      )}

      {isEditingCollection && (
        <CollectionForm
          collection={collection}
          isOpen={isEditingCollection}
          onClose={() => setIsEditingCollection(false)}
        />
      )}

      {isAddingBid && (
        <BidForm
          collectionId={collection.id}
          existingBid={userBid || undefined}
          isOpen={isAddingBid}
          onClose={() => setIsAddingBid(false)}
        />
      )}
    </div>
  );
}
