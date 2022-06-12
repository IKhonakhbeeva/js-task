import Phaser from 'phaser'
import Spinner from './spinner.js'

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
    this.load.image('start', 'interface/play.png')
    this.load.image('stop', 'interface/stop.png')
}

function update(tt, dt) {
    // use for doing smthing on every frame
    if (!this._startButton.input.enabled && this.spinners.every(s => s.isIdle())) {
        this._startButton.setInteractive({ useHandCursor: true })
    }
    for (let spinner of this.spinners) {
        spinner.nextFrame(tt, dt)
    }
}

function create() {
    // Global shortcut for current scene
    window.PHASER = this

    // Create spinners
    const symbols = ['star', 'circle', 'triangle', 'square']
    this.spinners = []
    for (let i = 0; i < 5; i++) {
        this.spinners[i] = new Spinner(PHASER, symbols)
        this.spinners[i].setBorders(50 + i * 100, 50, 100, 300)
    }

    // Create buttons
    this.start = () => {
        for (let spinner of this.spinners) {
            spinner.start()
        }
        this._startButton.disableInteractive()
        this._stopButton.setInteractive({ useHandCursor: true })
        setTimeout(this.stop, 3000)
    }

    this.stop = () => {
        this._stopButton.disableInteractive()
        for (let spinner of this.spinners) {
            spinner.stop()
        }
    }

    this._startButton = this.add
        .image(100, 400, 'start')
        .setScale(0.3)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', this.start)
    this._stopButton = this.add.image(300, 400, 'stop').setScale(0.3).on('pointerdown', this.stop)
}

window.startGame = startGame
