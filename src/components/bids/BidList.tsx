"use client";

import { Bid, User } from "@/types/prisma";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import { acceptBid, deleteBid } from "@/actions/bids";

interface BidListProps {
  bids: (Bid & { user: User })[];
  collectionId: string;
  isOwner: boolean;
  currentUserId?: string;
}

export default function BidList({
  bids,
  collectionId,
  isOwner,
  currentUserId,
}: BidListProps) {
  const handleAcceptBid = async (bidId: string) => {
    if (
      confirm(
        "Are you sure you want to accept this bid? All other bids will be rejected."
      )
    ) {
      await acceptBid(collectionId, bidId);
    }
  };

  const handleDeleteBid = async (bidId: string) => {
    if (confirm("Are you sure you want to delete this bid?")) {
      await deleteBid(bidId);
    }
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Bidder
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bids.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No bids yet
              </td>
            </tr>
          ) : (
            bids.map((bid) => (
              <tr key={bid.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {bid.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ${bid.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      bid.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : bid.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {bid.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {isOwner && bid.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcceptBid(bid.id)}
                      className="mr-2"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  )}

                  {currentUserId === bid.userId && bid.status === "PENDING" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBid(bid.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
