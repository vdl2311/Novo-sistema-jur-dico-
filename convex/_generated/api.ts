const apiHandler = {
  get(target: any, prop: string): any {
    return new Proxy({}, {
      get(subTarget, subProp: string) {
        return `${prop}:${subProp}`;
      }
    });
  }
};

export const api = new Proxy({}, apiHandler) as any;
