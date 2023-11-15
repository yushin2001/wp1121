import { useEffect, useMemo, useState } from "react";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import { useDebounce } from "use-debounce";

import { pusherClient } from "@/lib/pusher/client";
import type { Document, User } from "@/lib/types/db";

type PusherPayload = {
  senderId: User["id"];
  document: Document;
};

export const useDocument = () => {
  const { docId } = useParams();
  const documentId = Array.isArray(docId) ? docId[0] : docId;

  const [document, setDocument] = useState<Document | null>(null);
  const [dbDocument, setDbDocument] = useState<Document | null>(null);
  const [debouncedDocument] = useDebounce(document, 300);
  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const isSynced = useMemo(() => {
    if (document === null || dbDocument === null) return true;
    return (
      document.title === dbDocument.title &&
      document.content === dbDocument.content
    );
  }, [document, dbDocument]);

  // When the debounced document changes, update the document
  useEffect(() => {
    if (debouncedDocument === null) return;
    if (isSynced) return;

    const updateDocument = async () => {
      if (!debouncedDocument) return;
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: debouncedDocument.title,
          content: debouncedDocument.content,
        }),
      });
      if (!res.ok) {
        return;
      }
      const data: Document = await res.json();
      // Update the navbar if the title changed
      if (dbDocument?.title !== data.title) {
        router.refresh();
      }
      setDbDocument(data);
    };
    updateDocument();
  }, [debouncedDocument, documentId, router, dbDocument, isSynced]);

  // Subscribe to pusher events
  useEffect(() => {
    if (!documentId) return;
    // Private channels are in the format: private-...
    const channelName = `private-${documentId}`;
    try {
      const channel = pusherClient.subscribe(channelName);
      channel.bind("doc:update", ({ senderId, document }: PusherPayload) => {
        if (senderId === userId) {
          return;
        }
        setDocument(document);
        setDbDocument(document);
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      router.push("/docs");
    }

    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [documentId, router, userId]);

  useEffect(() => {
    if (!documentId) return;
    const fetchDocument = async () => {
      const res = await fetch(`/api/documents/${documentId}`);
      if (!res.ok) {
        setDocument(null);
        router.push("/docs");
        return;
      }
      const data = await res.json();
      setDocument(data);
      setDbDocument(data);
    };
    fetchDocument();
  }, [documentId, router]);

  const title = document?.title || "";
  const setTitle = (newTitle: string) => {
    if (document === null) return;
    setDocument({
      ...document,
      title: newTitle,
    });
  };

  const content = document?.content || "";
  const setContent = (newContent: string) => {
    if (document === null) return;
    setDocument({
      ...document,
      content: newContent,
    });
  };

  return {
    documentId,
    document,
    title,
    setTitle,
    content,
    setContent,
  };
};
