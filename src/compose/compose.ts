export function compose(...args: any[]): any {
  return args.reduce((res: any, curr: any): any => (...funArgs: any[]) =>
    res(curr(...funArgs))
  );
}
