import { ComponentFixture } from '@angular/core/testing';

/** Drives a rendered auth page the way a user does: fields are found by their visible label. */
export function authPage(fixture: ComponentFixture<unknown>) {
  const el = fixture.nativeElement as HTMLElement;
  const input = (label: string) => {
    const match = [...el.querySelectorAll('label')].find((l) =>
      l.textContent?.trim().startsWith(label),
    )!;
    return el.querySelector<HTMLInputElement>(`#${match.htmlFor}`)!;
  };

  return {
    input,
    type(label: string, value: string) {
      input(label).value = value;
      input(label).dispatchEvent(new Event('input'));
    },
    async submit() {
      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    },
    /** Waits for an answered request's promise chain and the render that follows it. */
    async settle() {
      await new Promise((resolve) => setTimeout(resolve));
      await fixture.whenStable();
    },
    errorOf: (label: string) =>
      el
        .querySelector(`#${input(label).id}-error`)
        ?.textContent?.replace('!', '')
        .trim(),
    alert: () => el.querySelector('app-inline-alert'),
    button: () => el.querySelector('button')!,
  };
}
