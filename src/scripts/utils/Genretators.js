class Generators {
    static colorGenerator () {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    static randomValGenerator (min, max) {

        if (max === undefined) {
            max = min;
            min = 0;
        }

        return min + (max - min) * Math.random();

    }

    static positionGenerator (min, max) {
        return [
            this.randomValGenerator(min, max),
            this.randomValGenerator(min, max),
            this.randomValGenerator(min, max),
        ]
    }
}

export default Generators;