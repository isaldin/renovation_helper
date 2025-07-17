export interface Shutdownable {
  close(): Promise<void>;
}