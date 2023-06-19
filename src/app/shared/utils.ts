import { HttpErrorResponse } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export function isHttpError(error: {}): boolean {
  return (error as HttpErrorResponse)?.status !== undefined;
}

export function devLog(...values: any[]): void {
  if (isDevMode()) {
    console.log(...values);
  }
}
