export interface WebhookJsonBody {
  id?: number;
  name?: string;
  state?: 'pending' | 'failure' | 'error' | 'success';
  branches?: Array<{ name: string }>;
}

export function isBodyValid(body: WebhookJsonBody): boolean {
  return (
    body.id !== undefined &&
    body.name !== undefined &&
    body.state !== undefined &&
    body.branches !== undefined
  );
}
