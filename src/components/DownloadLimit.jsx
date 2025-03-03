import React from "react";

const formatDownloadLimit = (limit) => {
  if (!limit) return "0 GB"; // Handle undefined or null values
  return limit >= 1 ? `${limit.toFixed(2)} GB` : `${limit.toFixed(3)} GB`;
};

export default function DownloadLimit({ limit }) {
  return <span>{formatDownloadLimit(limit)}</span>;
}
