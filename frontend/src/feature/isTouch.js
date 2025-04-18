/**
 * The function `isTouchDevice()` checks if the current device has touch capabilities by detecting
 * touch events support in the browser.
 * @returns The function `isTouchDevice()` is returning a boolean value indicating whether the device
 * has touch capabilities. It checks if the device supports touch events using various methods such as
 * checking for the presence of `ontouchstart` in the `window` object, `navigator.maxTouchPoints`, and
 * `navigator.msMaxTouchPoints`. If any of these conditions are true, the function returns `true`,
 * indicating that
 */
export default function isTouchDevice() {
    return (
      'ontouchstart' in window || // works on most browsers
      navigator.maxTouchPoints > 0 || // works on IE10/11 and Surface
      navigator.msMaxTouchPoints > 0 // works on IE10/11
    );
  }
