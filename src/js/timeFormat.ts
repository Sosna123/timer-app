function formatNormal(
    time: string,
    mode: "msIntoTime" | "addDots" | "calcNumBasedStr" = "msIntoTime"
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
    } else if (mode == "addDots") {
        //* adding "dots" to make 123456 into 12:34.56
        let hundreths: string[] = [...time].slice(time.length - 2, time.length);
        if (hundreths.length == 1) {
            hundreths.unshift("0");
        }
        let seconds: string[] = [...time].slice(
            time.length - 4,
            time.length - 2
        );
        if (seconds.length == 0) {
            seconds.unshift("0", "0");
        } else if (seconds.length == 1) {
            seconds.unshift("0");
        }
        let minutes: string[] = [...time].slice(0, time.length - 4);

        let result = seconds.join("") + "." + hundreths.join("");
        if (minutes.length) {
            result = minutes.join("") + ":" + result;
        }
        return result;
    } else {
        //* calculating the number in ms from the string
        let hundreths: string[] = [...time].slice(time.length - 2, time.length);
        if (hundreths.length == 1) {
            hundreths.unshift("0");
        }
        let seconds: string[] = [...time].slice(
            time.length - 4,
            time.length - 2
        );
        if (seconds.length == 0) {
            seconds.unshift("0", "0");
        } else if (seconds.length == 1) {
            seconds.unshift("0");
        }
        let minutes: string[] = [...time].slice(0, time.length - 4);

        let result =
            Number(minutes.join("")) * 6000 +
            Number(seconds.join("")) * 100 +
            Number(hundreths.join(""));

        return result.toString();
    }
}

export default formatNormal;
