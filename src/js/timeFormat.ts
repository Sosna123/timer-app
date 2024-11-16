function formatNormal(
    time: string,
    mode: "msIntoTime" | "addDots" = "msIntoTime"
): string {
    let result: string;
    if (parseInt(time) <= 0) {
        return "";
    }
    if (mode == "msIntoTime") {
        //* Actual time formatting
        let timeNum: number = Number(time);

        let minutes: number = Math.trunc(timeNum / 6000);
        let seconds: number = Math.trunc((timeNum - minutes * 6000) / 100);
        let centiseconds: number = Math.trunc(
            timeNum - (minutes * 6000 + seconds * 100)
        );

        //* conversion from number to string
        let secondsStr: string = seconds.toString();
        let centisecondsStr: string = centiseconds.toString();

        //* adding 0 in front of 1 digit numbers
        if (secondsStr.length == 1 && minutes) {
            secondsStr = "0" + secondsStr;
        }
        if (centisecondsStr.length == 1) {
            centisecondsStr = "0" + centisecondsStr;
        }

        //* returning correct-looking result
        result = minutes
            ? `${minutes}:${secondsStr}.${centisecondsStr}`
            : `${secondsStr}.${centisecondsStr}`;

        return result;
    } else {
        //* centisec = przedostatni + ostatni
        //* sec = przedostatni + ostatni
        //* min = reszta
        //* result = min + ":" + sec + "." + centisec
        let resultArr: string[] = time.split("");
        let centisec: string, sec: string, min: string;

        if (resultArr.length >= 5) {
            centisec =
                resultArr[resultArr.length - 2] +
                resultArr[resultArr.length - 1];
            resultArr.pop();
            resultArr.pop();
            sec =
                resultArr[resultArr.length - 2] +
                resultArr[resultArr.length - 1];
            resultArr.pop();
            resultArr.pop();
            min = resultArr.join("");
        } else if (resultArr.length == 4) {
            centisec =
                resultArr[resultArr.length - 2] +
                resultArr[resultArr.length - 1];
            resultArr.pop();
            resultArr.pop();
            sec =
                resultArr[resultArr.length - 2] +
                resultArr[resultArr.length - 1];
            min = "0";
        } else if (resultArr.length == 3) {
            centisec =
                resultArr[resultArr.length - 2] +
                resultArr[resultArr.length - 1];
            resultArr.pop();
            resultArr.pop();
            sec = "0" + resultArr[resultArr.length - 1];
            min = "0";
        } else if (resultArr.length == 2) {
            centisec =
                resultArr[resultArr.length - 2] +
                resultArr[resultArr.length - 1];
            sec = "0";
            min = "0";
        } else {
            centisec = "0" + resultArr[resultArr.length - 1];
            sec = "0";
            min = "0";
        }

        result = parseInt(min)
            ? `${min}:${sec}.${centisec}`
            : `${sec}.${centisec}`;
    }

    return result;
}

export default formatNormal;
