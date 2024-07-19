function formatNormal(time: string): string{
    let result: string;

    //* Actual time formatting
    let timeNum: number = Number(time)

    let minutes: number = Math.trunc(timeNum / 6000);
    let seconds: number = Math.trunc((timeNum - (minutes * 6000)) / 100);
    let centiseconds: number = Math.trunc(timeNum - ((minutes * 6000) + (seconds * 100)))

    //* conversion from number to string
    let secondsStr: string = seconds.toString();
    let centisecondsStr: string = centiseconds.toString();

    //* adding 0 in front of 1 digit numbers
    if(secondsStr.length == 1 && minutes){
        secondsStr = "0" + secondsStr
    }
    if(centisecondsStr.length == 1){
        centisecondsStr = "0" + centisecondsStr
    }

    //* returning correct-looking result
    result = minutes ? `${minutes}:${secondsStr}.${centisecondsStr}` : `${secondsStr}.${centisecondsStr}`

    return result;
}

export default formatNormal