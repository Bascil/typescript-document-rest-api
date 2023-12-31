import { Database } from "sqlite3";

export async function getTotalItems(
  db: Database,
  countQuery: string,
  params: any[]
): Promise<number> {
  const result = await new Promise<{ count: number }>((resolve, reject) => {
    db.get(countQuery, params, (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  return result ? result.count : 0;
}
