import Phaser from 'phaser'
import Spinner from './spinner.js'

function startGame() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const phaserGameConfig = {
        type: Phaser.WEBGL,
        backgroundColor: '#DDDDDD',
        parent: 'gameWrapper',
        width: 1000,
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
    // We can reroll only after all spinners stopped
    if (!this._startButton.input.enabled && this._spinners.every(s => s.isIdle())) {
        this._startButton.setInteractive({ useHandCursor: true })
    }
    // We can stop only when all spinners runs on full speed
    if (!this._stopButton.input.enabled && this._spinners.every(s => s.isRunning())) {
        this._stopButton.setInteractive({ useHandCursor: true })
    }

    for (let spinner of this._spinners) {
        spinner.nextFrame(tt, dt)
    }
}

function create() {
    // Global shortcut for current scene
    window.PHASER = this

    // Count sizes for spinners and buttons
    const spinCount = 5
    const sceneWidth = this.sys.game.scale.gameSize.width
    const sceneHeight = this.sys.game.scale.gameSize.height
    const indentHeight = sceneHeight * 0.1
    const indentWidth = sceneWidth * 0.1
    const spinWidth = (sceneWidth - 2 * indentWidth) / spinCount
    const spinHeight = sceneHeight - 4 * indentHeight

    // Create spinners
    const symbols = ['star', 'circle', 'triangle', 'square']
    this._spinners = []
    for (let i = 0; i < spinCount; i++) {
        this._spinners[i] = new Spinner(
            PHASER,
            symbols,
            indentWidth + i * spinWidth,
            indentHeight,
            spinWidth,
            spinHeight,
        )
    }

    // Create callbacks for buttons
    this._startCallback = () => {
        for (let spinner of this._spinners) {
            spinner.start()
        }
        this._startButton.disableInteractive()
        this._timer = setTimeout(this._stopCallback, 4000)
    }

    this._stopCallback = () => {
        this._stopButton.disableInteractive()
        for (let spinner of this._spinners) {
            spinner.stop()
        }
        clearTimeout(this._timer)
    }

    // Create buttons
    this._startButton = createButton(
        this,
        sceneWidth / 3,
        sceneHeight - 1.5 * indentHeight,
        'start',
        indentHeight,
        this._startCallback,
    )
    this._stopButton = createButton(
        this,
        (sceneWidth * 2) / 3,
        sceneHeight - 1.5 * indentHeight,
        'stop',
        indentHeight,
        this._stopCallback,
    )
}

function createButton(scene, x, y, texture, imgHeight, callback) {
    let img = scene.add
        .image(x, y, texture)
        .on('pointerdown', callback)
        .setInteractive({ useHandCursor: true })
        .disableInteractive()
    img.displayHeight = imgHeight
    img.scaleX = img.scaleY
    return img
}

window.startGame = startGame
