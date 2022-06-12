let minSpeed = 300
let maxSpeed = 700
let lastSpeed = 70

export default class Spinner {
    _spinSize = 3
    _state = 'idle'
    _acc = 200
    constructor(scene, symbols) {
        this.scene = scene
        this.symbols = symbols
        this.speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
        // const sceneWidth = scene.sys.game.scale.gameSize.width
        // const sceneHeight = scene.sys.game.scale.gameSize.height
        this.curUpImage = Math.floor(Math.random() * this.symbols.length)
        this.images = []
        for (let i = 0; i <= this._spinSize; i++) {
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

        this.cellHeight = height / this._spinSize
        for (let i = 0; i <= this._spinSize; i++) {
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

        for (let i = 1; i < this._spinSize; i++) {
            path.moveTo(left, top + this.cellHeight * i)
            path.lineTo(right, top + this.cellHeight * i)
        }

        path.strokePath()
    }
    moveImage(img, delta) {
        img.y += delta
        if (img.y >= this.bottom + this.cellHeight / 2) {
            img.y -= (this._spinSize + 1) * this.cellHeight
            this.curUpImage = (this.curUpImage + 1) % this.symbols.length
            // Uncomment for images of different sizes
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
        switch (this._state) {
            case 'idle':
                return
            case 'start':
                this.speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
                this._startTime = tt
                this._state = 'running'
                break
            case 'stopping':
                this.speed -= (this._acc * dt) / 1000
                if (this.speed <= lastSpeed) {
                    this._state = 'lastValue'
                    this.speed = lastSpeed
                }
                break
        }
        this.moveImages(dt)
    }
    moveImages(dt) {
        let delta = (dt / 1000) * this.speed
        if (this._state === 'lastValue') {
            let minY = Math.min(...this.images.map(img => img.y))
            if (minY + delta >= this.top + this.cellHeight / 2) {
                this._state = 'idle'
                delta = this.top + this.cellHeight / 2 - minY
            }
        }
        for (let img of this.images) {
            this.moveImage(img, delta)
        }
    }
    start() {
        this._state = 'start'
    }
    stop() {
        this._state = 'stopping'
    }
    isIdle() {
        return this._state === 'idle'
    }
}
