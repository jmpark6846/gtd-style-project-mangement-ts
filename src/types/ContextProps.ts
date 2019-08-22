export interface ContextProps {
  dispatch(props: { type: string; payload: any }): void
}
