class Nave extends Rectangle{
	constructor(x, y, size, img, sound, player){
		super(x, y, size, size, img)

		this.angle = 0
		this.vel = 5
		this.player = player
		this.sound = sound
		this.invincible = false
		this.controller = null
		this.turns = 0
	}

	shoot(mouse, velocidade, raio, img, sound){
		let x = mouse.x - this.centerX()
		let y = mouse.y - this.centerY()

		let sin = Math.sin(Math.atan2(x, y))
		let cos = Math.cos(Math.atan2(x, y))

		let velX = velocidade * sin
		let velY = velocidade * cos

		return new Tiro(this.centerX() + (this.halfWidth() * sin) - (raio * 2), this.centerY() + (this.halfHeight() * cos) - (raio * 2), velX, velY, raio, img, sound, this.player)
	}

	draw(ctx){
		ctx.save()
		ctx.translate(this.centerX(), this.centerY())
		ctx.rotate(-this.angle)

		if(this.invincible){
			if(this.turns % 10 == 0) ctx.drawImage(this.img, -this.halfWidth(), -this.halfHeight(), this.width, this.height)
		}else{
			ctx.drawImage(this.img, -this.halfWidth(), -this.halfHeight(), this.width, this.height)
		}

		ctx.restore()
	}

	update(cnv, mouse, controller){
		// Rotacionando a nave

		this.angle = Math.atan2(this.centerX() - mouse.x, this.centerY() - mouse.y)

		// Setando o controller se a nave não for um jogador

		if(!this.player && this.controller !== null) controller = this.controller
		else if(this.controller === null) this.controller = controller

		// Movendo a nave

		if(controller.top) this.y -= this.vel
		if(controller.bottom) this.y += this.vel
		if(controller.left) this.x -= this.vel
		if(controller.right) this.x += this.vel

		if((controller.top || controller.bottom || controller.left || controller.right) && this.sound !== undefined && this.sound.play !== undefined) this.sound.play()

		// Detectando se a nave últrapassou os limites de tela

		if(this.player){
			this.x = Math.max(0, Math.min(this.x, cnv.width - this.width))
			this.y = Math.max(0, Math.min(this.y, cnv.height - this.height))
		}

		this.turns++
	}

	ghost(){
		this.invincible = true
		setTimeout(() => this.invincible = false, 2000)
	}

	distanceX(x){
		return this.x - x
	}

	distanceY(y){
		return this.y - y
	}
}