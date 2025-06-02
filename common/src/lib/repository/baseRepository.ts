// probably add T extends BaseModel
export interface BaseRepository<T> {
     getAll(): Promise<T[]>;
     getById(id: string): Promise<T | null>;
     create(data: T): Promise<string>;
     update(id: string, data: Partial<T>): Promise<void>;
     delete(id: string): Promise<void>;
}