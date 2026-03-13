import { PaginationItem } from "@/types/table-types";

export function buildPaginationRange(
    currentPage: number,
    totalPages: number,
    chunkSize = 5
  ): PaginationItem[] {
    const chunkIndex = Math.floor((currentPage - 1) / chunkSize);
    const startPage = chunkIndex * chunkSize + 1;
    const endPage = Math.min(startPage + chunkSize - 1, totalPages);
  
    const pages: PaginationItem[] = [];
  
    if (startPage > 1) {
      pages.push(1);
  
      if (startPage > 2) {
        pages.push("...");
      }
    }
  
    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }
  
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
  
      pages.push(totalPages);
    }
  
    return pages;
  }