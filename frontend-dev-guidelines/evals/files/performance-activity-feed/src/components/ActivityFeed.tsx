import { useEffect, useState } from "react";

type Activity = { id: string; label: string };

export function ActivityFeed() {
  const [items, setItems] = useState<Activity[]>([]);
  const [visibleItems, setVisibleItems] = useState<Activity[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  useEffect(() => {
    fetch("/api/activities/metadata")
      .then((response) => response.json())
      .then(() => undefined);
  }, [items]);

  useEffect(() => {
    setVisibleItems(items.filter((item) => selectedIds.length === 0 || selectedIds.includes(item.id)));
  }, [items, selectedIds]);

  return (
    <ul>
      {visibleItems.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}
