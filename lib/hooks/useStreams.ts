import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Awardee } from "@/lib/store";
import { useStreamsStore } from "@/lib/store";
import { useEffect } from "react";

interface Stream {
  awardee: string;
  status: "Active" | "Paused";
  amountPerSec: string;
  name: string;
  amountReceived: string;
  startTimestamp: string;
  lastWithdrawTimestamp: string;
  transactions: {
    items: {
      hash: string;
    }[];
  };
}

interface StreamsResponse {
  data: {
    streams: {
      items: Stream[];
    };
  };
}

const STREAMS_QUERY = `
  query GetStreams($payer: String!) {
    streams(where:{
      payer: $payer
    }){
      items{
      transactions{
        items{
          hash
        }
      }
      awardee
      status
      amountPerSec
      amountReceived
      startTimestamp
      lastWithdrawTimestamp
    }
    }
  }
`;

export function useStreams() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { getStreams, addStream, updateStream } = useStreamsStore();
  const query = useQuery<StreamsResponse>({
    queryKey: ["streams", address],
    queryFn: async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_URL || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: STREAMS_QUERY,
          variables: {
            payer: address,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch streams");
      }

      return response.json();
    },
    enabled: !!address,
  });

  // Handle store updates in a separate effect
  useEffect(() => {
    if (query.data?.data?.streams?.items && address) {
      query.data.data.streams.items.forEach((stream: Stream) => {
        const existingStream = getStreams(address).find(
          (s) => s.awardee === stream.awardee
        ) as Stream | undefined;
        if (existingStream) {
          updateStream(address, stream.awardee, {
            status: stream.status,
            amountPerSec: stream.amountPerSec,
            amountReceived: stream.amountReceived,
            startTimestamp: stream.startTimestamp,
            lastWithdrawTimestamp: parseInt(stream.lastWithdrawTimestamp),
          });
        } else {
          addStream(address, {
            ...stream,
            name: "Unknown Awardee",
          });
        }
      });
    }
  }, [query.data, address, getStreams, updateStream, addStream]);

  // Helper function to optimistically add a new awardee
  const addAwardeeOptimistically = (newAwardee: Awardee) => {
    if (!address) return;

    const stream: Stream = {
      awardee: newAwardee.wallet,
      status: newAwardee.status,
      amountPerSec: newAwardee.amountPerSec,
      name: newAwardee.name,
      amountReceived: "0",
      startTimestamp: "",
      lastWithdrawTimestamp: "",
      transactions: {
        items: [],
      },
    };

    addStream(address, stream);

    queryClient.setQueryData<StreamsResponse>(
      ["streams", address],
      (oldData) => {
        if (!oldData)
          return {
            data: {
              streams: {
                items: [stream],
              },
            },
          };

        return {
          data: {
            streams: {
              items: [...oldData.data.streams.items, stream],
            },
          },
        };
      }
    );
  };

  return {
    ...query,
    addAwardeeOptimistically,
  };
}
