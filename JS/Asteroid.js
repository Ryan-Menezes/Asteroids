class Asteroid extends Circle{
	constructor(x, y, velX, velY, raio, img){
		super(x, y, raio, img)

		this.angle = 0
		this.velX = velX
		this.velY = velY
		this.srcXIndex = Math.round(Math.random() * 1)
		this.srcYIndex = Math.round(Math.random() * 1)
	}

	duplicate(posX, posY){
		this.raio /= 2

		let ang = Math.atan2(this.distanceX(posX), this.distanceY(posY))

		this.x += Math.cos(ang)
		this.y += Math.sin(ang)
		this.velX *= Math.cos(ang)
		this.velY *= Math.sin(ang)

		return new Asteroid(this.x, this.y, -this.velX, -this.velY, this.raio, this.img)
	}

	draw(ctx){
		let widthSrc = this.img.width / 2
		let heightSrc = this.img.height / 2
		let srcX = widthSrc * this.srcXIndex
		let srcY = heightSrc * this.srcYIndex
		
		ctx.drawImage(this.img, srcX, srcY, widthSrc, heightSrc, this.x, this.y, this.diameter(), this.diameter())
	}

	update(cnv){
		this.x += this.velX
		this.y += this.velY
	}
}