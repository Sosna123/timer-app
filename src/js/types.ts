type Time = {
    id: number;
    str: string;
    num: number;
    added2: boolean;
    addedDnf: boolean;
    scramble: string;
    date: number;
};
type Average = {
    str: string;
    num: number;
};

type Stats = [number, string, string, string];

type ScrambleType = "333" | "222" | "444" | "555" | "666" | "777" | "clock" | "minx" | "pyram" | "skweb" | "sq1";

export { type Time, Average, Stats, ScrambleType };
