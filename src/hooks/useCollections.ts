"use client";

import { useState, useEffect } from "react";
import { Collection, User, Bid } from "@/types/prisma";
import { getCollections } from "@/actions/collections";
import { getBidsForCollection } from "@/actions/bids";

type CollectionWithOwner = Collection & { owner: User };
type BidWithUser = Bid & { user: User };

export function useCollections() {
  const [collections, setCollections] = useState<CollectionWithOwner[]>([]);
  const [bidsMap, setBidsMap] = useState<Record<string, BidWithUser[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch collections
        const collectionsResult = await getCollections();

        if (collectionsResult.error) {
          setError(collectionsResult.error);
          return;
        }

        if (!collectionsResult.collections) {
          setCollections([]);
          return;
        }

        setCollections(collectionsResult.collections);

        // Fetch bids for each collection
        const bidsData: Record<string, BidWithUser[]> = {};

        await Promise.all(
          collectionsResult?.collections?.map(
            async (collection: Collection) => {
              const bidsResult = await getBidsForCollection(collection.id);
              if (bidsResult.bids) {
                bidsData[collection.id] = bidsResult.bids;
              }
            }
          )
        );

        setBidsMap(bidsData);
      } catch (err) {
        setError("Failed to load collections and bids");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { collections, bidsMap, loading, error };
}
