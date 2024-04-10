const fuselages: Record<
  number,
  {
    cd: number;
    area: number;
    verticalY: number;
    horizontalY: number;
    propY: number;
  }
> = {
  2301: {
    cd: 0.353,
    area: 0.0153,
    verticalY: 0.084109,
    horizontalY: 0.077719,
    propY: 0.034504,
  },
  2302: {
    cd: 0.266,
    area: 0.0147,
    verticalY: 0.075217,
    horizontalY: 0.048875,
    propY: 0.011928,
  },
  2303: {
    cd: 0.116,
    area: 0.0184,
    verticalY: 0.082592,
    horizontalY: 0.058396,
    propY: 0.00558,
  },
  2304: {
    cd: 0.071,
    area: 0.0167,
    verticalY: 0.012647,
    horizontalY: 0,
    propY: 0,
  },
};

export default fuselages;
