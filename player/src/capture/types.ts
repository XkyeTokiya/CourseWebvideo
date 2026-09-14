export interface CaptureCursor {
  chapter: number;
  step: number;
}

export interface CaptureWindow {
  start: CaptureCursor;
  end: CaptureCursor;
}
