import { Suspense } from "react";
import { getCollections } from "@/actions/collections";
import { getBidsForCollection } from "@/actions/bids";
import CollectionList from "@/components/collections/CollectionList";
import UserSelect from "@/components/auth/UserSelect";

// Fetch data and pass it to CollectionList
async function CollectionListContainer() {
  const { collections, error: collectionsError } = await getCollections();

  if (collectionsError) {
    return <div className="text-red-500">{collectionsError}</div>;
  }

  if (!collections) {
    return <div>No collections found</div>;
  }

  // Fetch bids for each collection
  const bidsMap: Record<string, any[]> = {};

  for (const collection of collections) {
    const { bids } = await getBidsForCollection(collection.id);
    if (bids) {
      bidsMap[collection.id] = bids;
    }
  }

  return <CollectionList collections={collections} bids={bidsMap} />;
}

export default function Home() {
  return (
    <main>
      <div className="mb-6">
        <UserSelect />
      </div>

      <Suspense
        fallback={
          <div className="py-10 text-center">Loading collections...</div>
        }
      >
        <CollectionListContainer />
      </Suspense>
    </main>
  );
}
