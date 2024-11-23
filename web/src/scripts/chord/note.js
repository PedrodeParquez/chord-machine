export class Note {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.key = path.split('/').pop().split('.').shift();
        this.sound = new Howl({ src: [path] });
    }

    play() {
        this.sound.play();
    }

    stop() {
        this.sound.stop();
    }

    highlight() {
        const keyElement = document.getElementById(this.key);
            if (keyElement) {
                keyElement.classList.add('active');
            }
    }

    unhighlight() {
        const keyElement = document.getElementById(this.key);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }
}