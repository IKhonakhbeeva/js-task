'use strict'

const minSpeed = 400
const maxSpeed = minSpeed * 2
const lowSpeed = minSpeed / 4
const accel = minSpeed

export default class Spinner {
    _spinSize = 3
    _state = 'idle'
    _speed = 0
    constructor(scene, symbols, left, top, width, height) {
        this._symbols = symbols
        this._curUpImage = Math.floor(Math.random() * this._symbols.length)
        this._images = []
        for (let i = 0; i <= this._spinSize; i++) {
            let texture = (this._curUpImage - i) % this._symbols.length
            if (texture < 0) texture += this._symbols.length
            this._images[i] = scene.add.image().setTexture(this._symbols[texture])
        }
        this._images[0].setCrop(0, 0, this._images[0].width, 0)
        this._setBorders(scene, left, top, width, height)
    }

    _setBorders(scene, left, top, width, height) {
        this._top = top
        this._bottom = top + height
        let right = left + width
        let bottom = this._bottom

        this._cellHeight = height / this._spinSize
        for (let i = 0; i <= this._spinSize; i++) {
            let img = this._images[i]
            // Rescale for optimal size
            img.displayHeight = this._cellHeight
            img.displayWidth = width
            img.setScale(Math.min(img.scaleX, img.scaleY))

            this._images[i].x = (right + left) / 2
            this._images[i].y = top + this._cellHeight * (i - 0.5)
        }

        // Draw borders
        let path = scene.add.graphics()
        path.lineStyle(1, 0x000000)

        path.beginPath()
        path.moveTo(left, top)
        path.lineTo(left, bottom)
        path.lineTo(right, bottom)
        path.lineTo(right, top)
        path.closePath()

        for (let i = 1; i < this._spinSize; i++) {
            path.moveTo(left, top + this._cellHeight * i)
            path.lineTo(right, top + this._cellHeight * i)
        }

        path.strokePath()
    }

    _moveImage(img, delta) {
        img.y += delta
        if (img.y >= this._bottom + this._cellHeight / 2) {
            // Image is fully under spinner bottom, need to move it up
            img.y -= (this._spinSize + 1) * this._cellHeight
            this._curUpImage = (this._curUpImage + 1) % this._symbols.length
            img.setTexture(this._symbols[this._curUpImage])
            img.setCrop(0, 0, img.width, 0)
        } else if (img.y >= this._bottom - img.displayHeight / 2) {
            // Image is partly under spinner bottom, need to crop it
            let displayH = Math.max(this._bottom + img.displayHeight / 2 - img.y, 0)
            let resH = Math.floor(displayH / img.scaleY)
            img.setCrop(0, 0, img.width, resH)
        } else if (img.y <= this._top + img.displayHeight / 2) {
            // Image is partly above spinner top, need to crop it
            let displayH = Math.max(img.y + img.displayHeight / 2 - this._top, 0)
            let resH = Math.floor(displayH / img.scaleY)
            img.setCrop(0, img.height - resH, img.width, resH)
        } else {
            // Image is fully visible, need to unset cropping
            img.setCrop()
        }
    }

    nextFrame(tt, dt) {
        switch (this._state) {
            case 'idle':
                // Don't need to move images
                return
            case 'starting':
                this._speed += (accel * dt) / 1000
                if (this._speed >= this._spinSpeed) {
                    this._speed = this._spinSpeed
                    this._state = 'running'
                }
                break
            case 'stopping':
                this._speed -= (accel * dt) / 1000
                if (this._speed <= lowSpeed) {
                    this._speed = lowSpeed
                    this._state = 'lastValue'
                }
                break
        }
        this._moveImages(dt)
    }

    _moveImages(dt) {
        let delta = (dt / 1000) * this._speed
        // If this is last value, need to stop in right position
        if (this._state === 'lastValue') {
            let minY = Math.min(...this._images.map(img => img.y))
            if (minY + delta >= this._top + this._cellHeight / 2) {
                this._speed = 0
                this._state = 'idle'
                delta = this._top + this._cellHeight / 2 - minY
            }
        }
        for (let img of this._images) {
            this._moveImage(img, delta)
        }
    }
    start() {
        this._spinSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed)
        this._state = 'starting'
    }
    stop() {
        this._state = 'stopping'
    }
    isIdle() {
        return this._state === 'idle'
    }
    isRunning() {
        return this._state === 'running'
    }
}
