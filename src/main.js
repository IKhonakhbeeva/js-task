import Phaser from 'phaser'

function startGame() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const phaserGameConfig = {
        type: Phaser.WEBGL,
        backgroundColor: '#DDDDDD',
        parent: 'gameWrapper',
        width: 640,
        height: 512,
        render: {
            powerPreference: 'high-performance',
            mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
        },
        scale: {
            mode: Phaser.Scale.NONE,
        },
        scene: [
            {
                key: 'default',
                preload,
                create,
                update,
                active: true,
            },
        ],
        audio: {
            context: audioContext,
        },
    }
    new Phaser.Game(phaserGameConfig)
}

function preload() {
    // load your assets here
    this.load.setPath('assets')
    this.load.image('star', 'symbols/01_star.png')
    this.load.image('circle', 'symbols/02_circle.png')
    this.load.image('triangle', 'symbols/03_triangle.png')
    this.load.image('square', 'symbols/04_square.png')
}

function update(tt, dt) {
    // use for doing smthing on every frame
    for (let spinner of this.spinners) {
        spinner.nextFrame(tt, dt)
    }
}

function create() {
    // Global shortcut for current scene
    window.PHASER = this

    // start your code here
    const minSpeed = 100
    const maxSpeed = 200
    const symbols = ['star', 'circle', 'triangle', 'square']
    this.spinners = []
    for (let i = 0; i < 5; i++) {
        this.spinners[i] = new Spinner(PHASER, symbols)
        this.spinners[i].setBorders(50 + i * 100, 50, 100, 300)
        this.spinners[i].speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
    }
}

window.startGame = startGame

class Spinner {
    constructor(scene, symbols) {
        this.scene = scene
        this.symbols = symbols
        this.spinSize = 3
        const sceneWidth = scene.sys.game.scale.gameSize.width
        const sceneHeight = scene.sys.game.scale.gameSize.height
        this.curUpImage = Math.floor(Math.random() * this.symbols.length)
        this.images = []
        for (let i = 0; i <= this.spinSize; i++) {
            let texture = (this.curUpImage - i) % this.symbols.length
            if (texture < 0) texture += this.symbols.length
            this.images[i] = this.scene.add.image().setTexture(this.symbols[texture])
        }
        this.images[0].setCrop(0, 0, this.images[0].width, 0)
    }
    setBorders(left, top, width, height) {
        this.top = top
        this.bottom = top + height
        let right = left + width
        let bottom = this.bottom

        this.cellHeight = height / this.spinSize
        for (let i = 0; i <= this.spinSize; i++) {
            let img = this.images[i]
            img.displayHeight = this.cellHeight
            img.displayWidth = width
            img.setScale(Math.min(img.scaleX, img.scaleY))
            this.images[i].x = (right + left) / 2
            this.images[i].y = top + this.cellHeight * (i - 0.5)
        }

        let path = this.scene.add.graphics()
        path.lineStyle(1, 0x000000)

        path.beginPath()
        path.moveTo(left, top)
        path.lineTo(left, bottom)
        path.lineTo(right, bottom)
        path.lineTo(right, top)
        path.closePath()

        for (let i = 1; i < this.spinSize; i++) {
            path.moveTo(left, top + this.cellHeight * i)
            path.lineTo(right, top + this.cellHeight * i)
        }

        path.strokePath()
    }
    moveImage(img, dt) {
        img.y += (dt / 1000) * this.speed
        if (img.y >= this.bottom + this.cellHeight / 2) {
            img.y -= (this.spinSize + 1) * this.cellHeight
            this.curUpImage = (this.curUpImage + 1) % this.symbols.length
            // let lastW = img.displayWidth
            // let lastH = img.displayHeight
            img.setTexture(this.symbols[this.curUpImage])
            // img.displayWidth = lastW
            // img.displayHeight = lastH
            img.setCrop(0, 0, img.width, 0)
        } else if (img.y >= this.bottom - img.displayHeight / 2) {
            let displayH = Math.max(this.bottom + img.displayHeight / 2 - img.y, 0)
            let resH = Math.floor(displayH / img.scaleY)
            img.setCrop(0, 0, img.width, resH)
        } else if (img.y <= this.top + img.displayHeight / 2) {
            let displayH = Math.max(img.y + img.displayHeight / 2 - this.top, 0)
            let resH = Math.floor(displayH / img.scaleY)
            img.setCrop(0, img.height - resH, img.width, resH)
        } else {
            img.setCrop()
        }
    }
    nextFrame(tt, dt) {
        for (let img of this.images) {
            this.moveImage(img, dt)
        }
    }
}
