import { debounce } from "../commonUtils";

jest.useFakeTimers();

describe("debounce", () => {
  test("executes the function after the specified wait time", () => {
    const mockFunc = jest.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();

    expect(mockFunc).not.toHaveBeenCalled();

    jest.advanceTimersByTime(99);
    expect(mockFunc).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  test("only executes once for multiple calls within the wait time", () => {
    const mockFunc = jest.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();
    jest.advanceTimersByTime(50);
    debouncedFunc();
    jest.advanceTimersByTime(50);
    debouncedFunc();

    expect(mockFunc).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  test("passes arguments correctly", () => {
    const mockFunc = jest.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc("arg1", 123);
    jest.advanceTimersByTime(100);

    expect(mockFunc).toHaveBeenCalledWith("arg1", 123);
  });

  test("can be cancelled", () => {
    const mockFunc = jest.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();
    debouncedFunc.cancel();
    jest.advanceTimersByTime(100);

    expect(mockFunc).not.toHaveBeenCalled();
  });
});
