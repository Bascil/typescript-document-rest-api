import { Database } from "sqlite3";
import { getTotalItems } from "./pagination";

interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export class Paginator {
  static calculateOffset(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  static async calculateTotalItems(
    db: Database,
    countQuery: string,
    params: any[]
  ): Promise<number> {
    return getTotalItems(db, countQuery, params);
  }

  static calculateTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize);
  }

  static createPaginationMetadata(
    page: number,
    pageSize: number,
    totalItems: number
  ): PaginationMetadata {
    const totalPages = Paginator.calculateTotalPages(totalItems, pageSize);

    return {
      page,
      pageSize,
      totalPages,
      totalItems,
    };
  }
}
